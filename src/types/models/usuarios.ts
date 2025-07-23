export type UsuariosRow = {
  activo: boolean;
  cedula: string;
  created_at: string;
  email: string;
  fecha_registro: string;
  id: string;
  nombre_completo: string;
  prestamos_activos: number;
  telefono: string | null;
  ultima_actividad: string | null;
  updated_at: string;
};

export type UsuariosInsert = {
  activo?: boolean;
  cedula: string;
  created_at?: string;
  email: string;
  fecha_registro?: string;
  id?: string;
  nombre_completo: string;
  prestamos_activos?: number;
  telefono?: string | null;
  ultima_actividad?: string | null;
  updated_at?: string;
};

export type UsuariosUpdate = {
  activo?: boolean;
  cedula?: string;
  created_at?: string;
  email?: string;
  fecha_registro?: string;
  id?: string;
  nombre_completo?: string;
  prestamos_activos?: number;
  telefono?: string | null;
  ultima_actividad?: string | null;
  updated_at?: string;
};