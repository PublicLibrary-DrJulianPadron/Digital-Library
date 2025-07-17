-- Create users table for user management
CREATE TABLE public.usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  cedula TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  telefono TEXT,
  activo BOOLEAN NOT NULL DEFAULT true,
  prestamos_activos INTEGER NOT NULL DEFAULT 0,
  fecha_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ultima_actividad TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Create policies for user management (public read for now)
CREATE POLICY "Permitir consultar usuarios" 
ON public.usuarios 
FOR SELECT 
USING (true);

CREATE POLICY "Permitir insertar usuarios" 
ON public.usuarios 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir actualizar usuarios" 
ON public.usuarios 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_usuarios_updated_at
BEFORE UPDATE ON public.usuarios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.usuarios (nombre_completo, cedula, email, telefono, prestamos_activos) VALUES
('María García López', '12345678', 'maria.garcia@email.com', '555-0101', 2),
('Juan Carlos Rodríguez', '87654321', 'juan.rodriguez@email.com', '555-0102', 0),
('Ana Sofía Martínez', '11223344', 'ana.martinez@email.com', '555-0103', 1),
('Pedro Luis Fernández', '44332211', 'pedro.fernandez@email.com', '555-0104', 3),
('Carmen Elena Ruiz', '55667788', 'carmen.ruiz@email.com', '555-0105', 0),
('Roberto Miguel Torres', '88776655', 'roberto.torres@email.com', '555-0106', 1),
('Lucía Isabel Morales', '99887766', 'lucia.morales@email.com', '555-0107', 2),
('Diego Alejandro Vargas', '66778899', 'diego.vargas@email.com', '555-0108', 0),
('Patricia Beatriz Herrera', '33445566', 'patricia.herrera@email.com', '555-0109', 1),
('Andrés Felipe Castillo', '22334455', 'andres.castillo@email.com', '555-0110', 4);