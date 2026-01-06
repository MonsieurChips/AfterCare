/**
 * User initialization helpers
 * These functions help manage user records in the database
 */

import { getSupabase, signInAnonymously, getCurrentUser, isSupabaseConfigured } from './supabase';
import type { User, UserInsert } from '../types/supabase';

/**
 * Initialize or get user record
 * Creates a user record in the public.users table if it doesn't exist
 * This should be called after anonymous sign-in
 */
export const initializeUser = async (): Promise<{ data: User | null; error: any }> => {
  try {
    // Check if Supabase is configured first
    if (!isSupabaseConfigured()) {
      // Silently return - Supabase is not configured, which is okay
      return { data: null, error: null };
    }

    // First, ensure user is authenticated
    const { data: { user: authUser }, error: authError } = await getCurrentUser();

    if (authError || !authUser) {
      // Try to sign in anonymously
      const { data: signInData, error: signInError } = await signInAnonymously();

      if (signInError || !signInData.user) {
        // Only log as error if it's an unexpected error, not a configuration issue
        if (signInError?.message?.includes('not configured')) {
          return { data: null, error: null }; // Silent return for missing config
        }
        console.log('User authentication skipped:', signInError?.message || authError?.message);
        return { data: null, error: signInError || authError };
      }
    }

    const userId = authUser?.id || (await getCurrentUser()).data.user?.id;

    if (!userId) {
      return { data: null, error: new Error('User ID not found') };
    }

    // Check if user record already exists
    const supabase = getSupabase();
    if (!supabase) {
      return { data: null, error: new Error('Supabase is not configured') };
    }
    
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingUser) {
      // User record already exists
      return { data: existingUser, error: null };
    }

    // Create user record if it doesn't exist
    const userInsert: UserInsert = {
      id: userId,
    };

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert(userInsert)
      .select()
      .single();

    if (insertError) {
      console.log('Error creating user record:', insertError);
      return { data: null, error: insertError };
    }

    return { data: newUser, error: null };
  } catch (error: any) {
    // Only log unexpected errors, not configuration issues
    if (error?.message?.includes('not configured')) {
      return { data: null, error: null }; // Silent return
    }
    console.log('User initialization skipped:', error?.message || 'Unknown error');
    return { data: null, error };
  }
};

/**
 * Get current user record from database
 */
export const getUserRecord = async (): Promise<{ data: User | null; error: any }> => {
  try {
    const { data: { user: authUser }, error: authError } = await getCurrentUser();

    if (authError || !authUser) {
      return { data: null, error: authError || new Error('User not authenticated') };
    }

    const supabase = getSupabase();
    if (!supabase) {
      return { data: null, error: new Error('Supabase is not configured') };
    }
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error('Error fetching user record:', error);
      return { data: null, error };
    }

    return { data: user, error: null };
  } catch (error) {
    console.error('Failed to get user record:', error);
    return { data: null, error };
  }
};
