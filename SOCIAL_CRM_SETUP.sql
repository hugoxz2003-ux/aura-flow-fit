-- AURA FLOW CRM: SaaS & SOCIAL SETUP (v1.0)
-- 1. Multi-tenant Structure
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    handle TEXT UNIQUE NOT NULL, -- @starfit_chile, @auraflowfit
    type TEXT CHECK (type IN ('pilates', 'gym')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Social Media Calendar
CREATE TABLE IF NOT EXISTS social_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    title TEXT NOT NULL,
    content TEXT, -- The AI Generated Copy
    post_type TEXT CHECK (post_type IN ('reel', 'video', 'post', 'story')),
    status TEXT DEFAULT 'draft', -- draft, scheduled, published
    scheduled_at TIMESTAMP WITH TIME ZONE,
    media_url TEXT, -- Supabase Storage link
    meta_post_id TEXT, -- For real Meta API integration later
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Update Existing Tables for Multi-tenancy (Conceptual)
-- ALTER TABLE socios ADD COLUMN company_id UUID REFERENCES companies(id);
-- ALTER TABLE leads ADD COLUMN company_id UUID REFERENCES companies(id);
-- ALTER TABLE clases ADD COLUMN company_id UUID REFERENCES companies(id);

-- 4. Initial Seed Data
INSERT INTO companies (id, name, handle, type) 
VALUES 
('d5f782c5-8f6e-4a6d-9e22-2f0d28c4f728', 'Aura Flow Fit', '@auraflowfit', 'pilates'),
('e6a882c5-8f6e-4a6d-9e22-2f0d28c4f729', 'Starfit Chile', '@starfit_chile', 'gym')
ON CONFLICT DO NOTHING;
