
-- Crear tabla para solicitudes de préstamo de sala
CREATE TABLE public.solicitudes_prestamo_sala (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_solicitud TEXT NOT NULL UNIQUE,
    
    -- Datos del evento
    fecha_evento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    tipo_evento TEXT NOT NULL,
    numero_participantes INTEGER NOT NULL CHECK (numero_participantes > 0 AND numero_participantes <= 50),
    descripcion TEXT NOT NULL,
    requiere_equipos BOOLEAN DEFAULT FALSE,
    equipos_solicitados TEXT,
    
    -- Datos del solicitante
    nombre_completo TEXT NOT NULL,
    cedula TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT NOT NULL,
    
    -- Control administrativo
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada', 'cancelada')),
    fecha_respuesta TIMESTAMP WITH TIME ZONE,
    comentarios_admin TEXT,
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para gestión de horarios bloqueados/ocupados
CREATE TABLE public.horarios_bloqueados (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    motivo TEXT NOT NULL,
    descripcion TEXT,
    es_permanente BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear índices para optimizar consultas
CREATE INDEX idx_solicitudes_fecha_evento ON public.solicitudes_prestamo_sala(fecha_evento);
CREATE INDEX idx_solicitudes_estado ON public.solicitudes_prestamo_sala(estado);
CREATE INDEX idx_solicitudes_email ON public.solicitudes_prestamo_sala(email);
CREATE INDEX idx_horarios_fecha ON public.horarios_bloqueados(fecha);

-- Crear función para generar número de solicitud único
CREATE OR REPLACE FUNCTION generate_solicitud_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        new_number := 'PS-' || LPAD((EXTRACT(epoch FROM now())::BIGINT % 1000000)::TEXT, 6, '0');
        
        SELECT EXISTS(
            SELECT 1 FROM public.solicitudes_prestamo_sala 
            WHERE numero_solicitud = new_number
        ) INTO exists_check;
        
        EXIT WHEN NOT exists_check;
    END LOOP;
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para auto-generar número de solicitud
CREATE OR REPLACE FUNCTION set_solicitud_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.numero_solicitud := generate_solicitud_number();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_solicitud_number
    BEFORE INSERT ON public.solicitudes_prestamo_sala
    FOR EACH ROW
    EXECUTE FUNCTION set_solicitud_number();

-- Crear trigger para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_solicitudes_updated_at
    BEFORE UPDATE ON public.solicitudes_prestamo_sala
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.solicitudes_prestamo_sala ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios_bloqueados ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS para acceso público (sin autenticación)
CREATE POLICY "Permitir insertar solicitudes públicamente" 
    ON public.solicitudes_prestamo_sala 
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Permitir consultar horarios bloqueados" 
    ON public.horarios_bloqueados 
    FOR SELECT 
    USING (true);

-- Crear política para consultar disponibilidad de fechas
CREATE POLICY "Permitir consultar solicitudes para disponibilidad" 
    ON public.solicitudes_prestamo_sala 
    FOR SELECT 
    USING (estado = 'aprobada');

-- Insertar algunos horarios bloqueados de ejemplo
INSERT INTO public.horarios_bloqueados (fecha, hora_inicio, hora_fin, motivo, descripcion) VALUES
('2024-12-25', '00:00', '23:59', 'Feriado Nacional', 'Navidad - Biblioteca cerrada'),
('2025-01-01', '00:00', '23:59', 'Feriado Nacional', 'Año Nuevo - Biblioteca cerrada'),
('2024-12-15', '12:00', '14:00', 'Evento Especial', 'Conferencia de Fin de Año'),
('2024-12-22', '10:00', '12:00', 'Mantenimiento', 'Mantenimiento programado de equipos');
