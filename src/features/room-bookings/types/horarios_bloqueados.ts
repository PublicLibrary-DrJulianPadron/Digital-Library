export type HorariosBloqueados = {
  id: string;
  descripcion: string | null;
  es_permanente: boolean | null;
  fecha: string;
  hora_fin: string;
  hora_inicio: string;
  motivo: string;
};

export type HorariosBloqueadosRow = HorariosBloqueados & {
  created_at: string;
  updated_at: string;
};

export type HorariosBloqueadosInsert = Partial<HorariosBloqueados>;

export type HorariosBloqueadosUpdate = Partial<HorariosBloqueados>;