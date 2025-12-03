-- Migration: 001_initial_schema.sql
-- Description: Create initial tables, enums, and extensions
-- Date: 2025-12-03

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create enums
CREATE TYPE asset_type AS ENUM ('Template', 'Section', 'CSS', 'JS', 'HTML');

CREATE TYPE component_category AS ENUM (
  'codes',
  'buttons',
  'forms',
  'animations',
  'advanced-animations',
  'carousels',
  'hovers',
  'customizations',
  'compositions',
  'tools',
  'hero',
  'footer',
  'pricing',
  'faq'
);

CREATE TYPE user_plan AS ENUM ('free', 'pro', 'enterprise');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  plan user_plan DEFAULT 'free' NOT NULL,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Assets table
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL, -- Denormalized for easier queries
  title TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  type asset_type NOT NULL,
  category component_category,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT true NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  thumbnail_url TEXT,
  views_count INTEGER DEFAULT 0 NOT NULL,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  forks_count INTEGER DEFAULT 0 NOT NULL,
  forked_from UUID REFERENCES assets(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  search_vector tsvector
);

-- Favorites table
CREATE TABLE favorites (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, asset_id)
);

-- Asset likes table
CREATE TABLE asset_likes (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, asset_id)
);

-- Asset forks table
CREATE TABLE asset_forks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  forked_asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Asset views table (for analytics)
CREATE TABLE asset_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX idx_assets_user_id ON assets(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_created_at ON assets(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_is_public ON assets(is_public) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_type ON assets(type) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_category ON assets(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_tags ON assets USING GIN(tags);
CREATE INDEX idx_assets_search_vector ON assets USING GIN(search_vector);
CREATE INDEX idx_assets_forked_from ON assets(forked_from) WHERE forked_from IS NOT NULL;

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_asset_id ON favorites(asset_id);

CREATE INDEX idx_asset_likes_asset_id ON asset_likes(asset_id);
CREATE INDEX idx_asset_views_asset_id ON asset_views(asset_id);
CREATE INDEX idx_asset_views_created_at ON asset_views(created_at DESC);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_assets_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('simple', unaccent(COALESCE(NEW.title, ''))), 'A') ||
    setweight(to_tsvector('simple', unaccent(COALESCE(NEW.description, ''))), 'B') ||
    setweight(to_tsvector('simple', unaccent(array_to_string(NEW.tags, ' '))), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_assets_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, description, tags ON assets
  FOR EACH ROW
  EXECUTE FUNCTION update_assets_search_vector();

-- Function to sync likes count
CREATE OR REPLACE FUNCTION sync_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE assets 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.asset_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE assets 
    SET likes_count = GREATEST(likes_count - 1, 0) 
    WHERE id = OLD.asset_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_likes_count_trigger
  AFTER INSERT OR DELETE ON asset_likes
  FOR EACH ROW
  EXECUTE FUNCTION sync_likes_count();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
