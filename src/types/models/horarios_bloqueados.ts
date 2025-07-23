export type HorariosBloqueadosRow = {
  created_at: string;
  descripcion: string | null;
  es_permanente: boolean | null;
  fecha: string;
  hora_fin: string;
  hora_inicio: string;
  id: string;
  motivo: string;
};

export type HorariosBloqueadosInsert = {
  created_at?: string;
  descripcion?: string | null;
  es_permanente?: boolean | null;
  fecha: string;
  hora_fin: string;
  hora_inicio: string;
  id?: string;
  motivo: string;
};

export type HorariosBloqueadosUpdate = {
  created_at?: string;
  descripcion?: string | null;
  es_permanente?: boolean | null;
  fecha?: string;
  hora_fin?: string;
  hora_inicio?: string;
  id?: string;
  motivo?: string;
};