/**
 * Database helper functions with type safety
 * These functions provide convenient wrappers around Supabase queries
 */

import { supabase } from './supabase';
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

// ==================== Events ====================

export const createEvent = async (event: EventInsert): Promise<{ data: Event | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Failed to create event:', error);
    return { data: null, error };
  }
};

export const getEvents = async (limit?: number): Promise<{ data: Event[] | null; error: any }> => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching events:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return { data: null, error };
  }
};

export const updateEvent = async (
  id: string,
  updates: EventUpdate
): Promise<{ data: Event | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Failed to update event:', error);
    return { data: null, error };
  }
};

export const deleteEvent = async (id: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Failed to delete event:', error);
    return { error };
  }
};

// ==================== Check-ins ====================

export const createCheckIn = async (
  checkIn: CheckInInsert
): Promise<{ data: CheckIn | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('check_ins')
      .insert(checkIn)
      .select()
      .single();

    if (error) {
      console.error('Error creating check-in:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Failed to create check-in:', error);
    return { data: null, error };
  }
};

export const getCheckIns = async (limit?: number): Promise<{ data: CheckIn[] | null; error: any }> => {
  try {
    let query = supabase
      .from('check_ins')
      .select('*')
      .order('timestamp', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching check-ins:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Failed to fetch check-ins:', error);
    return { data: null, error };
  }
};

export const updateCheckIn = async (
  id: string,
  updates: CheckInUpdate
): Promise<{ data: CheckIn | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('check_ins')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating check-in:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Failed to update check-in:', error);
    return { data: null, error };
  }
};

export const deleteCheckIn = async (id: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase.from('check_ins').delete().eq('id', id);

    if (error) {
      console.error('Error deleting check-in:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Failed to delete check-in:', error);
    return { error };
  }
};

// ==================== Reflections ====================

export const createReflection = async (
  reflection: ReflectionInsert
): Promise<{ data: Reflection | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('reflections')
      .insert(reflection)
      .select()
      .single();

    if (error) {
      console.error('Error creating reflection:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Failed to create reflection:', error);
    return { data: null, error };
  }
};

export const getReflections = async (
  limit?: number
): Promise<{ data: Reflection[] | null; error: any }> => {
  try {
    let query = supabase
      .from('reflections')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reflections:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Failed to fetch reflections:', error);
    return { data: null, error };
  }
};

export const updateReflection = async (
  id: string,
  updates: ReflectionUpdate
): Promise<{ data: Reflection | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('reflections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating reflection:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Failed to update reflection:', error);
    return { data: null, error };
  }
};

export const deleteReflection = async (id: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase.from('reflections').delete().eq('id', id);

    if (error) {
      console.error('Error deleting reflection:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Failed to delete reflection:', error);
    return { error };
  }
};

// ==================== Type exports ====================
export type { Importance };
