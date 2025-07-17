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
      usuarios: {
        Row: {
          activo: boolean
          cedula: string
          created_at: string
          email: string
          fecha_registro: string
          id: string
          nombre_completo: string
          prestamos_activos: number
          telefono: string | null
          ultima_actividad: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          cedula: string
          created_at?: string
          email: string
          fecha_registro?: string
          id?: string
          nombre_completo: string
          prestamos_activos?: number
          telefono?: string | null
          ultima_actividad?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          cedula?: string
          created_at?: string
          email?: string
          fecha_registro?: string
          id?: string
          nombre_completo?: string
          prestamos_activos?: number
          telefono?: string | null
          ultima_actividad?: string | null
          updated_at?: string
        }
        Relationships: []
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
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
