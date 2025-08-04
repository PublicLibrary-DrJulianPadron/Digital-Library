-- Create users rows for existing auth users
INSERT INTO public.users (id, email, username, password, first_name, last_name, is_active, is_staff, is_superuser)
SELECT 
  auth_users.id,
  auth_users.email,
  COALESCE(auth_users.raw_user_meta_data->>'username', split_part(auth_users.email, '@', 1)) as username,
  'imported_user' as password, -- placeholder since we can't access actual passwords
  COALESCE(auth_users.raw_user_meta_data->>'first_name', '') as first_name,
  COALESCE(auth_users.raw_user_meta_data->>'last_name', '') as last_name,
  true as is_active,
  false as is_staff,
  false as is_superuser
FROM auth.users auth_users
WHERE auth_users.id NOT IN (SELECT id FROM public.users);