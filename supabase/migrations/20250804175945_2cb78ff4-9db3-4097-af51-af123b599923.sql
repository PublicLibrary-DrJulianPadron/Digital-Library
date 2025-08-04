-- Fix database schema: users as main table, profiles reference users
-- Step 1: Add user_id to profiles table
ALTER TABLE public.profiles 
ADD COLUMN user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

-- Step 2: Update existing profiles to link to users (if any data exists)
UPDATE public.profiles 
SET user_id = id 
WHERE user_id IS NULL;

-- Step 3: Make user_id required and unique (one-to-one relationship)
ALTER TABLE public.profiles 
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);

-- Step 4: Remove profile_id from users table
ALTER TABLE public.users 
DROP COLUMN IF EXISTS profile_id;

-- Step 5: Update the trigger function to use the correct relationship
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, national_document)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'cedula', '')
  );
  RETURN NEW;
END;
$function$;