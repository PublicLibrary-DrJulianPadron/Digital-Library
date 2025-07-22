-- Create enum for loan states
CREATE TYPE public.loan_state AS ENUM ('PRESTADO', 'EN ESPERA DE DEVOLUCION', 'DEVUELTO', 'EXTRAVIADO');

-- Create loans table
CREATE TABLE public.loans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.libros(id) ON DELETE CASCADE,
  fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_fin DATE NOT NULL,
  estado loan_state NOT NULL DEFAULT 'PRESTADO',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own loans" 
ON public.loans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all loans" 
ON public.loans 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert loans" 
ON public.loans 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update loans" 
ON public.loans 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete loans" 
ON public.loans 
FOR DELETE 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_loans_updated_at
BEFORE UPDATE ON public.loans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();