// Supabase Edge Function: Publish Asset
// Validates entitlements and quotas before allowing asset publication
// Deploy with: supabase functions deploy publish-asset

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.1';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json' },
    status,
  });
}

serve(async (req) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  // Get Authorization header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return json({ error: 'Unauthorized', message: 'Missing Authorization header' }, 401);
  }

  // Create client with user token (validates authentication)
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  // Create admin client for bypassing RLS when needed
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Parse request body
    const { assetId, isPublic } = await req.json();

    if (!assetId) {
      return json({ error: 'Bad Request', message: 'Missing assetId' }, 400);
    }

    if (typeof isPublic !== 'boolean') {
      return json({ error: 'Bad Request', message: 'isPublic must be a boolean' }, 400);
    }

    // 1. Validate authentication
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return json({ error: 'Unauthorized', message: 'Invalid or expired token' }, 401);
    }

    // 2. Verify asset exists and user owns it (or is admin)
    const { data: asset, error: assetError } = await supabaseAdmin
      .from('assets')
      .select('user_id, is_public')
      .eq('id', assetId)
      .single();

    if (assetError) {
      return json({ error: 'Not Found', message: 'Asset not found' }, 404);
    }

    // Check if user is admin
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.is_admin === true;

    // Verify ownership (unless admin)
    if (!isAdmin && asset.user_id !== user.id) {
      return json({ error: 'Forbidden', message: 'You do not own this asset' }, 403);
    }

    // 3. If trying to make public (and not already public), validate entitlements
    if (isPublic && !asset.is_public && !isAdmin) {
      // Get user entitlements
      const { data: entitlements, error: entError } = await supabaseAdmin
        .from('entitlements')
        .select('can_publish, max_assets')
        .eq('user_id', user.id)
        .single();

      // Check if entitlements exist (should exist for all users after signup)
      if (entError || !entitlements) {
        return json(
          {
            error: 'Forbidden',
            message:
              'You need a Pro plan to publish assets publicly. Upgrade to Pro to unlock this feature.',
            code: 'ENTITLEMENT_MISSING',
          },
          403
        );
      }

      // Check if user can publish
      if (!entitlements.can_publish) {
        return json(
          {
            error: 'Forbidden',
            message:
              'You need a Pro plan to publish assets publicly. Upgrade to Pro to unlock this feature.',
            code: 'CANNOT_PUBLISH',
          },
          403
        );
      }

      // Check quota of public assets
      const { count, error: countError } = await supabaseAdmin
        .from('assets')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_public', true)
        .is('deleted_at', null);

      if (countError) {
        return json({ error: 'Internal Server Error', message: countError.message }, 500);
      }

      // Validate quota
      if (count !== null && count >= entitlements.max_assets) {
        return json(
          {
            error: 'Quota Exceeded',
            message: `You've reached your limit of ${entitlements.max_assets} public assets. Delete some assets or upgrade your plan.`,
            code: 'QUOTA_EXCEEDED',
            quota: {
              current: count,
              limit: entitlements.max_assets,
            },
          },
          403
        );
      }
    }

    // 4. Update asset (via SERVICE_ROLE_KEY to ensure success)
    const { error: updateError } = await supabaseAdmin
      .from('assets')
      .update({ is_public: isPublic, updated_at: new Date().toISOString() })
      .eq('id', assetId)
      .eq('user_id', asset.user_id); // Double-check ownership

    if (updateError) {
      return json({ error: 'Internal Server Error', message: updateError.message }, 500);
    }

    // 5. Success response
    return json({
      success: true,
      assetId,
      isPublic,
      message: isPublic ? 'Asset published successfully' : 'Asset unpublished successfully',
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return json({ error: 'Internal Server Error', message: String(err) }, 500);
  }
});
