-- SCRIPTS ADICIONALES PARA SINCRONIZACIÓN CRM & APP

-- 1. Crear tabla de Notificaciones para Avisos Generales y Personalizados
CREATE TABLE IF NOT EXISTS notificaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    titulo TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    socio_id UUID REFERENCES socios(id) ON DELETE CASCADE, -- NULL si es para todos
    tipo TEXT DEFAULT 'global', -- 'global', 'personal', 'alerta'
    leida BOOLEAN DEFAULT FALSE,
    canal TEXT -- 'app', 'email', 'whatsapp'
);

-- 2. Asegurar campos de métricas en tabla socios (por si no existen)
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
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios'AND column_name='porcentaje_musculo') THEN
        ALTER TABLE socios ADD COLUMN porcentaje_musculo NUMERIC;
    END IF;
END $$;
