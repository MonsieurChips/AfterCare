/**
 * Example usage of the Supabase client
 * 
 * This file demonstrates how to use the Supabase client in your components.
 * You can delete this file once you understand how to use it.
 */

import { supabase, signInAnonymously, getCurrentUser, signOut } from './supabase';

// Example: Sign in anonymously when app starts
export const initializeAnonymousUser = async () => {
  try {
    // Check if user is already signed in
    const { data: { user } } = await getCurrentUser();
    
    if (!user) {
      // Sign in anonymously if no user exists
      const { data, error } = await signInAnonymously();
      
      if (error) {
        console.error('Failed to initialize anonymous user:', error);
        return null;
      }
      
      console.log('Anonymous user created:', data.user?.id);
      return data.user;
    }
    
    console.log('User already signed in:', user.id);
    return user;
  } catch (error) {
    console.error('Error initializing user:', error);
    return null;
  }
};

// Example: Insert data into a table
export const insertCheckIn = async (checkInData: { mood: string; notes?: string }) => {
  try {
    const { data: { user } } = await getCurrentUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('check_ins') // Replace with your actual table name
      .insert({
        user_id: user.id,
        ...checkInData,
        created_at: new Date().toISOString(),
      })
      .select();
    
    if (error) {
      console.error('Error inserting check-in:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to insert check-in:', error);
    throw error;
  }
};

// Example: Query data from a table
export const getCheckIns = async () => {
  try {
    const { data: { user } } = await getCurrentUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('check_ins') // Replace with your actual table name
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching check-ins:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch check-ins:', error);
    throw error;
  }
};

// Example: Listen to real-time changes
export const subscribeToCheckIns = (callback: (payload: any) => void) => {
  const { data: { user } } = await getCurrentUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }
  
  const subscription = supabase
    .channel('check_ins_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'check_ins',
        filter: `user_id=eq.${user.id}`,
      },
      callback
    )
    .subscribe();
  
  return subscription;
};
