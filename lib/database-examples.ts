/**
 * Database Usage Examples
 * 
 * This file demonstrates how to use the database helpers with all table types.
 * You can reference this when building your screens.
 */

import { initializeUser } from './user-helpers';
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  createCheckIn,
  getCheckIns,
  updateCheckIn,
  deleteCheckIn,
  createReflection,
  getReflections,
  updateReflection,
  deleteReflection,
} from './database-helpers';
import { getCurrentUser } from './supabase';
import type { Importance } from '../types/supabase';

// ==================== Initialization ====================

/**
 * Initialize user when app starts
 * Call this in your App.tsx or main screen component
 */
export const setupUser = async () => {
  const { data: user, error } = await initializeUser();
  
  if (error) {
    console.error('Failed to initialize user:', error);
    return null;
  }
  
  console.log('User initialized:', user?.id);
  return user;
};

// ==================== Events Examples ====================

/**
 * Create an event
 */
export const exampleCreateEvent = async () => {
  const { data: { user } } = await getCurrentUser();
  if (!user) return;

  const { data, error } = await createEvent({
    user_id: user.id,
    type: 'meeting',
    time: new Date().toISOString(), // Optional
    importance: 'medium' as Importance,
  });

  if (error) {
    console.error('Failed to create event:', error);
    return;
  }

  console.log('Event created:', data);
};

/**
 * Get all events for current user
 */
export const exampleGetEvents = async () => {
  const { data, error } = await getEvents(10); // Limit to 10 most recent

  if (error) {
    console.error('Failed to fetch events:', error);
    return;
  }

  console.log('Events:', data);
};

/**
 * Update an event
 */
export const exampleUpdateEvent = async (eventId: string) => {
  const { data, error } = await updateEvent(eventId, {
    importance: 'high' as Importance,
  });

  if (error) {
    console.error('Failed to update event:', error);
    return;
  }

  console.log('Event updated:', data);
};

/**
 * Delete an event
 */
export const exampleDeleteEvent = async (eventId: string) => {
  const { error } = await deleteEvent(eventId);

  if (error) {
    console.error('Failed to delete event:', error);
    return;
  }

  console.log('Event deleted');
};

// ==================== Check-ins Examples ====================

/**
 * Create a check-in
 */
export const exampleCreateCheckIn = async () => {
  const { data: { user } } = await getCurrentUser();
  if (!user) return;

  const { data, error } = await createCheckIn({
    user_id: user.id,
    mood: 'calm',
    energy: 7,
    emotions: ['content', 'peaceful', 'grateful'],
    timestamp: new Date().toISOString(),
  });

  if (error) {
    console.error('Failed to create check-in:', error);
    return;
  }

  console.log('Check-in created:', data);
};

/**
 * Get all check-ins for current user
 */
export const exampleGetCheckIns = async () => {
  const { data, error } = await getCheckIns(20); // Limit to 20 most recent

  if (error) {
    console.error('Failed to fetch check-ins:', error);
    return;
  }

  console.log('Check-ins:', data);
};

/**
 * Update a check-in
 */
export const exampleUpdateCheckIn = async (checkInId: string) => {
  const { data, error } = await updateCheckIn(checkInId, {
    energy: 8,
    emotions: ['energetic', 'motivated'],
  });

  if (error) {
    console.error('Failed to update check-in:', error);
    return;
  }

  console.log('Check-in updated:', data);
};

// ==================== Reflections Examples ====================

/**
 * Create a reflection
 */
export const exampleCreateReflection = async () => {
  const { data: { user } } = await getCurrentUser();
  if (!user) return;

  const { data, error } = await createReflection({
    user_id: user.id,
    content: 'Today I felt more balanced and focused on my goals.',
  });

  if (error) {
    console.error('Failed to create reflection:', error);
    return;
  }

  console.log('Reflection created:', data);
};

/**
 * Get all reflections for current user
 */
export const exampleGetReflections = async () => {
  const { data, error } = await getReflections(30); // Limit to 30 most recent

  if (error) {
    console.error('Failed to fetch reflections:', error);
    return;
  }

  console.log('Reflections:', data);
};

/**
 * Update a reflection
 */
export const exampleUpdateReflection = async (reflectionId: string) => {
  const { data, error } = await updateReflection(reflectionId, {
    content: 'Updated reflection content here.',
  });

  if (error) {
    console.error('Failed to update reflection:', error);
    return;
  }

  console.log('Reflection updated:', data);
};

// ==================== Real-time Subscriptions ====================

/**
 * Subscribe to check-ins in real-time
 * This requires importing supabase directly
 */
export const exampleSubscribeToCheckIns = () => {
  const { supabase } = require('./supabase');
  const { getCurrentUser } = require('./supabase');

  getCurrentUser().then(({ data: { user } }) => {
    if (!user) return;

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
        (payload) => {
          console.log('Check-in change:', payload);
          // Update your UI here
        }
      )
      .subscribe();

    // Return subscription so you can unsubscribe later
    return subscription;
  });
};
