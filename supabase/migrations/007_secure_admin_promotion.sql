-- Migration: 007_secure_admin_promotion.sql
-- Description: Security policies for admin promotion and audit logging
-- Date: 2025-12-04

-- =============================================================================
-- PART 1: Admin Actions Audit Log Table
-- =============================================================================

CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for efficient queries
CREATE INDEX idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_target_user_id ON admin_actions(target_user_id);
CREATE INDEX idx_admin_actions_action ON admin_actions(action);
CREATE INDEX idx_admin_actions_created_at ON admin_actions(created_at DESC);

-- =============================================================================
-- PART 2: RLS Policies for admin_actions
-- =============================================================================

ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin action logs
CREATE POLICY "Only admins can view admin actions"
  ON admin_actions FOR SELECT
  USING (is_admin(auth.uid()));

-- System can insert logs (triggers)
CREATE POLICY "System can insert admin actions"
  ON admin_actions FOR INSERT
  WITH CHECK (true);

-- =============================================================================
-- PART 3: Trigger to Log Admin Promotions/Demotions
-- =============================================================================

CREATE OR REPLACE FUNCTION log_admin_promotion()
RETURNS TRIGGER AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Only log if is_admin actually changed
  IF OLD.is_admin IS DISTINCT FROM NEW.is_admin THEN
    -- Get current user (may be NULL if executed via SQL Editor)
    current_user_id := auth.uid();
    
    INSERT INTO admin_actions (
      admin_id, 
      action, 
      target_user_id, 
      metadata
    )
    VALUES (
      current_user_id,
      CASE 
        WHEN NEW.is_admin THEN 'PROMOTE_TO_ADMIN' 
        ELSE 'DEMOTE_FROM_ADMIN' 
      END,
      NEW.id,
      jsonb_build_object(
        'old_value', OLD.is_admin,
        'new_value', NEW.is_admin,
        'timestamp', NOW(),
        'via_sql_editor', current_user_id IS NULL
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_admin_changes
  AFTER UPDATE OF is_admin ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_promotion();

-- =============================================================================
-- PART 4: Prevent Self-Promotion
-- =============================================================================

CREATE OR REPLACE FUNCTION prevent_self_admin_promotion()
RETURNS TRIGGER AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get current user (may be NULL if executed via SQL Editor)
  current_user_id := auth.uid();
  
  -- If trying to promote to admin
  IF NEW.is_admin = true AND OLD.is_admin = false THEN
    -- Only check if there's an authenticated session
    IF current_user_id IS NOT NULL THEN
      -- Check if user is trying to promote themselves
      IF NEW.id = current_user_id THEN
        -- Only allow if already admin
        IF NOT is_admin(current_user_id) THEN
          RAISE EXCEPTION 'Self-promotion to admin is not allowed. Admin privileges must be granted by another administrator.';
        END IF;
      END IF;
    END IF;
    -- If current_user_id IS NULL (SQL Editor), allow the operation
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_admin_promotion
  BEFORE UPDATE OF is_admin ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_self_admin_promotion();

-- =============================================================================
-- PART 5: Update Profile Policy to Protect is_admin Field
-- =============================================================================

-- Drop existing policy
DROP POLICY IF EXISTS "Update profiles (admin override)" ON profiles;
DROP POLICY IF EXISTS "Update profiles with is_admin protection" ON profiles;

-- Create new policy that protects is_admin field
-- Note: Cannot use OLD/NEW in policy USING clause, so we split into two policies
CREATE POLICY "Users can update own profile fields"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    -- Cannot change is_admin field unless you're already admin
    (is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid()))
    OR is_admin(auth.uid())
  );

-- Separate policy for admin updates
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (is_admin(auth.uid()));

-- =============================================================================
-- PART 6: Helper Function to Check Admin Actions
-- =============================================================================

-- Function to get recent admin actions (callable from client via RPC)
CREATE OR REPLACE FUNCTION get_recent_admin_actions(limit_count INT DEFAULT 50)
RETURNS TABLE (
  id UUID,
  admin_email TEXT,
  action TEXT,
  target_email TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Only admins can call this function
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only administrators can view admin action logs';
  END IF;

  RETURN QUERY
  SELECT 
    aa.id,
    admin_users.email AS admin_email,
    aa.action,
    target_users.email AS target_email,
    aa.metadata,
    aa.created_at
  FROM admin_actions aa
  LEFT JOIN auth.users admin_users ON aa.admin_id = admin_users.id
  LEFT JOIN auth.users target_users ON aa.target_user_id = target_users.id
  ORDER BY aa.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
