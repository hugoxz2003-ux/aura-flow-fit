-- ========================================================
-- AURA FLOW FIT - CONFIGURACIÓN COMPLETA PARA PRODUCCIÓN
-- ========================================================
-- Instrucciones: Copia y pega todo este código en el SQL Editor de Supabase.

-- 1. CREACIÓN DE TABLAS NÚCLEO
CREATE TABLE IF NOT EXISTS public.socios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'Plan Premium',
    estado TEXT DEFAULT 'Activo',
    clases_restantes INTEGER DEFAULT 8,
    fecha_vencimiento DATE DEFAULT (now() + interval '1 month'),
    ultimo_pago TIMESTAMP WITH TIME ZONE,
    peso DECIMAL(5,2),
    estatura INTEGER,
    porcentaje_grasa DECIMAL(4,2),
    porcentaje_musculo DECIMAL(4,2)
);

CREATE TABLE IF NOT EXISTS public.clases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nombre TEXT NOT NULL,
    instructor TEXT NOT NULL,
    horario TIME NOT NULL,
    dia TEXT NOT NULL, 
    cupos_max INTEGER DEFAULT 12,
    cupos_ocupados INTEGER DEFAULT 0,
    tipo TEXT DEFAULT 'pilates'
);

CREATE TABLE IF NOT EXISTS public.reservas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    socio_id UUID REFERENCES public.socios(id) ON DELETE CASCADE,
    clase_id UUID REFERENCES public.clases(id) ON DELETE CASCADE,
    fecha TEXT NOT NULL, 
    estado TEXT DEFAULT 'Confirmada'
);

CREATE TABLE IF NOT EXISTS public.lista_espera (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    socio_id UUID REFERENCES public.socios(id) ON DELETE CASCADE,
    clase_id UUID REFERENCES public.clases(id) ON DELETE CASCADE,
    fecha TEXT NOT NULL
);

-- 2. TABLAS DE PAGOS Y PLANES (Asegurar existencia)
CREATE TABLE IF NOT EXISTS public.membership_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    duration_days INTEGER DEFAULT 30,
    credits_per_month INTEGER DEFAULT 8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    socio_id UUID REFERENCES public.socios(id),
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    description TEXT,
    flow_transaction_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. POBLAR PLANES Y DATOS MAESTROS
INSERT INTO public.membership_plans (id, name, description, price, duration_days, credits_per_month)
VALUES 
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Pilates Mensual 2x', '8 clases al mes, Acceso a App exclusiva', 65000, 30, 8),
('e3b0c442-98fc-4c14-951b-072458f2d129', 'Pilates Mensual 3x', '12 clases al mes, Acceso a App exclusiva', 85000, 30, 12),
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Gimnasio Libre', 'Acceso ilimitado, Rutina inicial', 35000, 30, 999)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, description = EXCLUDED.description;

-- 4. POBLAR SOCIOS Y CLASES DE PRUEBA (Para verificación final)
INSERT INTO public.socios (nombre, email, plan, clases_restantes, estado)
VALUES 
('Ana Lopez', 'ana@example.com', 'Plan Premium', 8, 'Activo'),
('Pedro Silva', 'pedro@example.com', 'Plan Basico', 4, 'Activo'),
('Laura Torres', 'laura@example.com', 'Plan Premium', 12, 'Activo')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.clases (nombre, instructor, horario, dia, tipo, cupos_max)
VALUES 
('Yoga Flow', 'Elena R.', '08:00', 'Miercoles', 'pilates', 15),
('HIIT Intenso', 'Marcos T.', '19:00', 'Jueves', 'entrenamiento', 20),
('Pilates Reformer', 'Maria G.', '17:00', 'Viernes', 'pilates', 10)
ON CONFLICT DO NOTHING;
