export type Profiles = {
  id: string;
  activo: boolean;
  cedula: string;
  direccion: string | null;
  edad: number | null;
  email: string;
  fecha_registro: string;
  nombre_completo: string;
  ocupacion: string | null;
  prestamos_activos: number;
  telefono: string | null;
  total_libros_prestados: number;
  ultima_actividad: string | null;
}

export type ProfilesRow = Profiles &{
  created_at: string;
  updated_at: string;
};

export type ProfilesInsert = Partial<Profiles>;

export type ProfilesUpdate = Partial<Profiles>;