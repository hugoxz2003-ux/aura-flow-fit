-- ============================================================
-- AURA FLOW FIT - SEED DEMO DATA
-- Ejecutar en Supabase SQL Editor para poblar datos de prueba
-- Versión: 1.0 | Fecha: 2026-04-01
-- ============================================================

-- 1. LIMPIAR DATOS ANTERIORES (opcional - comentar si quieres mantener)
-- DELETE FROM reservas;
-- DELETE FROM notificaciones;
-- DELETE FROM leads;
-- DELETE FROM socios WHERE email IN ('ana@example.com','carlos.demo@auraflow.cl');
-- DELETE FROM clases;

-- ============================================================
-- 2. CREAR TABLA NOTIFICACIONES (si no existe)
-- ============================================================
CREATE TABLE IF NOT EXISTS notificaciones (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    titulo TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    socio_id UUID REFERENCES socios(id) ON DELETE CASCADE,
    tipo TEXT DEFAULT 'global',
    leida BOOLEAN DEFAULT FALSE,
    canal TEXT DEFAULT 'app'
);

-- ============================================================
-- 3. CREAR TABLA LEADS (si no existe)
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    nombre TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    source TEXT DEFAULT 'Web',
    status TEXT DEFAULT 'Nuevo',
    notas TEXT,
    assigned_to TEXT
);

-- ============================================================
-- 4. ASEGURAR COLUMNAS MÉTRICAS EN SOCIOS
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='peso') THEN
        ALTER TABLE socios ADD COLUMN peso NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='estatura') THEN
        ALTER TABLE socios ADD COLUMN estatura INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='porcentaje_grasa') THEN
        ALTER TABLE socios ADD COLUMN porcentaje_grasa NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='porcentaje_musculo') THEN
        ALTER TABLE socios ADD COLUMN porcentaje_musculo NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='clases_restantes') THEN
        ALTER TABLE socios ADD COLUMN clases_restantes INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='fecha_vencimiento') THEN
        ALTER TABLE socios ADD COLUMN fecha_vencimiento DATE;
    END IF;
END $$;

-- ============================================================
-- 5. SOCIOS DE PRUEBA
-- ============================================================
INSERT INTO socios (nombre, email, plan, estado, clases_restantes, fecha_vencimiento, peso, estatura, porcentaje_grasa, porcentaje_musculo)
VALUES
    ('Ana García Demo', 'ana@example.com', 'Pilates 2x Semanal', 'Activo', 8, (NOW() + INTERVAL '30 days')::DATE, 62.5, 165, 22.4, 38.2),
    ('Carlos Méndez', 'carlos.demo@auraflow.cl', 'Plan Gimnasio', 'Activo', 999, (NOW() + INTERVAL '25 days')::DATE, 78.0, 178, 18.0, 42.5),
    ('Laura Torres', 'laura.demo@auraflow.cl', 'Pilates 3x Semanal', 'Activo', 12, (NOW() + INTERVAL '15 days')::DATE, 58.0, 162, 24.0, 36.5),
    ('Sofía Ramos', 'sofia.demo@auraflow.cl', 'Pilates 4x Semanal', 'Vencido', 0, (NOW() - INTERVAL '5 days')::DATE, 65.0, 168, 21.0, 39.0),
    ('Diego Fuentes', 'diego.demo@auraflow.cl', 'Pilates 1x Semanal', 'Activo', 3, (NOW() + INTERVAL '10 days')::DATE, 72.0, 175, 20.0, 41.0)
ON CONFLICT (email) DO UPDATE SET
    plan = EXCLUDED.plan,
    estado = EXCLUDED.estado,
    clases_restantes = EXCLUDED.clases_restantes,
    fecha_vencimiento = EXCLUDED.fecha_vencimiento;

-- ============================================================
-- 6. CLASES DE PRUEBA (para HOYA y la semana)
-- ============================================================
INSERT INTO clases (nombre, instructor, horario, tipo, cupos_ocupados, cupos_max, dia)
VALUES
    -- Clases de HOY (todos los días para demo)
    ('Pilates Reformer', 'María González', '09:00:00', 'pilates', 6, 10, 'Lunes'),
    ('Pilates Reformer', 'María González', '11:00:00', 'pilates', 4, 10, 'Lunes'),
    ('Pilates Reformer', 'María González', '18:00:00', 'pilates', 8, 10, 'Lunes'),
    ('Pilates Full Body', 'Valeria Paz', '10:00:00', 'pilates', 5, 10, 'Lunes'),
    ('Entrenamiento Funcional', 'Carlos Ruiz', '08:00:00', 'gym', 12, 50, 'Lunes'),

    ('Pilates Reformer', 'María González', '09:00:00', 'pilates', 7, 10, 'Martes'),
    ('Pilates Reformer', 'María González', '11:00:00', 'pilates', 3, 10, 'Martes'),
    ('Pilates Core', 'Valeria Paz', '17:00:00', 'pilates', 6, 10, 'Martes'),
    ('Entrenamiento Funcional', 'Carlos Ruiz', '07:30:00', 'gym', 8, 50, 'Martes'),

    ('Pilates Reformer', 'María González', '09:00:00', 'pilates', 5, 10, 'Miercoles'),
    ('Pilates Reformer', 'María González', '11:00:00', 'pilates', 9, 10, 'Miercoles'),
    ('Pilates Avanzado', 'María González', '19:00:00', 'pilates', 4, 8, 'Miercoles'),
    ('Entrenamiento Funcional', 'Carlos Ruiz', '08:00:00', 'gym', 15, 50, 'Miercoles'),

    ('Pilates Reformer', 'Valeria Paz', '09:00:00', 'pilates', 6, 10, 'Jueves'),
    ('Pilates Reformer', 'Valeria Paz', '18:00:00', 'pilates', 7, 10, 'Jueves'),
    ('Entrenamiento Funcional', 'Carlos Ruiz', '07:30:00', 'gym', 10, 50, 'Jueves'),

    ('Pilates Reformer', 'María González', '09:00:00', 'pilates', 10, 10, 'Viernes'),
    ('Pilates Reformer', 'María González', '11:00:00', 'pilates', 6, 10, 'Viernes'),
    ('Pilates Express', 'Valeria Paz', '18:00:00', 'pilates', 3, 10, 'Viernes'),
    ('Entrenamiento Funcional', 'Carlos Ruiz', '08:00:00', 'gym', 20, 50, 'Viernes'),

    ('Pilates Fin de Semana', 'María González', '10:00:00', 'pilates', 8, 12, 'Sabado'),
    ('Pilates Fin de Semana', 'Valeria Paz', '12:00:00', 'pilates', 5, 12, 'Sabado')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 7. RESERVAS DE PRUEBA (vinculando Ana García a clases de hoy)
