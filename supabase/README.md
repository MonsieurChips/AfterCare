# Supabase Database Setup

This directory contains the database schema and migrations for the Aftercare App.

## Database Schema

### Tables

1. **users** - Extends Supabase auth.users with metadata
   - `id` (UUID) - References auth.users
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

2. **events** - User events with optional timing
   - `id` (UUID) - Primary key
   - `user_id` (UUID) - Foreign key to users
   - `type` (Text) - Type of event
   - `time` (Timestamp, nullable) - Optional event time
   - `importance` (Text) - 'low', 'medium', or 'high'
   - `created_at` (Timestamp)

3. **check_ins** - User check-ins with mood, energy, and emotions
   - `id` (UUID) - Primary key
   - `user_id` (UUID) - Foreign key to users
   - `mood` (Text) - Mood description
   - `energy` (Integer) - Energy level (1-10)
   - `emotions` (Text array) - Array of emotions
   - `timestamp` (Timestamp) - When the check-in occurred
   - `created_at` (Timestamp)

4. **reflections** - Single sentence reflections
   - `id` (UUID) - Primary key
   - `user_id` (UUID) - Foreign key to users
   - `content` (Text) - Single sentence reflection
   - `created_at` (Timestamp)

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Copy the contents of `supabase/migrations/001_initial_schema.sql`
5. Paste and run it in the SQL Editor

### Option 2: Using Supabase CLI

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Run the migration:
   ```bash
   supabase db push
   ```

## Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only view, create, update, and delete their own data
- All operations require authentication
- Data is automatically filtered by `user_id`

## Indexes

Indexes are created on:
- `user_id` columns for faster user-specific queries
- `created_at`/`timestamp` columns for chronological sorting

## Notes

- The schema uses UTC timestamps for consistency
- The `users` table extends Supabase's built-in auth.users table
- All foreign keys use `ON DELETE CASCADE` to maintain data integrity
- The `updated_at` timestamp is automatically maintained via a trigger
