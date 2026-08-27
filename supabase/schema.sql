-- =========================================================
-- Supabase Schema Migration: Add Geospatial & Map Fields
-- Run this script in the Supabase Dashboard SQL Editor
-- =========================================================

-- 1. Create properties table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    listing_type TEXT DEFAULT 'sale',
    property_type TEXT DEFAULT 'apartment',
    price TEXT,
    numeric_price NUMERIC,
    currency TEXT DEFAULT 'USD',
    country TEXT,
    city TEXT,
    district TEXT,
    address TEXT,
    location TEXT,
    area NUMERIC,
    area_unit TEXT DEFAULT 'sqm',
    bedrooms NUMERIC,
    bathrooms NUMERIC,
    parking_spaces NUMERIC,
    floor_number NUMERIC,
    legal_status TEXT DEFAULT 'freehold',
    status TEXT DEFAULT 'available',
    amenities TEXT[],
    images TEXT[],
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    map_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Alter existing properties table to add geospatial columns if missing
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS map_url TEXT;

-- 3. Create spatial index for fast coordinate querying (Optional)
CREATE INDEX IF NOT EXISTS idx_properties_user_email ON public.properties(user_email);
CREATE INDEX IF NOT EXISTS idx_properties_coords ON public.properties(latitude, longitude);
