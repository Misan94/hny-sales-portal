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
      announcement_reads: {
        Row: {
          announcement_id: number
          employee_name: string
          id: number
          read_at: string
        }
        Insert: {
          announcement_id: number
          employee_name: string
          id?: number
          read_at?: string
        }
        Update: {
          announcement_id?: number
          employee_name?: string
          id?: number
          read_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          author: string
          content: string
          created_at: string
          id: number
          is_active: boolean
          priority: string
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          content: string
          created_at?: string
          id?: number
          is_active?: boolean
          priority?: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          id?: number
          is_active?: boolean
          priority?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      channel_members: {
        Row: {
          added_at: string
          added_by: string | null
          channel_id: string
          id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          added_by?: string | null
          channel_id: string
          id?: string
          user_id: string
        }
        Update: {
          added_at?: string
          added_by?: string | null
          channel_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_members_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      "fcmg sample product list": {
        Row: {
          Brand: string | null
          "Carton Prize": string | null
          Category: string | null
          "Product ID": string
          "Product Name": string | null
          "Unit Pack Size (Grams)": number | null
          "Unit Price": string | null
        }
        Insert: {
          Brand?: string | null
          "Carton Prize"?: string | null
          Category?: string | null
          "Product ID": string
          "Product Name"?: string | null
          "Unit Pack Size (Grams)"?: number | null
          "Unit Price"?: string | null
        }
        Update: {
          Brand?: string | null
          "Carton Prize"?: string | null
          Category?: string | null
          "Product ID"?: string
          "Product Name"?: string | null
          "Unit Pack Size (Grams)"?: number | null
          "Unit Price"?: string | null
        }
        Relationships: []
      }
      "fmcg sample customer data": {
        Row: {
          Age: number | null
          "Customer ID": string
          "First Name": string | null
          Gender: string | null
          "Household Size": number | null
          "Last Name": string | null
          "Local Government": string | null
          State: string | null
        }
        Insert: {
          Age?: number | null
          "Customer ID": string
          "First Name"?: string | null
          Gender?: string | null
          "Household Size"?: number | null
          "Last Name"?: string | null
          "Local Government"?: string | null
          State?: string | null
        }
        Update: {
          Age?: number | null
          "Customer ID"?: string
          "First Name"?: string | null
          Gender?: string | null
          "Household Size"?: number | null
          "Last Name"?: string | null
          "Local Government"?: string | null
          State?: string | null
        }
        Relationships: []
      }
      "fmcg sample transaction data": {
        Row: {
          Brand: string | null
          Category: string | null
          "Customer ID": string | null
          Date: string | null
          "Product Name": string | null
          "Purchase Type": string | null
          "Transaction Cost": string | null
          "Transaction ID": string
          "Unit Pack Size": number | null
        }
        Insert: {
          Brand?: string | null
          Category?: string | null
          "Customer ID"?: string | null
          Date?: string | null
          "Product Name"?: string | null
          "Purchase Type"?: string | null
          "Transaction Cost"?: string | null
          "Transaction ID": string
          "Unit Pack Size"?: number | null
        }
        Update: {
          Brand?: string | null
          Category?: string | null
          "Customer ID"?: string | null
          Date?: string | null
          "Product Name"?: string | null
          "Purchase Type"?: string | null
          "Transaction Cost"?: string | null
          "Transaction ID"?: string
          "Unit Pack Size"?: number | null
        }
        Relationships: []
      }
      message_reads: {
        Row: {
          channel_id: string
          created_at: string
          id: string
          last_read_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          id?: string
          last_read_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          id?: string
          last_read_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          channel_id: string
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          channel_id: string
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          resource_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          resource_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "onboarding_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_resources: {
        Row: {
          created_at: string
          department: string
          description: string | null
          estimated_duration: number | null
          id: string
          is_required: boolean | null
          order_index: number
          resource_type: string
          resource_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_required?: boolean | null
          order_index?: number
          resource_type: string
          resource_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_required?: boolean | null
          order_index?: number
          resource_type?: string
          resource_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      policies: {
        Row: {
          created_at: string
          file_name: string | null
          file_url: string | null
          id: number
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: number
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: number
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          access_level: string
          created_at: string
          date_of_birth: string | null
          department: string
          email: string
          employee: string
          id: string
          manager: string | null
          phone_number: string | null
          role: string | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          access_level?: string
          created_at?: string
          date_of_birth?: string | null
          department: string
          email: string
          employee: string
          id: string
          manager?: string | null
          phone_number?: string | null
          role?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          access_level?: string
          created_at?: string
          date_of_birth?: string | null
          department?: string
          email?: string
          employee?: string
          id?: string
          manager?: string | null
          phone_number?: string | null
          role?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_stages: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          order_index: number
          project_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          order_index?: number
          project_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          order_index?: number
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_stages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          created_by: string
          department: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          department: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          department?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          created_at: string
          file_name: string | null
          file_url: string | null
          id: number
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: number
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: number
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_reads: {
        Row: {
          created_at: string
          id: string
          last_read_at: string
          task_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_read_at?: string
          task_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_read_at?: string
          task_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string
          description: string | null
          document_url: string | null
          due_date: string | null
          id: string
          priority: string | null
          project_id: string
          stage_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          document_url?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id: string
          stage_id: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          document_url?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string
          stage_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "project_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      toolbase: {
        Row: {
          created_at: string
          Description: string | null
          id: number
          "Login Email": string | null
          "Login Password": string | null
          Tool: string | null
        }
        Insert: {
          created_at?: string
          Description?: string | null
          id?: number
          "Login Email"?: string | null
          "Login Password"?: string | null
          Tool?: string | null
        }
        Update: {
          created_at?: string
          Description?: string | null
          id?: number
          "Login Email"?: string | null
          "Login Password"?: string | null
          Tool?: string | null
        }
        Relationships: []
      }
      waitlist_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          monthly_spend: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          monthly_spend?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          monthly_spend?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_user_view_channel: {
        Args: { channel_id: string; user_id: string }
        Returns: boolean
      }
      user_can_access_channel: {
        Args: { channel_id: string; user_id: string }
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
