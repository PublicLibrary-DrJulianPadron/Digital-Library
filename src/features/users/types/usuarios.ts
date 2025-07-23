export type Usuarios = {
  id: string;
  activo: boolean;
  cedula: string;
  email: string;
  fecha_registro: string;
  nombre_completo: string;
  prestamos_activos: number;
  telefono: string | null;
  ultima_actividad: string | null;
}

export type UsuariosRow = {
  created_at: string;
  updated_at: string;
};

export type UsuariosInsert = Partial<Usuarios>;

export type UsuariosUpdate = Partial<Usuarios>;