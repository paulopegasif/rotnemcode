-- Migration: 002_rls_policies.sql
-- Description: Row Level Security policies for all tables
-- Date: 2025-12-03

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_forks ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_views ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Assets policies
CREATE POLICY "Public assets are viewable by everyone"
  ON assets FOR SELECT
  USING (
    (is_public = true AND deleted_at IS NULL)
    OR (auth.uid() = user_id)
  );

CREATE POLICY "Users can insert their own assets"
  ON assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets"
  ON assets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets (soft delete)"
  ON assets FOR DELETE
  USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Asset likes policies
CREATE POLICY "Asset likes are viewable by everyone"
  ON asset_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like assets"
  ON asset_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes"
  ON asset_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Asset forks policies
CREATE POLICY "Asset forks are viewable by everyone"
  ON asset_forks FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can fork assets"
  ON asset_forks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Asset views policies (more permissive for analytics)
CREATE POLICY "Asset views are viewable by asset owner"
  ON asset_views FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM assets WHERE id = asset_id
    )
  );

CREATE POLICY "Anyone can insert asset views"
  ON asset_views FOR INSERT
  WITH CHECK (true);
