-- Migration: 005_roles.sql
-- Description: Admin override policies and helper function
-- Date: 2025-12-03

-- Helper function: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS BOOLEAN AS $$
DECLARE
  flag BOOLEAN;
BEGIN
  SELECT p.is_admin INTO flag FROM profiles p WHERE p.id = uid;
  RETURN COALESCE(flag, false);
END;
$$ LANGUAGE plpgsql STABLE SECURITY INVOKER;

-- Update policies to allow admin override
-- Assets: admins can select/update/delete any
DROP POLICY IF EXISTS "Public assets are viewable by everyone" ON assets;
CREATE POLICY "Public assets are viewable (admin override)"
  ON assets FOR SELECT
  USING (
    is_admin(auth.uid())
    OR ((is_public = true AND deleted_at IS NULL) OR (auth.uid() = user_id))
  );

DROP POLICY IF EXISTS "Users can insert their own assets" ON assets;
CREATE POLICY "Insert own assets (admin override)"
  ON assets FOR INSERT
  WITH CHECK (
    is_admin(auth.uid()) OR auth.uid() = user_id
  );

DROP POLICY IF EXISTS "Users can update their own assets" ON assets;
CREATE POLICY "Update assets (admin override)"
  ON assets FOR UPDATE
  USING (
    is_admin(auth.uid()) OR auth.uid() = user_id
  );

DROP POLICY IF EXISTS "Users can delete their own assets (soft delete)" ON assets;
CREATE POLICY "Delete assets (admin override)"
  ON assets FOR DELETE
  USING (
    is_admin(auth.uid()) OR auth.uid() = user_id
  );

-- Favorites: admin can view all
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
CREATE POLICY "View favorites (admin override)"
  ON favorites FOR SELECT
  USING (is_admin(auth.uid()) OR auth.uid() = user_id);

-- Likes: admin can view all
DROP POLICY IF EXISTS "Asset likes are viewable by everyone" ON asset_likes;
CREATE POLICY "Asset likes viewable (admin override)"
  ON asset_likes FOR SELECT
  USING (true);

-- Forks: admin can view all
DROP POLICY IF EXISTS "Asset forks are viewable by everyone" ON asset_forks;
CREATE POLICY "Asset forks viewable (admin override)"
  ON asset_forks FOR SELECT
  USING (true);

-- Profiles: admin can update any
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles viewable (admin override)"
  ON profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Update profiles (admin override)"
  ON profiles FOR UPDATE
  USING (is_admin(auth.uid()) OR auth.uid() = id);
