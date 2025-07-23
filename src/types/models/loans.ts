import { LoanState } from '@/types/common/enums'; 

export type LoanRow = {
  book_id: string;
  created_at: string;
  estado: LoanState;
  fecha_fin: string;
  fecha_inicio: string;
  id: string;
  updated_at: string;
  user_id: string;
};

export type LoanInsert = {
  book_id: string;
  created_at?: string;
  estado?: LoanState;
  fecha_fin: string;
  fecha_inicio?: string;
  id?: string;
  updated_at?: string;
  user_id: string;
};

export type LoanUpdate = {
  book_id?: string;
  created_at?: string;
  estado?: LoanState;
  fecha_fin?: string;
  fecha_inicio?: string;
  id?: string;
  updated_at?: string;
  user_id?: string;
};