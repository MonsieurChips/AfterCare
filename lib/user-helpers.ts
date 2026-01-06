/**
 * User initialization helpers
 * These functions help manage user records in the database
 */

import { supabase, signInAnonymously, getCurrentUser } from './supabase';
import type { User, UserInsert } from '../types/supabase';

/**
 * Initialize or get user record
 * Creates a user record in the public.users table if it doesn't exist
 * This should be called after anonymous sign-in
 */
export const initializeUser = async (): Promise<{ data: User | null; error: any }> => {
  try {
    // First, ensure user is authenticated
    const { data: { user: authUser }, error: authError } = await getCurrentUser();

    if (authError || !authUser) {
      // Try to sign in anonymously
      const { data: signInData, error: signInError } = await signInAnonymously();

      if (signInError || !signInData.user) {
        console.error('Failed to authenticate user:', signInError);
        return { data: null, error: signInError || authError };
      }
    }

    const userId = authUser?.id || (await getCurrentUser()).data.user?.id;

    if (!userId) {
      return { data: null, error: new Error('User ID not found') };
    }

    // Check if user record already exists
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
      console.error('Error creating user record:', insertError);
      return { data: null, error: insertError };
    }

    return { data: newUser, error: null };
  } catch (error) {
    console.error('Failed to initialize user:', error);
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
