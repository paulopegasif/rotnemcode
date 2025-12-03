-- Migration: 004_billing.sql
-- Description: Subscriptions and entitlements for monthly billing
-- Date: 2025-12-03

-- Add Stripe customer id to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  provider TEXT DEFAULT 'stripe' NOT NULL,
  status TEXT CHECK (status IN ('active','past_due','canceled')) NOT NULL,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Entitlements table
CREATE TABLE IF NOT EXISTS entitlements (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  can_publish BOOLEAN DEFAULT false NOT NULL,
  max_assets INTEGER DEFAULT 50 NOT NULL,
  max_code_size_kb INTEGER DEFAULT 256 NOT NULL,
  daily_upload_limit INTEGER DEFAULT 10 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Triggers
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_entitlements_updated_at
  BEFORE UPDATE ON entitlements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Edge function can insert/update subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Edge function can update subscriptions"
  ON subscriptions FOR UPDATE
  USING (true);

CREATE POLICY "Users can view own entitlements"
  ON entitlements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Edge function can upsert entitlements"
  ON entitlements FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Edge function can update entitlements"
  ON entitlements FOR UPDATE
  USING (true);
