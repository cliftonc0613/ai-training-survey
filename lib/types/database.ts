// Database type definitions for Supabase tables

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          resume_token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          resume_token: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          resume_token?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      quizzes: {
        Row: {
          id: string;
          title: string;
          description: string;
          questions: any; // JSON field
          estimated_time: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          questions: any;
          estimated_time: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          questions?: any;
          estimated_time?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_responses: {
        Row: {
          id: string;
          quiz_id: string;
          user_id: string;
          responses: any; // JSON field
          started_at: string;
          completed_at: string | null;
          progress: number;
          synced: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          user_id: string;
          responses: any;
          started_at?: string;
          completed_at?: string | null;
          progress?: number;
          synced?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          user_id?: string;
          responses?: any;
          started_at?: string;
          completed_at?: string | null;
          progress?: number;
          synced?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Helper types for easier access
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Quiz = Database['public']['Tables']['quizzes']['Row'];
export type QuizInsert = Database['public']['Tables']['quizzes']['Insert'];
export type QuizUpdate = Database['public']['Tables']['quizzes']['Update'];

export type QuizResponse = Database['public']['Tables']['quiz_responses']['Row'];
export type QuizResponseInsert = Database['public']['Tables']['quiz_responses']['Insert'];
export type QuizResponseUpdate = Database['public']['Tables']['quiz_responses']['Update'];
