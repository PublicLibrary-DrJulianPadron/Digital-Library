export type RoomBooking = {
  cedula: string;
  comentarios_admin: string | null;
  descripcion: string;
  email: string;
  equipos_solicitados: string | null;
  estado: string;
  fecha_evento: string;
  fecha_respuesta: string | null;
  hora_fin: string;
  hora_inicio: string;
  id: string;
  nombre_completo: string;
  numero_participantes: number;
  numero_solicitud: string;
  requiere_equipos: boolean | null;
  telefono: string;
  tipo_evento: string;
  updated_at: string;
};

export type RoomBookingRow = RoomBooking & {
  created_at: string;
  updated_at: string;
};

export type RoomBookingInsert = Partial<RoomBooking>;

export type RoomBookingUpdate = Partial<RoomBooking>;