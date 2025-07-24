-- Drop existing usuarios table and create Django-compatible structure
DROP TABLE IF EXISTS usuarios CASCADE;

-- Create profile table first (for foreign key reference)
CREATE TABLE IF NOT EXISTS public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active BOOLEAN DEFAULT TRUE,
  address TEXT,
  age INTEGER,
  phone VARCHAR(20),
  active_loans INTEGER DEFAULT 0,
  total_books_loaned INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create users table (Django-aligned structure)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(150) NOT NULL UNIQUE,
  email VARCHAR(254) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name VARCHAR(150),
  last_name VARCHAR(150),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_staff BOOLEAN NOT NULL DEFAULT FALSE,
  is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE,
  date_joined TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  profile_id UUID REFERENCES public.profile(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Enable RLS on both tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for profile table
CREATE POLICY "Users can view their own profile" 
ON public.profile 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profile 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Allow profile creation" 
ON public.profile 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create policies for users table
CREATE POLICY "Users can view their own user record" 
ON public.users 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own user record" 
ON public.users 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = timezone('utc', now());
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_updated_at
BEFORE UPDATE ON public.profile
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();