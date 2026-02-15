-- Aura Flow Fit - Database Schema Setup

-- 1. SOCIOC (MEMBERS)
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
    
    -- Body Metrics (NEW)
    peso DECIMAL(5,2),
    estatura INTEGER,
    porcentaje_grasa DECIMAL(4,2),
    porcentaje_musculo DECIMAL(4,2)
);

-- 2. CLASES (CLASSES)
CREATE TABLE IF NOT EXISTS public.clases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nombre TEXT NOT NULL,
    instructor TEXT NOT NULL,
    horario TIME NOT NULL,
    dia TEXT NOT NULL, -- 'Lunes', 'Martes', etc.
    cupos_max INTEGER DEFAULT 12,
    cupos_ocupados INTEGER DEFAULT 0,
    tipo TEXT DEFAULT 'pilates' -- 'pilates' or 'entrenamiento'
);

-- 3. RESERVAS (BOOKINGS)
CREATE TABLE IF NOT EXISTS public.reservas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    socio_id UUID REFERENCES public.socios(id) ON DELETE CASCADE,
    clase_id UUID REFERENCES public.clases(id) ON DELETE CASCADE,
    fecha TEXT NOT NULL, -- 'YYYY-MM-DD'
    estado TEXT DEFAULT 'Confirmada' -- 'Confirmada', 'Cancelada', 'Asistida'
);

-- 4. LISTA DE ESPERA (WAITLIST)
CREATE TABLE IF NOT EXISTS public.lista_espera (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    socio_id UUID REFERENCES public.socios(id) ON DELETE CASCADE,
    clase_id UUID REFERENCES public.clases(id) ON DELETE CASCADE,
    fecha TEXT NOT NULL
);

-- Initial Dummy Data for Testing
INSERT INTO public.socios (nombre, email, plan, clases_restantes, estado, peso, estatura, porcentaje_grasa, porcentaje_musculo)
VALUES 
('Maria Garcia', 'maria@example.com', 'Plan Premium', 8, 'Activo', 62.5, 165, 22.4, 38.2),
('Carlos Perez', 'carlos@example.com', 'Plan Basico', 4, 'Activo', 78.0, 180, 18.5, 42.0);

INSERT INTO public.clases (nombre, instructor, horario, dia, tipo, cupos_max)
VALUES 
('Pilates Reformer', 'Maria G.', '09:00', 'Lunes', 'pilates', 10),
('Pilates Reformer', 'Maria G.', '10:30', 'Lunes', 'pilates', 10),
('Entrenamiento Gym', 'Juan K.', '18:00', 'Martes', 'entrenamiento', 50);
