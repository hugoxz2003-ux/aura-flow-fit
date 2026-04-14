-- CRM SOCIAL SETUP - PRODUCTION READY
-- Run this in Supabase SQL Editor

-- 1. COMPANIES TABLE
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    handle TEXT UNIQUE NOT NULL,
    industry TEXT,
    brand_style JSONB DEFAULT '{"primary_color": "#06B6D4", "font": "Inter", "vibe": "Elite"}'::jsonb,
    logo_url TEXT,
    owner_email TEXT
);

-- 2. SCHEMA UPDATE (MIGRATION)
DO $$ 
BEGIN 
    -- Ensure company_id exists in socios
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='company_id') THEN
        ALTER TABLE public.socios ADD COLUMN company_id UUID REFERENCES public.companies(id);
    END IF;
    
    -- Ensure company_id exists in leads
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='company_id') THEN
        ALTER TABLE public.leads ADD COLUMN company_id UUID REFERENCES public.companies(id);
    END IF;
END $$;

-- 3. SOCIAL POSTS TABLE
CREATE TABLE IF NOT EXISTS public.social_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL, -- 'Reel', 'Post', 'Video'
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    media_url TEXT,
    caption TEXT,
    status TEXT DEFAULT 'Draft'
);

-- 4. INITIAL TENANTS DATA
-- We use DO block to handle conditional insert/update safely
DO $$
DECLARE
    aura_id UUID;
    star_id UUID;
BEGIN
    -- Insert/Get Aura Flow Fit
    INSERT INTO public.companies (name, handle, industry, brand_style, owner_email)
    VALUES ('Aura Flow Fit', '@auraflowfit', 'Pilates Reformer', '{"primary_color": "#06B6D4", "vibe": "Elite"}', 'ventas@auraflow.cl')
    ON CONFLICT (handle) DO UPDATE SET owner_email = EXCLUDED.owner_email
    RETURNING id INTO aura_id;

    -- Insert/Get Starfit Chile
    INSERT INTO public.companies (name, handle, industry, brand_style, owner_email)
    VALUES ('Starfit Chile', '@starfit_chile', 'Fitness Equipment', '{"primary_color": "#EF4444", "vibe": "Energetic"}', 'contacto@starfit.cl')
    ON CONFLICT (handle) DO UPDATE SET owner_email = EXCLUDED.owner_email
    RETURNING id INTO star_id;

    -- Optional: Re-link existing data if company_id is null
    UPDATE public.socios SET company_id = aura_id WHERE company_id IS NULL; -- Defaulting to Aura for first migration
END $$;

-- 5. RLS (Optional but recommended for SaaS)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.socios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- Simple Policy: Users can only see data from their own company_id
-- (Assumes you are using Supabase Auth and linking users to companies via metadata or mapping table)
-- For now, we leave them wide open or tied to owner_email if simplicity is preferred.
