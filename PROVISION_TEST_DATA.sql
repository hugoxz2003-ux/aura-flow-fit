-- Add 5 Fictional Members
INSERT INTO public.socios (nombre, email, plan, clases_restantes, estado, peso, estatura, porcentaje_grasa, porcentaje_musculo)
VALUES 
('Ana Lopez', 'ana@example.com', 'Plan Premium', 8, 'Activo', 58.0, 160, 21.0, 35.0),
('Pedro Silva', 'pedro@example.com', 'Plan Basico', 4, 'Activo', 82.5, 178, 19.5, 41.2),
('Laura Torres', 'laura@example.com', 'Plan Premium', 12, 'Activo', 55.0, 163, 20.0, 36.5),
('Sofia Castro', 'sofia@example.com', 'Plan Entrenamiento Gym', 99, 'Activo', 60.2, 167, 23.5, 34.0),
('Diego Morales', 'diego@example.com', 'Plan Premium', 8, 'Activo', 75.0, 175, 17.0, 44.0);

-- Add More Classes to have 5+ different ones
INSERT INTO public.clases (nombre, instructor, horario, dia, tipo, cupos_max)
VALUES 
('Yoga Flow', 'Elena R.', '08:00', 'Miercoles', 'pilates', 15),
('HIIT Intenso', 'Marcos T.', '19:00', 'Jueves', 'entrenamiento', 20),
('Pilates Reformer', 'Maria G.', '17:00', 'Viernes', 'pilates', 10),
('Aura Pilates', 'Lucia B.', '11:00', 'Sabado', 'pilates', 10),
('Funcional Pro', 'Carlos R.', '07:00', 'Lunes', 'entrenamiento', 25);
