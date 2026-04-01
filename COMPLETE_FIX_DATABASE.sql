-- AURA FLOW FIT - FIX COMPLETO DE BASE DE DATOS
-- Copia y pega todo este código en el SQL Editor de Supabase (https://supabase.com/dashboard/project/epacysjywesekvxasnmg/sql/new)

-- 1. ASEGURAR COLUMNAS EN membership_plans
ALTER TABLE membership_plans 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS duration_days INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS credits_per_month INTEGER DEFAULT 8;

-- 2. ASEGURAR COLUMNAS EN transactions
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS flow_transaction_id VARCHAR(255);

-- 3. POBLAR PLANES (ID UUID sincronizados con el Frontend)
DELETE FROM membership_plans WHERE id IN (
  'd290f1ee-6c54-4b01-90e6-d701748f0851',
  'e3b0c442-98fc-4c14-951b-072458f2d129',
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'
);

INSERT INTO membership_plans (id, tenant_id, name, description, price, duration_days, credits_per_month)
VALUES 
(
  'd290f1ee-6c54-4b01-90e6-d701748f0851', 
  'd573065a-0902-4d02-8017-cf7212d333b4', 
  'Pilates Mensual 2x', 
  '8 clases al mes, Acceso a App exclusiva', 
  65000, 
  30, 
  8
),
(
  'e3b0c442-98fc-4c14-951b-072458f2d129', 
  'd573065a-0902-4d02-8017-cf7212d333b4', 
  'Pilates Mensual 3x', 
  '12 clases al mes, Acceso a App exclusiva', 
  85000, 
  30, 
  12
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479', 
  'd573065a-0902-4d02-8017-cf7212d333b4', 
  'Gimnasio Libre', 
  'Acceso ilimitado, Rutina inicial', 
  35000, 
  30, 
  999
);

-- 4. VERIFICACIÓN FINAL
SELECT * FROM membership_plans;
