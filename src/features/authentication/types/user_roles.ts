export const AppRoleConstants = ["admin", "bibliotecario", "usuario"] as const;

export type AppRole = typeof AppRoleConstants[number];

export type UserRole = {
  id?: string;
  role?: AppRole;
  user_id?: string;
}

export type UserRolesRow = UserRole & {
  created_at: string;
  updated_at: string;
};

export type UserRolesInsert = Partial<UserRole>;

export type UserRolesUpdate = Partial<UserRole>;
