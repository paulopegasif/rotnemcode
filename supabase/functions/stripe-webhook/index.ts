// Supabase Edge Function: Stripe Webhook
// Handles subscription events and updates `subscriptions` and `entitlements`
// Deploy with: supabase functions deploy stripe-webhook

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.1';

// Stripe SDK for signature verification (Deno compatible via ESM)
import Stripe from 'https://esm.sh/stripe@12.19.0?target=deno';

// Expected env vars configured in Supabase project
// STRIPE_WEBHOOK_SECRET: signing secret for webhook
// SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: for DB updates
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') ?? '', {
  apiVersion: '2023-10-16',
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json' },
    status,
  });
}

async function upsertSubscription(payload: any) {
  const customerId: string | undefined = payload?.data?.object?.customer;
  const status: string | undefined = payload?.data?.object?.status;
  const currentPeriodEnd: number | undefined = payload?.data?.object?.current_period_end;

  if (!customerId) throw new Error('Missing customer id');

  // Find user by stripe_customer_id in profiles
  const { data: profiles, error: profileErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .limit(1);
  if (profileErr) throw profileErr;
  const userId = profiles?.[0]?.id;
  if (!userId) throw new Error('No profile mapped to this customer');

  // Upsert subscription
  const { error: subErr } = await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      provider: 'stripe',
      status,
      current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
    },
    { onConflict: 'user_id' }
  );
  if (subErr) throw subErr;

  // Update entitlements based on status
  const active = status === 'active' || status === 'trialing';
  const { error: entErr } = await supabase.from('entitlements').upsert({
    user_id: userId,
    can_publish: active,
    max_assets: active ? 500 : 50,
    max_code_size_kb: active ? 1024 : 256,
    daily_upload_limit: active ? 50 : 10,
  });
  if (entErr) throw entErr;
}

serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const sig = req.headers.get('stripe-signature') ?? '';
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return json({ error: 'Invalid signature', details: String(err) }, 400);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // Attach customer id to profile using email match as fallback
        // In production, set metadata during checkout to user id
        // Here, we only acknowledge; mapping should happen on account creation
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await upsertSubscription(event);
        break;
      default:
        // Ignore other events
        break;
    }
    return json({ received: true });
  } catch (err) {
    return json({ error: 'Processing failed', details: String(err) }, 500);
  }
});
