-- Evolución a CRM Multi-Empresa - Esquema Social Media

-- 1. Tabla de Empresas (Tenants)
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    handle TEXT UNIQUE NOT NULL, -- @starfit_chile, @auraflowfit
    industry TEXT, -- 'Fitness Equipment', 'Pilates Reformer'
    brand_style JSONB DEFAULT '{"primary_color": "#06B6D4", "font": "Inter", "vibe": "Elite"}'::jsonb,
    logo_url TEXT,
    owner_email TEXT
);

-- 2. Actualizar tablas existentes para incluir company_id
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='company_id') THEN
        ALTER TABLE public.socios ADD COLUMN company_id UUID REFERENCES public.companies(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clases' AND column_name='company_id') THEN
        ALTER TABLE public.clases ADD COLUMN company_id UUID REFERENCES public.companies(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='company_id') THEN
        ALTER TABLE public.leads ADD COLUMN company_id UUID REFERENCES public.companies(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pagos' AND column_name='company_id') THEN
        ALTER TABLE public.pagos ADD COLUMN company_id UUID REFERENCES public.companies(id);
    END IF;
END $$;

-- 3. Tabla de Calendarios de Redes Sociales
CREATE TABLE IF NOT EXISTS public.social_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL, -- 'Reel', 'Post', 'Video', 'Stories'
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    media_url TEXT, -- Link a Supabase Storage
    caption TEXT,
    trend_type TEXT, -- 'Hybrid Training', 'Quiet Luxury', etc.
    status TEXT DEFAULT 'Draft', -- 'Draft', 'Planned', 'Published'
    designer_notes TEXT
);

-- 4. Insertar Empresas Iniciales
INSERT INTO public.companies (name, handle, industry, brand_style)
VALUES 
('Starfit Chile', '@starfit_chile', 'Fitness Equipment', '{"primary_color": "#EF4444", "vibe": "Energetic", "font": "Plus Jakarta Sans"}'),
('Aura Flow Fit', '@auraflowfit', 'Pilates Reformer', '{"primary_color": "#06B6D4", "vibe": "Quiet Luxury", "font": "Outfit"}')
ON CONFLICT (handle) DO UPDATE SET industry = EXCLUDED.industry;

-- 5. Asignar registros huérfanos a Aura Flow (Empresa default por ahora)
UPDATE public.socios SET company_id = (SELECT id FROM public.companies WHERE handle = '@auraflowfit') WHERE company_id IS NULL;
UPDATE public.clases SET company_id = (SELECT id FROM public.companies WHERE handle = '@auraflowfit') WHERE company_id IS NULL;
UPDATE public.leads SET company_id = (SELECT id FROM public.companies WHERE handle = '@auraflowfit') WHERE company_id IS NULL;
