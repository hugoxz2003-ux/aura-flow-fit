-- Aura Flow Fit - Database Schema Setup (Final Harmonized Version)

-- 1. SOCIOS (MEMBERS)
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
    
    -- Body Metrics
    peso DECIMAL(5,2),
    estatura INTEGER,
    porcentaje_grasa DECIMAL(4,2),
    porcentaje_musculo DECIMAL(4,2)
);

-- 2. CLASES (CLASSES)
CREATE TABLE IF NOT EXISTS public.clases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    instructor TEXT NOT NULL,
    schedule TIME NOT NULL,
    day TEXT NOT NULL, -- 'Lunes', 'Martes', etc.
    max_capacity INTEGER DEFAULT 12,
    occupied_slots INTEGER DEFAULT 0,
    class_type TEXT DEFAULT 'pilates' -- 'pilates', 'gym', etc.
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

-- 5. LEADS (PIPELINE)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    source TEXT DEFAULT 'Instagram',
    status TEXT DEFAULT 'Nuevo' -- 'Nuevo', 'Contactado', 'Interesado', 'Convertido'
);

-- 6. PAGOS / TRANSACCIONES
CREATE TABLE IF NOT EXISTS public.pagos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    socio_id UUID REFERENCES public.socios(id) ON DELETE SET NULL,
    socio_nombre TEXT,
    amount DECIMAL(12,2) NOT NULL,
    payment_method TEXT DEFAULT 'Transferencia',
    description TEXT,
    status TEXT DEFAULT 'success' -- 'success', 'pending', 'failed'
);

-- 7. PLANES DE MEMBRESÍA
CREATE TABLE IF NOT EXISTS public.membership_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    credits_per_month INTEGER DEFAULT 8,
    duration_days INTEGER DEFAULT 30,
    category TEXT DEFAULT 'pilates',
    description TEXT
);

-- 8. ASISTENCIAS (REGISTRO REAL)
CREATE TABLE IF NOT EXISTS public.asistencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha DATE DEFAULT CURRENT_DATE NOT NULL,
    hora TIME DEFAULT CURRENT_TIME NOT NULL,
    socio_id UUID REFERENCES public.socios(id) ON DELETE CASCADE,
    clase_id UUID REFERENCES public.clases(id) ON DELETE SET NULL,
    clase_nombre TEXT,
    instructor_nombre TEXT
);

-- 9. MENSAJES DE COMUNICACIÓN
CREATE TABLE IF NOT EXISTS public.mensajes_comunicacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    asunto TEXT,
    cuerpo TEXT NOT NULL,
    canal TEXT DEFAULT 'Email',
    destinatario TEXT DEFAULT 'todos'
);

-- 10. CONFIGURACIÓN DEL GIMNASIO
CREATE TABLE IF NOT EXISTS public.configuracion_gym (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT DEFAULT 'Aura Flow Fit',
    direccion TEXT,
    telefono TEXT,
    email TEXT,
    web TEXT,
    horarios JSONB,
    notificaciones JSONB
);

-- Initial Dummy Data for Testing
INSERT INTO public.membership_plans (name, price, credits_per_month, duration_days, category)
VALUES 
('Pilates Plus 2x', 65000, 8, 30, 'pilates'),
('Pilates Premium 3x', 85000, 12, 30, 'pilates'),
('Plan Gimnasio Libre', 35000, 999, 30, 'gym');

INSERT INTO public.leads (nombre, email, source, status)
VALUES 
('Juan Prospecto', 'juan@prospecto.com', 'Instagram', 'Nuevo'),
('Clara Interesada', 'clara@prospecto.com', 'Web', 'Contactado');

INSERT INTO public.socios (nombre, email, plan, clases_restantes, estado, peso, estatura, porcentaje_grasa, porcentaje_musculo)
VALUES 
('Maria Garcia', 'maria@example.com', 'Pilates Plus 2x', 8, 'Activo', 62.5, 165, 22.4, 38.2),
('Carlos Perez', 'carlos@example.com', 'Plan Gimnasio Libre', 999, 'Activo', 78.0, 180, 18.5, 42.0);

INSERT INTO public.clases (name, instructor, schedule, day, class_type, max_capacity)
VALUES 
('Pilates Reformer', 'Maria G.', '09:00', 'Lunes', 'pilates', 10),
('Pilates Reformer', 'Maria G.', '10:30', 'Lunes', 'pilates', 10),
('Entrenamiento Gym', 'Juan K.', '18:00', 'Martes', 'gym', 50);
