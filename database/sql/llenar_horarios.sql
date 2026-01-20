-- ============================================
-- SCRIPT PARA LLENAR HORARIOS DE LA CLÍNICA
-- ============================================

-- Limpiar tablas (opcional)
TRUNCATE TABLE business_hours;
TRUNCATE TABLE day_exceptions;

-- ============================================
-- HORARIOS DE ATENCIÓN SEMANAL
-- ============================================

-- Lunes a Viernes: 8:00 AM - 6:00 PM (citas de 30 minutos)
INSERT INTO business_hours (day_of_week, start_time, end_time, duration_minutes, created_at, updated_at) VALUES
(1, '08:00:00', '18:00:00', 30, NOW(), NOW()), -- Lunes
(2, '08:00:00', '18:00:00', 30, NOW(), NOW()), -- Martes
(3, '08:00:00', '18:00:00', 30, NOW(), NOW()), -- Miércoles
(4, '08:00:00', '18:00:00', 30, NOW(), NOW()), -- Jueves
(5, '08:00:00', '18:00:00', 30, NOW(), NOW()); -- Viernes

-- Sábado: 9:00 AM - 1:00 PM (citas de 30 minutos)
INSERT INTO business_hours (day_of_week, start_time, end_time, duration_minutes, created_at, updated_at) VALUES
(6, '09:00:00', '13:00:00', 30, NOW(), NOW()); -- Sábado

-- Domingo: Cerrado
INSERT INTO business_hours (day_of_week, start_time, end_time, duration_minutes, created_at, updated_at) VALUES
(0, '00:00:00', '00:00:00', 0, NOW(), NOW()); -- Domingo


-- ============================================
-- DÍAS EXCEPCIONALES (Festivos y Especiales)
-- ============================================

-- Año Nuevo 2026
INSERT INTO day_exceptions (date, is_closed, start_time, end_time, duration_minutes, created_at, updated_at) VALUES
('2026-01-01', 1, NULL, NULL, 0, NOW(), NOW());

-- Carnaval 2026 (ejemplo - ajustar fechas según tu país)
INSERT INTO day_exceptions (date, is_closed, start_time, end_time, duration_minutes, created_at, updated_at) VALUES
('2026-02-16', 1, NULL, NULL, 0, NOW(), NOW()),
('2026-02-17', 1, NULL, NULL, 0, NOW(), NOW());

-- Viernes Santo 2026 (ejemplo - ajustar fecha)
INSERT INTO day_exceptions (date, is_closed, start_time, end_time, duration_minutes, created_at, updated_at) VALUES
('2026-04-03', 1, NULL, NULL, 0, NOW(), NOW());

-- Día del Trabajo
INSERT INTO day_exceptions (date, is_closed, start_time, end_time, duration_minutes, created_at, updated_at) VALUES
('2026-05-01', 1, NULL, NULL, 0, NOW(), NOW());

-- Día de la Independencia (ajustar según tu país)
INSERT INTO day_exceptions (date, is_closed, start_time, end_time, duration_minutes, created_at, updated_at) VALUES
('2026-08-06', 1, NULL, NULL, 0, NOW(), NOW());

-- Navidad
INSERT INTO day_exceptions (date, is_closed, start_time, end_time, duration_minutes, created_at, updated_at) VALUES
('2026-12-25', 1, NULL, NULL, 0, NOW(), NOW());

-- Año Nuevo 2027
INSERT INTO day_exceptions (date, is_closed, start_time, end_time, duration_minutes, created_at, updated_at) VALUES
('2027-01-01', 1, NULL, NULL, 0, NOW(), NOW());

-- ============================================
-- DÍAS CON HORARIO ESPECIAL (Horario Reducido)
-- ============================================

-- Nochebuena (ejemplo: solo hasta mediodía)
INSERT INTO day_exceptions (date, is_closed, start_time, end_time, duration_minutes, created_at, updated_at) VALUES
('2026-12-24', 0, '08:00:00', '12:00:00', 30, NOW(), NOW());

-- Fin de Año (ejemplo: solo hasta mediodía)
INSERT INTO day_exceptions (date, is_closed, start_time, end_time, duration_minutes, created_at, updated_at) VALUES
('2026-12-31', 0, '08:00:00', '12:00:00', 30, NOW(), NOW());


-- ============================================
-- VERIFICAR DATOS INSERTADOS
-- ============================================

SELECT * FROM business_hours ORDER BY day_of_week;
SELECT * FROM day_exceptions ORDER BY date;

-- ============================================
-- NOTAS:
-- day_of_week: 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado
-- is_closed: 1=Cerrado, 0=Abierto con horario especial
-- duration_minutes: Duración de cada cita en minutos
-- ============================================
