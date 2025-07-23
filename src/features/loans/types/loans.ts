export const LoanStateConstants = [
  "PRESTADO",
  "EN ESPERA DE DEVOLUCION",
  "DEVUELTO",
  "EXTRAVIADO",
] as const;

export type LoanState = typeof LoanStateConstants[number];

export type Loan = {
  id: string;
  book_id: string;
  created_at: string;
  estado: LoanState;
  fecha_fin: string;
  fecha_inicio: string;
  updated_at: string;
  user_id: string;
};

export type LoanRow = Loan & {
  created_at?: string | Date; 
  updated_at?: string | Date; 
};

export type LoanInsert = Partial<Loan>;

export type LoanUpdate = Partial<Loan>;