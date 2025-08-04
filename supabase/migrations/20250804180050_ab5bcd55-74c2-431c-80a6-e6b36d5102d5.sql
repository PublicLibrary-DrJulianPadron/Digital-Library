-- Fix database schema: users as main table, profiles reference users
-- Step 1: Add user_id to profiles table (nullable first)
ALTER TABLE public.profiles 
ADD COLUMN user_id UUID;

-- Step 2: Update existing profiles to link to users where they exist
UPDATE public.profiles 
SET user_id = id 
WHERE id IN (SELECT id FROM public.users);

-- Step 3: Delete orphaned profiles that don't have corresponding users
DELETE FROM public.profiles 
WHERE id NOT IN (SELECT id FROM public.users);

-- Step 4: Now add the foreign key constraint
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Step 5: Make user_id required and unique (one-to-one relationship)
ALTER TABLE public.profiles 
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);

-- Step 6: Remove profile_id from users table
ALTER TABLE public.users 
DROP COLUMN IF EXISTS profile_id;

-- Step 7: Update the trigger function to use the correct relationship
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