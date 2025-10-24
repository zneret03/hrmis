export type Json = Record<
  string,
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
>;

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      attendance: {
        Row: {
          archived_at: string | null;
          created_at: string | null;
          days_absent: number;
          days_present: number;
          employee_id: string | null;
          id: string;
          month: string;
          tardiness_count: number;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          archived_at?: string | null;
          created_at?: string | null;
          days_absent: number;
          days_present: number;
          employee_id?: string | null;
          id?: string;
          month: string;
          tardiness_count: number;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string | null;
          days_absent?: number;
          days_present?: number;
          employee_id?: string | null;
          id?: string;
          month?: string;
          tardiness_count?: number;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'attendance_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'attendance_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      employee_loyalty_threshold: {
        Row: {
          id: string;
          year_threshold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string | null;
          year_threshold?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string | null;
          year_threshold?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      attendance_summary: {
        Row: {
          id: string;
          timestamp: string;
          total_hours: number;
          status: string;
          archived_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string | null;
          timestamp?: string | null;
          total_hours?: number | null;
          status?: string | null;
          archived_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          timestamp?: string | null;
          total_hours?: number | null;
          status?: string | null;
          archived_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      awards: {
        Row: {
          title: string | null;
          description: string | null;
          read: string | Date | null;
          archived_at: string | Date | null;
          award_type: string;
          created_at: string | null;
          id: string;
          updated_at: string | null;
          user_id: string | null;
          year: number;
        };
        Insert: {
          title?: string | null;
          description?: string | null;
          read?: string | Date | null;
          archived_at?: string | Date | null;
          award_type: string;
          created_at?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
          year: number;
        };
        Update: {
          title?: string | null;
          description?: string | null;
          read?: string | Date | null;
          archived_at?: string | Date | null;
          award_type?: string;
          created_at?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'awards_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      biometrics: {
        Row: {
          created_at: string | null;
          employee_id: string | null;
          id: string;
          timestamp: string;
          type: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          employee_id?: string | null;
          id?: string;
          timestamp: string;
          type: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          employee_id?: string | null;
          id?: string;
          timestamp?: string;
          type?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'biometrics_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['employee_id'];
          },
        ];
      };
      certificates: {
        Row: {
          archived_at: string | Date | null;
          certificate_type: string;
          certificate_status: string;
          created_at: string | null;
          title: string | null;
          reason: string | null;
          data: Json;
          file: string;
          id: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          archived_at?: string | Date | null;
          certificate_type: string;
          certificate_status: string;
          created_at?: string | null;
          title?: string | null;
          reason?: string | null;
          data?: Json | null;
          file?: string;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          archived_at?: string | Date | null;
          certificate_type?: string;
          certificate_status?: string;
          created_at?: string | null;
          title?: string | null;
          reason?: string | null;
          data?: Json;
          file?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'certificates_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      leave_applications: {
        Row: {
          archived_at: string | null;
          created_at: string | null;
          end_date: string | Date;
          id: string;
          leave_id: string;
          remarks: string | null;
          start_date: string | Date;
          status: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          archived_at?: string | null;
          created_at?: string | null;
          end_date: string;
          id?: string;
          leave_id: string;
          remarks?: string | null;
          start_date: string;
          status: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string | null;
          end_date?: string;
          id?: string;
          leave_id?: string;
          remarks?: string | null;
          start_date?: string;
          status?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'leave_applications_leave_id_fkey';
            columns: ['leave_id'];
            isOneToOne: false;
            referencedRelation: 'leave_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'leave_applications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      leave_categories: {
        Row: {
          archived_at: string | null;
          created_at: string | null;
          id: string;
          name: string | null;
          updated_at: string | null;
        };
        Insert: {
          archived_at?: string | null;
          created_at?: string | null;
          id?: string;
          name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string | null;
          id?: string;
          name?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      leave_credits: {
        Row: {
          archived_at: string | null;
          created_at: string | null;
          credits: number;
          id: string;
          max_credits: number;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          archived_at?: string | null;
          created_at?: string | null;
          credits?: number;
          id?: string;
          max_credits: number;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string | null;
          credits?: number;
          id?: string;
          max_credits: number;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'leave_credits_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      pds: {
        Row: {
          archived_at: string | null;
          created_at: string | null;
          educational_background: Json | null;
          family_background: Json | null;
          id: string;
          personal_information: Json | null;
          updated_at: string | null;
          user_id: string | null;
          file: string | null;
          other_static_data: Json | null;
          voluntary_work: Json[] | null;
          civil_service_eligibility: Json[] | null;
          training_programs: Json[] | null;
          other_information: Json[] | null;
          pds_references: Json[] | null;
          work_experience: Json[] | null;
        };
        Insert: {
          archived_at?: string | null;
          created_at?: string | null;
          educational_background?: Json | null;
          family_background?: Json | null;
          id?: string;
          personal_information: Json;
          updated_at?: string | null;
          user_id?: string | null;
          file?: string | null;
          other_static_data?: Json | null;
          voluntary_work?: Json[] | null;
          civil_service_eligibility?: Json[] | null;
          training_programs?: Json[] | null;
          other_information?: Json[] | null;
          pds_references: Json[] | null;
          work_experience?: Json[] | null;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string | null;
          educational_background?: Json | null;
          family_background?: Json | null;
          id?: string;
          personal_information?: Json;
          updated_at?: string | null;
          user_id?: string | null;
          file?: string | null;
          other_static_data?: Json | null;
          voluntary_work?: Json[] | null;
          civil_service_eligibility?: Json[] | null;
          training_programs?: Json[] | null;
          other_information?: Json[] | null;
          pds_references: Json[] | null;
          work_experience?: Json[] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'pds_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      document_templates: {
        Row: {
          id: string;
          file: string;
          name: string;
          archived_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string | null;
          file: string;
          name: string;
          archived_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Update: {
          id: string | null;
          file: string | null;
          name: string | null;
          archived_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
      };
      users: {
        Row: {
          archived_at: string | null;
          avatar: string | null;
          username: string | null;
          created_at: string | null;
          email: string;
          employee_id: string | null;
          id: string;
          role: string;
          updated_at: string | null;
        };
        Insert: {
          archived_at?: string | null;
          avatar?: string | null;
          created_at?: string | null;
          email: string;
          username: string;
          employee_id?: string | null;
          id: string;
          role: string;
          updated_at?: string | null;
        };
        Update: {
          archived_at?: string | null;
          avatar?: string | null;
          created_at?: string | null;
          email?: string;
          username?: string;
          employee_id?: string | null;
          id?: string;
          role?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_yearly_awards: {
        Args: { p_year: number };
        Returns: undefined;
      };
      import_attendance_dat: {
        Args: { p_dat_data: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
