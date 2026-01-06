/**
 * Database helper functions with type safety
 * These functions provide convenient wrappers around Supabase queries
 */

import { getSupabase, isSupabaseConfigured } from './supabase';
import type {
  Event,
  EventInsert,
  EventUpdate,
  CheckIn,
  CheckInInsert,
  CheckInUpdate,
  Reflection,
  ReflectionInsert,
  ReflectionUpdate,
  Importance,
} from '../types/supabase';

// Helper to get Supabase client with error handling
const getSupabaseClient = () => {
  const client = getSupabase();
  if (!client) {
    // Return null instead of throwing - let each function handle the error gracefully
    return null;
  }
  return client;
};

// Common error message for missing Supabase config
const SUPABASE_NOT_CONFIGURED_ERROR = {
  message: 'Supabase is not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
};

// ==================== Events ====================

export const createEvent = async (event: EventInsert): Promise<{ data: Event | null; error: any }> => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { data: null, error: SUPABASE_NOT_CONFIGURED_ERROR };
    }
    
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();

    if (error) {
      console.log('Error creating event:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: any) {
    console.log('Failed to create event:', error?.message || 'Unknown error');
    return { data: null, error: error || { message: 'Failed to create event' } };
  }
};

export const getEvents = async (limit?: number): Promise<{ data: Event[] | null; error: any }> => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { data: null, error: SUPABASE_NOT_CONFIGURED_ERROR };
    }
    
    let query = supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.log('Error fetching events:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: any) {
    console.log('Failed to fetch events:', error?.message || 'Unknown error');
    return { data: null, error: error || { message: 'Failed to fetch events' } };
  }
};

export const updateEvent = async (
  id: string,
  updates: EventUpdate
): Promise<{ data: Event | null; error: any }> => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { data: null, error: SUPABASE_NOT_CONFIGURED_ERROR };
    }
    
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log('Error updating event:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: any) {
    console.log('Failed to update event:', error?.message || 'Unknown error');
    return { data: null, error: error || { message: 'Failed to update event' } };
  }
};

export const deleteEvent = async (id: string): Promise<{ error: any }> => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { error: SUPABASE_NOT_CONFIGURED_ERROR };
    }
    
    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      console.log('Error deleting event:', error.message);
      return { error };
    }

    return { error: null };
  } catch (error: any) {
    console.log('Failed to delete event:', error?.message || 'Unknown error');
    return { error: error || { message: 'Failed to delete event' } };
  }
};

// ==================== Check-ins ====================

export const createCheckIn = async (
  checkIn: CheckInInsert
): Promise<{ data: CheckIn | null; error: any }> => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { data: null, error: SUPABASE_NOT_CONFIGURED_ERROR };
    }
    
    const { data, error } = await supabase
      .from('check_ins')
      .insert(checkIn)
      .select()
      .single();

    if (error) {
      console.log('Error creating check-in:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: any) {
    console.log('Failed to create check-in:', error?.message || 'Unknown error');
    return { data: null, error: error || { message: 'Failed to create check-in' } };
  }
};

export const getCheckIns = async (limit?: number): Promise<{ data: CheckIn[] | null; error: any }> => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { data: null, error: SUPABASE_NOT_CONFIGURED_ERROR };
    }
    
    let query = supabase
      .from('check_ins')
      .select('*')
      .order('timestamp', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.log('Error fetching check-ins:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: any) {
    console.log('Failed to fetch check-ins:', error?.message || 'Unknown error');
    return { data: null, error: error || { message: 'Failed to fetch check-ins' } };
  }
};

export const updateCheckIn = async (
  id: string,
  updates: CheckInUpdate
): Promise<{ data: CheckIn | null; error: any }> => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { data: null, error: SUPABASE_NOT_CONFIGURED_ERROR };
    }
    
    const { data, error } = await supabase
      .from('check_ins')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log('Error updating check-in:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: any) {
    console.log('Failed to update check-in:', error?.message || 'Unknown error');
    return { data: null, error: error || { message: 'Failed to update check-in' } };
  }
};

export const deleteCheckIn = async (id: string): Promise<{ error: any }> => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { error: SUPABASE_NOT_CONFIGURED_ERROR };
    }
    
    const { error } = await supabase.from('check_ins').delete().eq('id', id);

    if (error) {
      console.log('Error deleting check-in:', error.message);
      return { error };
    }

    return { error: null };
  } catch (error: any) {
    console.log('Failed to delete check-in:', error?.message || 'Unknown error');
    return { error: error || { message: 'Failed to delete check-in' } };
  }
};

// ==================== Reflections ====================

export const createReflection = async (
  reflection: ReflectionInsert
): Promise<{ data: Reflection | null; error: any }> => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { data: null, error: SUPABASE_NOT_CONFIGURED_ERROR };
    }
    
    const { data, error } = await supabase
      .from('reflections')
      .insert(reflection)
      .select()
      .single();

    if (error) {
      console.log('Error creating reflection:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: any) {
    console.log('Failed to create reflection:', error?.message || 'Unknown error');
    return { data: null, error: error || { message: 'Failed to create reflection' } };
  }
};

export const getReflections = async (
  limit?: number
): Promise<{ data: Reflection[] | null; error: any }> => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { data: null, error: SUPABASE_NOT_CONFIGURED_ERROR };
    }
    
    let query = supabase
      .from('reflections')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.log('Error fetching reflections:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: any) {
    console.log('Failed to fetch reflections:', error?.message || 'Unknown error');
    return { data: null, error: error || { message: 'Failed to fetch reflections' } };
  }
};

export const updateReflection = async (
  id: string,
  updates: ReflectionUpdate
): Promise<{ data: Reflection | null; error: any }> => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { data: null, error: SUPABASE_NOT_CONFIGURED_ERROR };
    }
    
    const { data, error } = await supabase
      .from('reflections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log('Error updating reflection:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: any) {
    console.log('Failed to update reflection:', error?.message || 'Unknown error');
    return { data: null, error: error || { message: 'Failed to update reflection' } };
  }
};

export const deleteReflection = async (id: string): Promise<{ error: any }> => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { error: SUPABASE_NOT_CONFIGURED_ERROR };
    }
    
    const { error } = await supabase.from('reflections').delete().eq('id', id);

    if (error) {
      console.log('Error deleting reflection:', error.message);
      return { error };
    }

    return { error: null };
  } catch (error: any) {
    console.log('Failed to delete reflection:', error?.message || 'Unknown error');
    return { error: error || { message: 'Failed to delete reflection' } };
  }
};

// ==================== Type exports ====================
export type { Importance };
