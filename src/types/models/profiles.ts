export type ProfilesRow = {
  activo: boolean;
  cedula: string;
  created_at: string;
  direccion: string | null;
  edad: number | null;
  email: string;
  fecha_registro: string;
  id: string;
  nombre_completo: string;
  ocupacion: string | null;
  prestamos_activos: number;
  telefono: string | null;
  total_libros_prestados: number;
  ultima_actividad: string | null;
  updated_at: string;
};

export type ProfilesInsert = {
  activo?: boolean;
  cedula: string;
  created_at?: string;
  direccion?: string | null;
  edad?: number | null;
  email: string;
  fecha_registro?: string;
  id: string;
  nombre_completo: string;
  ocupacion?: string | null;
  prestamos_activos?: number;
  telefono?: string | null;
  total_libros_prestados?: number;
  ultima_actividad?: string | null;
  updated_at?: string;
};

export type ProfilesUpdate = {
  activo?: boolean;
  cedula?: string;
  created_at?: string;
  direccion?: string | null;
  edad?: number | null;
  email?: string;
  fecha_registro?: string;
  id?: string;
  nombre_completo?: string;
  ocupacion?: string | null;
  prestamos_activos?: number;
  telefono?: string | null;
  total_libros_prestados?: number;
  ultima_actividad?: string | null;
  updated_at?: string;
};