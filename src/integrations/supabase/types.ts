export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      business_members: {
        Row: {
          business_id: string
          customer_name: string | null
          first_stamp_completed: boolean | null
          id: string
          is_anonymous: boolean | null
          joined_at: string
          redeemed_rewards: number | null
          referral_bonus_awarded: boolean | null
          referral_code: string | null
          referred_by_code: string | null
          stamps: number | null
          total_rewards_earned: number | null
          total_stamps_collected: number | null
          user_id: string | null
        }
        Insert: {
          business_id: string
          customer_name?: string | null
          first_stamp_completed?: boolean | null
          id?: string
          is_anonymous?: boolean | null
          joined_at?: string
          redeemed_rewards?: number | null
          referral_bonus_awarded?: boolean | null
          referral_code?: string | null
          referred_by_code?: string | null
          stamps?: number | null
          total_rewards_earned?: number | null
          total_stamps_collected?: number | null
          user_id?: string | null
        }
        Update: {
          business_id?: string
          customer_name?: string | null
          first_stamp_completed?: boolean | null
          id?: string
          is_anonymous?: boolean | null
          joined_at?: string
          redeemed_rewards?: number | null
          referral_bonus_awarded?: boolean | null
          referral_code?: string | null
          referred_by_code?: string | null
          stamps?: number | null
          total_rewards_earned?: number | null
          total_stamps_collected?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          bonus_periods: Json | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          owner_id: string
          referral_bonus_points: number | null
          referral_enabled: boolean | null
          slug: string
          stamp_expiry_days: number | null
          updated_at: string
          welcome_stamps: number | null
          welcome_stamps_enabled: boolean | null
        }
        Insert: {
          bonus_periods?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          owner_id: string
          referral_bonus_points?: number | null
          referral_enabled?: boolean | null
          slug: string
          stamp_expiry_days?: number | null
          updated_at?: string
          welcome_stamps?: number | null
          welcome_stamps_enabled?: boolean | null
        }
        Update: {
          bonus_periods?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          owner_id?: string
          referral_bonus_points?: number | null
          referral_enabled?: boolean | null
          slug?: string
          stamp_expiry_days?: number | null
          updated_at?: string
          welcome_stamps?: number | null
          welcome_stamps_enabled?: boolean | null
        }
        Relationships: []
      }
      expired_stamps_log: {
        Row: {
          business_id: string
          business_member_id: string
          customer_name: string | null
          expired_at: string
          id: string
          stamps_expired: number
        }
        Insert: {
          business_id: string
          business_member_id: string
          customer_name?: string | null
          expired_at?: string
          id?: string
          stamps_expired: number
        }
        Update: {
          business_id?: string
          business_member_id?: string
          customer_name?: string | null
          expired_at?: string
          id?: string
          stamps_expired?: number
        }
        Relationships: [
          {
            foreignKeyName: "expired_stamps_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expired_stamps_log_business_member_id_fkey"
            columns: ["business_member_id"]
            isOneToOne: false
            referencedRelation: "business_members"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_card_configs: {
        Row: {
          business_id: string
          config: Json
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          business_id: string
          config: Json
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          config?: Json
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_card_configs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          business_name: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_type: string | null
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          business_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
      stamp_records: {
        Row: {
          business_id: string
          business_member_id: string
          created_at: string
          expired_at: string | null
          id: string
          is_expired: boolean | null
        }
        Insert: {
          business_id: string
          business_member_id: string
          created_at?: string
          expired_at?: string | null
          id?: string
          is_expired?: boolean | null
        }
        Update: {
          business_id?: string
          business_member_id?: string
          created_at?: string
          expired_at?: string | null
          id?: string
          is_expired?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "stamp_records_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stamp_records_business_member_id_fkey"
            columns: ["business_member_id"]
            isOneToOne: false
            referencedRelation: "business_members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_business_cascade: {
        Args: { business_id_param: string }
        Returns: undefined
      }
      expire_old_stamps: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      fix_inconsistent_stamp_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_referral_code: {
        Args: { customer_name: string; member_id: string }
        Returns: string
      }
      generate_unique_slug: {
        Args: { business_name: string }
        Returns: string
      }
      get_expiring_stamps: {
        Args: { days_ahead?: number }
        Returns: {
          business_id: string
          business_member_id: string
          customer_name: string
          business_name: string
          stamps_expiring: number
          expires_in_days: number
        }[]
      }
      increment_redeemed_rewards: {
        Args: { user_id_param: string; business_id_param: string }
        Returns: number
      }
      is_business_owner: {
        Args: { business_id_param: string }
        Returns: boolean
      }
      is_superadmin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
