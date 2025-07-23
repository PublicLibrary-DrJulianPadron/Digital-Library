import { Json } from '@/common/types/json';
import { AppRole, AppRoleConstants, } from '@/features/authentication/types/user_roles';
import { LoanState, LoanStateConstants } from '@/features/loans/types/loans';



import {
  BookRow, BookInsert, BookUpdate,
} from '@/features/books/types/books';
import {
  LoanRow, LoanInsert, LoanUpdate,
} from '@/features/loans/types/loans';
import {
  ProfilesRow, ProfilesInsert, ProfilesUpdate,
} from '@/features/users/types/profiles';
import {
  SolicitudesPrestamoSalaRow, SolicitudesPrestamoSalaInsert, SolicitudesPrestamoSalaUpdate,
} from '@/features/room-bookings/types/room_booking';
import {
  HorariosBloqueadosRow, HorariosBloqueadosInsert, HorariosBloqueadosUpdate,
} from '@/features/room-bookings/types/horarios_bloqueados';
import {
  UserRolesRow, UserRolesInsert, UserRolesUpdate,
} from '@/features/authentication/types/user_roles';
import {
  UsuariosRow, UsuariosInsert, UsuariosUpdate,
} from '@/features/users/types/usuarios';

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12@/features2@/features3 (519615d)";
  };
  public: {
    Tables: {
      horarios_bloqueados: {
        Row: HorariosBloqueadosRow;
        Insert: HorariosBloqueadosInsert;
        Update: HorariosBloqueadosUpdate;
        Relationships: [];
      };
      libros: {
        Row: BookRow;
        Insert: BookInsert;
        Update: BookUpdate;
        Relationships: [];
      };
      loans: {
        Row: LoanRow;
        Insert: LoanInsert;
        Update: LoanUpdate;
        Relationships: [
          {
            foreignKeyName: "loans_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "libros";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "loans_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: ProfilesRow;
        Insert: ProfilesInsert;
        Update: ProfilesUpdate;
        Relationships: [];
      };
      solicitudes_prestamo_sala: {
        Row: SolicitudesPrestamoSalaRow;
        Insert: SolicitudesPrestamoSalaInsert;
        Update: SolicitudesPrestamoSalaUpdate;
        Relationships: [];
      };
      user_roles: {
        Row: UserRolesRow;
        Insert: UserRolesInsert;
        Update: UserRolesUpdate;
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      usuarios: {
        Row: UsuariosRow;
        Insert: UsuariosInsert;
        Update: UsuariosUpdate;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_solicitud_number: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      has_role: {
        Args: {
          _user_id: string;
          _role: AppRole;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: AppRole;
      loan_state: LoanState;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
  ? R
  : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I;
  }
  ? I
  : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U;
  }
  ? U
  : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      app_role: AppRoleConstants,
      loan_state: LoanStateConstants,
    },
  },
} as const;