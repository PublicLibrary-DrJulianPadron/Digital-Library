-- Allow logged users to view all profiles (but only update their own)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Logged users can view all profiles" ON public.profiles
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow logged users to view all user records (but only update their own)  
DROP POLICY IF EXISTS "Users can view their own user record" ON public.users;
CREATE POLICY "Logged users can view all users" ON public.users
FOR SELECT USING (auth.role() = 'authenticated');

-- Update horarios_bloqueados table to match blocked_schedules types
ALTER TABLE public.horarios_bloqueados 
RENAME COLUMN fecha TO date;

ALTER TABLE public.horarios_bloqueados 
RENAME COLUMN hora_inicio TO start_time;

ALTER TABLE public.horarios_bloqueados 
RENAME COLUMN hora_fin TO end_time;

ALTER TABLE public.horarios_bloqueados 
RENAME COLUMN es_permanente TO is_permanent;

ALTER TABLE public.horarios_bloqueados 
RENAME COLUMN motivo TO reason;

ALTER TABLE public.horarios_bloqueados 
RENAME COLUMN descripcion TO description;

-- Update solicitudes_prestamo_sala table to match room_bookings types
ALTER TABLE public.solicitudes_prestamo_sala 
RENAME COLUMN numero_solicitud TO request_number;

ALTER TABLE public.solicitudes_prestamo_sala 
RENAME COLUMN tipo_evento TO event_type;

ALTER TABLE public.solicitudes_prestamo_sala 
RENAME COLUMN descripcion TO description;

ALTER TABLE public.solicitudes_prestamo_sala 
RENAME COLUMN fecha_evento TO event_date;

ALTER TABLE public.solicitudes_prestamo_sala 
RENAME COLUMN hora_inicio TO start_time;

ALTER TABLE public.solicitudes_prestamo_sala 
RENAME COLUMN hora_fin TO end_time;

ALTER TABLE public.solicitudes_prestamo_sala 
RENAME COLUMN numero_participantes TO participant_count;

ALTER TABLE public.solicitudes_prestamo_sala 
RENAME COLUMN requiere_equipos TO requires_equipment;

ALTER TABLE public.solicitudes_prestamo_sala 
RENAME COLUMN equipos_solicitados TO requested_equipment;

ALTER TABLE public.solicitudes_prestamo_sala 
RENAME COLUMN nombre_completo TO full_name;

ALTER TABLE public.solicitudes_prestamo_sala 
RENAME COLUMN cedula TO national_document;

ALTER TABLE public.solicitudes_prestamo_sala 
RENAME COLUMN telefono TO phone;

ALTER TABLE public.solicitudes_prestamo_sala 
RENAME COLUMN estado TO status;

ALTER TABLE public.solicitudes_prestamo_sala 
RENAME COLUMN fecha_respuesta TO response_date;

ALTER TABLE public.solicitudes_prestamo_sala 
RENAME COLUMN comentarios_admin TO admin_comments;