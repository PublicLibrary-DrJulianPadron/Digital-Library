export type User = {
  id: string;
  username: string;
  email: string;
  password: string; // hashed
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string | null;
  date_joined: string;
  profile_id: string; // FK to Profile table
};

export type UsuariosRow = User & {
  created_at: string;
  updated_at: string;
};

export type UsuariosInsert = Partial<User>;

export type UsuariosUpdate = Partial<User>;