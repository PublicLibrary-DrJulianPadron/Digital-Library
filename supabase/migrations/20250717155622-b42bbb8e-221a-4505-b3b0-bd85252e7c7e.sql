-- Create table for books and materials
CREATE TABLE public.libros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  autor TEXT NOT NULL,
  isbn TEXT,
  ano_publicacion INTEGER,
  cantidad_existencia INTEGER NOT NULL DEFAULT 0,
  tipo_material TEXT NOT NULL DEFAULT 'libro',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.libros ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to books
CREATE POLICY "Permitir consultar libros" 
ON public.libros 
FOR SELECT 
USING (true);

CREATE POLICY "Permitir insertar libros" 
ON public.libros 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir actualizar libros" 
ON public.libros 
FOR UPDATE 
USING (true);

CREATE POLICY "Permitir eliminar libros" 
ON public.libros 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_libros_updated_at
BEFORE UPDATE ON public.libros
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.libros (nombre, autor, isbn, ano_publicacion, cantidad_existencia, tipo_material) VALUES
('Cien años de soledad', 'Gabriel García Márquez', '978-84-376-0494-7', 1967, 5, 'libro'),
('El amor en los tiempos del cólera', 'Gabriel García Márquez', '978-84-376-0495-4', 1985, 3, 'libro'),
('Rayuela', 'Julio Cortázar', '978-84-376-0496-1', 1963, 2, 'libro'),
('La casa de los espíritus', 'Isabel Allende', '978-84-376-0497-8', 1982, 4, 'libro'),
('Ficciones', 'Jorge Luis Borges', '978-84-376-0498-5', 1944, 6, 'libro'),
('Nacional Geographic España', 'Varios Autores', '978-84-376-0499-2', 2024, 12, 'revista'),
('Muy Interesante', 'Varios Autores', '978-84-376-0500-5', 2024, 8, 'revista'),
('Scientific American', 'Varios Autores', '978-84-376-0501-2', 2024, 5, 'revista');