export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          archived_at: string | null
          created_at: string | null
          days_absent: number
          days_present: number
          employee_id: string
          id: string
          month: string
          tardiness_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          archived_at?: string | null
          created_at?: string | null
          days_absent: number
          days_present: number
          employee_id: string
          id?: string
          month: string
          tardiness_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          archived_at?: string | null
          created_at?: string | null
          days_absent?: number
          days_present?: number
          employee_id?: string
          id?: string
          month?: string
          tardiness_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_summary: {
        Row: {
          archived_at: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          status: string
          timestamp: string
          total_hours: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          archived_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          status: string
          timestamp: string
          total_hours: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          archived_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          status?: string
          timestamp?: string
          total_hours?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_summary_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "attendance_summary_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      awards: {
        Row: {
          archived_at: string | null
          award_type: string
          created_at: string | null
          description: string | null
          id: string
          read: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          year: number
        }
        Insert: {
          archived_at?: string | null
          award_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          read?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          year: number
        }
        Update: {
          archived_at?: string | null
          award_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          read?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "awards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      biometrics: {
        Row: {
          archived_at: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          timestamp: string
          type: number
          updated_at: string | null
        }
        Insert: {
          archived_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          timestamp: string
          type: number
          updated_at?: string | null
        }
        Update: {
          archived_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          timestamp?: string
          type?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biometrics_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      certificates: {
        Row: {
          archived_at: string | null
          certificate_status: string
          certificate_type: string
          created_at: string | null
          data: Json | null
          file: string | null
          id: string
          reason: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          archived_at?: string | null
          certificate_status: string
          certificate_type: string
          created_at?: string | null
          data?: Json | null
          file?: string | null
          id?: string
          reason: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          archived_at?: string | null
          certificate_status?: string
          certificate_type?: string
          created_at?: string | null
          data?: Json | null
          file?: string | null
          id?: string
          reason?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          archived_at: string | null
          created_at: string | null
          file: string
          id: string
          name: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          archived_at?: string | null
          created_at?: string | null
          file: string
          id?: string
          name: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          archived_at?: string | null
          created_at?: string | null
          file?: string
          id?: string
          name?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      employee_loyalty_threshold: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          year_threshold: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          year_threshold?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          year_threshold?: number | null
        }
        Relationships: []
      }
      leave_applications: {
        Row: {
          archived_at: string | null
          created_at: string | null
          end_date: string
          id: string
          leave_id: string
          remarks: string | null
          start_date: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          archived_at?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          leave_id: string
          remarks?: string | null
          start_date: string
          status: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          archived_at?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          leave_id?: string
          remarks?: string | null
          start_date?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_applications_leave_id_fkey"
            columns: ["leave_id"]
            isOneToOne: false
            referencedRelation: "leave_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_categories: {
        Row: {
          archived_at: string | null
          created_at: string | null
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          archived_at?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          archived_at?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leave_credits: {
        Row: {
          archived_at: string | null
          created_at: string | null
          credits: number
          id: string
          max_credits: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          archived_at?: string | null
          created_at?: string | null
          credits?: number
          id?: string
          max_credits?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          archived_at?: string | null
          created_at?: string | null
          credits?: number
          id?: string
          max_credits?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pds: {
        Row: {
          archived_at: string | null
          civil_service_eligibility: Json | null
          created_at: string | null
          educational_background: Json | null
          family_background: Json | null
          file: string | null
          id: string
          other_information: Json | null
          other_static_data: Json | null
          pds_references: Json | null
          personal_information: Json | null
          training_programs: Json | null
          updated_at: string | null
          user_id: string | null
          voluntary_work: Json | null
          work_experience: Json | null
        }
        Insert: {
          archived_at?: string | null
          civil_service_eligibility?: Json | null
          created_at?: string | null
          educational_background?: Json | null
          family_background?: Json | null
          file?: string | null
          id?: string
          other_information?: Json | null
          other_static_data?: Json | null
          pds_references?: Json | null
          personal_information?: Json | null
          training_programs?: Json | null
          updated_at?: string | null
          user_id?: string | null
          voluntary_work?: Json | null
          work_experience?: Json | null
        }
        Update: {
          archived_at?: string | null
          civil_service_eligibility?: Json | null
          created_at?: string | null
          educational_background?: Json | null
          family_background?: Json | null
          file?: string | null
          id?: string
          other_information?: Json | null
          other_static_data?: Json | null
          pds_references?: Json | null
          personal_information?: Json | null
          training_programs?: Json | null
          updated_at?: string | null
          user_id?: string | null
          voluntary_work?: Json | null
          work_experience?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "pds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          archived_at: string | null
          avatar: string | null
          birthdate: string | null
          bp_number: string | null
          civil_status: string | null
          contact_number: string | null
          created_at: string | null
          date_of_original_appointment: string | null
          email: string
          employee_id: string | null
          employment_status: string | null
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          middle_name: string | null
          pagibig: string | null
          philhealth: string | null
          position: string | null
          role: string
          tin: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          address?: string | null
          archived_at?: string | null
          avatar?: string | null
          birthdate?: string | null
          bp_number?: string | null
          civil_status?: string | null
          contact_number?: string | null
          created_at?: string | null
          date_of_original_appointment?: string | null
          email: string
          employee_id?: string | null
          employment_status?: string | null
          first_name?: string | null
          gender?: string | null
          id: string
          last_name?: string | null
          middle_name?: string | null
          pagibig?: string | null
          philhealth?: string | null
          position?: string | null
          role: string
          tin?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          address?: string | null
          archived_at?: string | null
          avatar?: string | null
          birthdate?: string | null
          bp_number?: string | null
          civil_status?: string | null
          contact_number?: string | null
          created_at?: string | null
          date_of_original_appointment?: string | null
          email?: string
          employee_id?: string | null
          employment_status?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          middle_name?: string | null
          pagibig?: string | null
          philhealth?: string | null
          position?: string | null
          role?: string
          tin?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_year_end_awards: {
        Args: { award_year: number }
        Returns: undefined
      }
      decrement_update_credits: {
        Args: { count_dates: number; p_user_id: string }
        Returns: undefined
      }
      generate_yearly_awards: { Args: { p_year: number }; Returns: undefined }
      increment_update_credits: {
        Args: { count_dates: number; p_user_id: string }
        Returns: undefined
      }
      update_credits_for_latest_month: { Args: never; Returns: string }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

