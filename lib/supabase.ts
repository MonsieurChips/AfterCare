import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get environment variables from Expo Constants
const getSupabaseConfig = () => {
  const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  return { supabaseUrl, supabaseAnonKey };
};

// Lazy initialization - only create client when needed and if configured
let supabaseClient: SupabaseClient | null = null;

const getSupabaseClient = (): SupabaseClient | null => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

  if (!supabaseUrl || !supabaseAnonKey) {
    return null; // Return null instead of throwing
  }

  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Enable anonymous authentication
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    return supabaseClient;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
};

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  return !!(supabaseUrl && supabaseAnonKey);
};

// Export supabase client getter function (returns null if not configured)
export const getSupabase = (): SupabaseClient | null => {
  return getSupabaseClient();
};

// Export supabase client - will be null if not configured
// Use getSupabase() or check isSupabaseConfigured() before using
export const supabase = getSupabaseClient();

// Helper function to sign in anonymously
export const signInAnonymously = async () => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      // Return error silently - don't log as error since this is expected when not configured
      return { 
        data: null, 
        error: { message: 'Supabase is not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.' } 
      };
    }
    
    const { data, error } = await client.auth.signInAnonymously();
    
    if (error) {
      // Only log unexpected errors
      console.log('Error signing in anonymously:', error.message);
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    // Don't log configuration errors as errors
    if (error?.message?.includes('not configured')) {
      return { data: null, error };
    }
    console.log('Failed to sign in anonymously:', error?.message || 'Unknown error');
    return { data: null, error: error || { message: 'Failed to sign in anonymously' } };
  }
};

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return { 
        data: { user: null }, 
        error: { message: 'Supabase is not configured', status: 400 } 
      };
    }
    
    return await client.auth.getUser();
  } catch (error: any) {
    return { 
      data: { user: null }, 
      error: error || { message: 'Failed to get user', status: 500 } 
    };
  }
};

// Helper function to sign out
export const signOut = async () => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return { error: { message: 'Supabase is not configured' } };
    }
    
    const { error } = await client.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Failed to sign out:', error);
    return { error: error || { message: 'Failed to sign out' } };
  }
};
