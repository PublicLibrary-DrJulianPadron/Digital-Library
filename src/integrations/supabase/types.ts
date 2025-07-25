export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      horarios_bloqueados: {
        Row: {
          created_at: string
          descripcion: string | null
          es_permanente: boolean | null
          fecha: string
          hora_fin: string
          hora_inicio: string
          id: string
          motivo: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          es_permanente?: boolean | null
          fecha: string
          hora_fin: string
          hora_inicio: string
          id?: string
          motivo: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          es_permanente?: boolean | null
          fecha?: string
          hora_fin?: string
          hora_inicio?: string
          id?: string
          motivo?: string
        }
        Relationships: []
      }
      libros: {
        Row: {
          ano_publicacion: number | null
          autor: string
          cantidad_existencia: number
          created_at: string
          id: string
          isbn: string | null
          nombre: string
          tipo_material: string
          updated_at: string
        }
        Insert: {
          ano_publicacion?: number | null
          autor: string
          cantidad_existencia?: number
          created_at?: string
          id?: string
          isbn?: string | null
          nombre: string
          tipo_material?: string
          updated_at?: string
        }
        Update: {
          ano_publicacion?: number | null
          autor?: string
          cantidad_existencia?: number
          created_at?: string
          id?: string
          isbn?: string | null
          nombre?: string
          tipo_material?: string
          updated_at?: string
        }
        Relationships: []
      }
      loans: {
        Row: {
          book_id: string
          created_at: string
          estado: Database["public"]["Enums"]["loan_state"]
          fecha_fin: string
          fecha_inicio: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          estado?: Database["public"]["Enums"]["loan_state"]
          fecha_fin: string
          fecha_inicio?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          estado?: Database["public"]["Enums"]["loan_state"]
          fecha_fin?: string
          fecha_inicio?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loans_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "libros"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_loans: number | null
          address: string | null
          age: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_activity: string | null
          national_document: string | null
          phone: string | null
          total_books_loaned: number | null
          updated_at: string | null
        }
        Insert: {
          active_loans?: number | null
          address?: string | null
          age?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_activity?: string | null
          national_document?: string | null
          phone?: string | null
          total_books_loaned?: number | null
          updated_at?: string | null
        }
        Update: {
          active_loans?: number | null
          address?: string | null
          age?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_activity?: string | null
          national_document?: string | null
          phone?: string | null
          total_books_loaned?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      solicitudes_prestamo_sala: {
        Row: {
          cedula: string
          comentarios_admin: string | null
          created_at: string
          descripcion: string
          email: string
          equipos_solicitados: string | null
          estado: string
          fecha_evento: string
          fecha_respuesta: string | null
          hora_fin: string
          hora_inicio: string
          id: string
          nombre_completo: string
          numero_participantes: number
          numero_solicitud: string
          requiere_equipos: boolean | null
          telefono: string
          tipo_evento: string
          updated_at: string
        }
        Insert: {
          cedula: string
          comentarios_admin?: string | null
          created_at?: string
          descripcion: string
          email: string
          equipos_solicitados?: string | null
          estado?: string
          fecha_evento: string
          fecha_respuesta?: string | null
          hora_fin: string
          hora_inicio: string
          id?: string
          nombre_completo: string
          numero_participantes: number
          numero_solicitud: string
          requiere_equipos?: boolean | null
          telefono: string
          tipo_evento: string
          updated_at?: string
        }
        Update: {
          cedula?: string
          comentarios_admin?: string | null
          created_at?: string
          descripcion?: string
          email?: string
          equipos_solicitados?: string | null
          estado?: string
          fecha_evento?: string
          fecha_respuesta?: string | null
          hora_fin?: string
          hora_inicio?: string
          id?: string
          nombre_completo?: string
          numero_participantes?: number
          numero_solicitud?: string
          requiere_equipos?: boolean | null
          telefono?: string
          tipo_evento?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          date_joined: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean
          is_staff: boolean
          is_superuser: boolean
          last_login: string | null
          last_name: string | null
          password: string
          profile_id: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          date_joined?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          is_staff?: boolean
          is_superuser?: boolean
          last_login?: string | null
          last_name?: string | null
          password: string
          profile_id?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          date_joined?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          is_staff?: boolean
          is_superuser?: boolean
          last_login?: string | null
          last_name?: string | null
          password?: string
          profile_id?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_solicitud_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "bibliotecario" | "usuario"
      loan_state:
        | "PRESTADO"
        | "EN ESPERA DE DEVOLUCION"
        | "DEVUELTO"
        | "EXTRAVIADO"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "bibliotecario", "usuario"],
      loan_state: [
        "PRESTADO",
        "EN ESPERA DE DEVOLUCION",
        "DEVUELTO",
        "EXTRAVIADO",
      ],
    },
  },
} as const
