import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // PWA handles its own session management
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'x-client-info': 'ai-training-survey-pwa',
    },
  },
});

// Helper functions for common database operations
export const db = {
  // Users
  async createUser(user: Database['public']['Tables']['users']['Insert']) {
    return supabase.from('users').insert(user as any).select().single();
  },

  async getUserByResumeToken(resumeToken: string) {
    return supabase.from('users').select('*').eq('resume_token', resumeToken).single();
  },

  async updateUser(id: string, updates: Database['public']['Tables']['users']['Update']) {
    return (supabase.from('users') as any).update(updates).eq('id', id).select().single();
  },

  async getUser(id: string) {
    return supabase.from('users').select('*').eq('id', id).single();
  },

  // Quizzes
  async getQuiz(id: string) {
    return supabase.from('quizzes').select('*').eq('id', id).single();
  },

  async getAllQuizzes() {
    return supabase.from('quizzes').select('*').order('created_at', { ascending: false });
  },

  // Quiz Responses
  async createQuizResponse(
    response: Database['public']['Tables']['quiz_responses']['Insert']
  ) {
    return supabase.from('quiz_responses').insert(response as any).select().single();
  },

  async updateQuizResponse(
    id: string,
    updates: Database['public']['Tables']['quiz_responses']['Update']
  ) {
    return (supabase.from('quiz_responses') as any).update(updates).eq('id', id).select().single();
  },

  async getQuizResponsesByUser(userId: string) {
    return supabase
      .from('quiz_responses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  async getQuizResponse(id: string) {
    return supabase.from('quiz_responses').select('*').eq('id', id).single();
  },

  async getAllQuizResponses() {
    return supabase
      .from('quiz_responses')
      .select('*')
      .order('created_at', { ascending: false });
  },

  async getAllUsers() {
    return supabase.from('users').select('*').order('created_at', { ascending: false });
  },
};
