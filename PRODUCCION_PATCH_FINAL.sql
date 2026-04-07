-- ========================================================
-- AURA FLOW FIT - PARCHE DE ESTABILIZACIÓN FINAL (V2)
-- ========================================================
-- Ejecutar este script para añadir las tablas faltantes detectadas en la auditoría.

-- 1. TABLA DE LEADS (Módulo de Marketing/CRM)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    interes TEXT DEFAULT 'Pilates',
    estado TEXT DEFAULT 'Nuevo',
    notas TEXT
);

-- 2. TABLA DE ASISTENCIAS (Módulo de Control de Acceso)
CREATE TABLE IF NOT EXISTS public.asistencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    socio_id UUID REFERENCES public.socios(id) ON DELETE CASCADE,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    tipo_ingreso TEXT DEFAULT 'Manual' -- Manual, QR, Facial
);

-- 3. TABLA DE CONFIGURACIÓN DEL GIMNASIO
CREATE TABLE IF NOT EXISTS public.configuracion_gym (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nombre_comercial TEXT DEFAULT 'Aura Flow Fit',
    direccion TEXT,
    webhook_url TEXT, -- Para integraciones futuras
    metodos_pago_activos JSONB DEFAULT '["Tuu", "Transferencia"]'::jsonb
);

-- 4. INSERTAR CONFIGURACIÓN INICIAL SI NO EXISTE
INSERT INTO public.configuracion_gym (nombre_comercial)
SELECT 'Aura Flow Fit'
WHERE NOT EXISTS (SELECT 1 FROM public.configuracion_gym);

-- 5. ASEGURAR COLUMNAS EN SOCIOS (Compatibilidad v2.0)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='peso') THEN
        ALTER TABLE public.socios ADD COLUMN peso DECIMAL(5,2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='estatura') THEN
        ALTER TABLE public.socios ADD COLUMN estatura INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='porcentaje_grasa') THEN
        ALTER TABLE public.socios ADD COLUMN porcentaje_grasa DECIMAL(4,2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='porcentaje_musculo') THEN
        ALTER TABLE public.socios ADD COLUMN porcentaje_musculo DECIMAL(4,2);
    END IF;
END $$;
