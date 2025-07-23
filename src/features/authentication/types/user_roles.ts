import { AppRole } from '@/common/common/enums';

export type UserRolesRow = {
  created_at: string;
  id: string;
  role: AppRole;
  user_id: string;
};

export type UserRolesInsert = {
  created_at?: string;
  id?: string;
  role?: AppRole;
  user_id: string;
};

export type UserRolesUpdate = {
  created_at?: string;
  id?: string;
  role?: AppRole;
  user_id?: string;
};