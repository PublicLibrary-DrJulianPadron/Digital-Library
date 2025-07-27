-- Fix the handle_new_user function to work with existing profiles table structure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, national_document)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'cedula', '')
  );
  RETURN NEW;
END;
$$;