-- ============================================================
-- Obtener IDs y crear reservas
DO $$
DECLARE
    v_ana_id UUID;
    v_clase_id BIGINT;
    v_today TEXT;
BEGIN
    -- Obtener ID de Ana García
    SELECT id INTO v_ana_id FROM socios WHERE email = 'ana@example.com' LIMIT 1;
    v_today := TO_CHAR(NOW(), 'YYYY-MM-DD');

    IF v_ana_id IS NOT NULL THEN
        -- Obtener clase de pilates de las 9am del día actual
        SELECT id INTO v_clase_id FROM clases
        WHERE horario = '09:00:00' AND tipo = 'pilates'
        LIMIT 1;

        IF v_clase_id IS NOT NULL THEN
            INSERT INTO reservas (socio_id, clase_id, fecha, estado)
            VALUES (v_ana_id, v_clase_id, v_today::DATE, 'Confirmada')
            ON CONFLICT DO NOTHING;
        END IF;

        -- Reserva para mañana también
        SELECT id INTO v_clase_id FROM clases
        WHERE horario = '11:00:00' AND tipo = 'pilates'
        LIMIT 1;

        IF v_clase_id IS NOT NULL THEN
            INSERT INTO reservas (socio_id, clase_id, fecha, estado)
            VALUES (v_ana_id, v_clase_id, (NOW() + INTERVAL '2 days')::DATE, 'Confirmada')
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
END $$;

-- ============================================================
-- 8. LEADS DE PRUEBA (pipeline de ventas)
-- ============================================================
INSERT INTO leads (nombre, email, phone, source, status, notas)
VALUES
    ('Juan Pérez González', 'juan@gmail.com', '+56912345678', 'Instagram', 'Nuevo', 'Interesado en Pilates Reformer. DM por Instagram el 1 abril.'),
    ('Catalina Morales', 'cata.morales@gmail.com', '+56987654321', 'Web', 'Contactado', 'Completó formulario web. Llamar esta semana.'),
    ('Roberto Soto', 'rsoto@empresa.cl', '+56955566677', 'Recomendación', 'Interesado', 'Lo recomendó Ana García. Quiere plan corporativo.'),
    ('Fernanda Lagos', 'fernanda.l@gmail.com', '+56933344455', 'Instagram', 'Nuevo', 'Comentó en post de stories. Quiere clase de prueba gratis.'),
    ('Pedro Vargas', 'pedro.v@outlook.com', '+56911122233', 'Web', 'Convertido', 'Se convirtió en socio. Plan Pilates 2x Semanal.'),
    ('Valentina Cruz', 'valen.cruz@gmail.com', '+56944455566', 'Referido', 'Nuevo', 'Referida por Laura Torres. Pendiente de contacto.')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 9. NOTIFICACION DE BIENVENIDA
-- ============================================================
INSERT INTO notificaciones (titulo, mensaje, tipo, canal)
VALUES (
    '¡Bienvenida a Aura Flow Fit!',
    'Hola Ana, tu cuenta está activa. Tienes 8 clases disponibles este mes. Reserva tu primera clase desde el calendario. ¡Te esperamos!',
    'global',
    'app'
),
(
    'Recordatorio: Membresía por vencer',
    'Tu plan Pilates 2x Semanal vence en 30 días. Renueva ahora y mantén tu progreso sin interrupciones.',
    'global',
    'app'
);

-- ============================================================
-- 10. PLANES DE MEMBRESÍA
-- ============================================================
INSERT INTO membership_plans (name, price, credits_per_month, duration_days, category)
VALUES
    ('Pilates 1x Semanal', 45000, 4, 30, 'pilates'),
    ('Pilates 2x Semanal', 65000, 8, 30, 'pilates'),
    ('Pilates 3x Semanal', 85000, 12, 30, 'pilates'),
    ('Pilates 4x Semanal', 105000, 16, 30, 'pilates'),
    ('Plan Gimnasio Libre', 35000, 999, 30, 'gym'),
    ('Pack Corporativo 10 Clases', 150000, 10, 60, 'corporativo')
ON CONFLICT DO NOTHING;

-- ============================================================
-- FIN DEL SCRIPT
-- Verificar con: SELECT * FROM socios; SELECT * FROM clases; SELECT * FROM leads;
-- ============================================================
