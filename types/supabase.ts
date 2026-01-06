// Type definitions for Supabase Database
// These types match the schema defined in supabase/migrations/001_initial_schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Importance = 'low' | 'medium' | 'high';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          time: string | null;
          importance: Importance;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          time?: string | null;
          importance: Importance;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          time?: string | null;
          importance?: Importance;
          created_at?: string;
        };
      };
      check_ins: {
        Row: {
          id: string;
          user_id: string;
          mood: string;
          energy: number;
          emotions: string[];
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood: string;
          energy: number;
          emotions?: string[];
          timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mood?: string;
          energy?: number;
          emotions?: string[];
          timestamp?: string;
          created_at?: string;
        };
      };
      reflections: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience type aliases for easier usage
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];

export type CheckIn = Database['public']['Tables']['check_ins']['Row'];
export type CheckInInsert = Database['public']['Tables']['check_ins']['Insert'];
export type CheckInUpdate = Database['public']['Tables']['check_ins']['Update'];

export type Reflection = Database['public']['Tables']['reflections']['Row'];
export type ReflectionInsert = Database['public']['Tables']['reflections']['Insert'];
export type ReflectionUpdate = Database['public']['Tables']['reflections']['Update'];
