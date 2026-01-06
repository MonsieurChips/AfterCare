# Aftercare App

A React Native Expo app built with TypeScript, featuring navigation between Home, Check-In, and Insights screens.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   - Get these values from your [Supabase project settings](https://app.supabase.com/project/YOUR_PROJECT/settings/api)

3. Start the development server:
```bash
npm start
```

## Project Structure

- `App.tsx` - Main app component with bottom tab navigation
- `screens/` - Screen components (Home, Check-In, Insights)
- `lib/supabase.ts` - Reusable Supabase client with anonymous authentication
- `lib/database-helpers.ts` - Type-safe database helper functions
- `lib/user-helpers.ts` - User initialization and management helpers
- `lib/supabase.example.ts` - Example usage of Supabase client
- `types/supabase.ts` - TypeScript type definitions for Supabase database
- `supabase/migrations/` - Database schema and migrations

## Tech Stack

- React Native
- Expo SDK 54
- TypeScript
- React Navigation
- Supabase (Backend & Authentication)

## Supabase Setup

This app uses Supabase for backend services with anonymous user authentication.

### Database Schema

The app uses four main tables:
- **users** - User metadata (extends Supabase auth.users)
- **events** - User events with optional timing and importance
- **check_ins** - Mood, energy, and emotion check-ins
- **reflections** - Single sentence reflections

See `supabase/README.md` for detailed schema documentation and setup instructions.

### Setting Up the Database

1. Run the migration SQL in your Supabase project:
   - Go to Supabase Dashboard → SQL Editor
   - Copy and run `supabase/migrations/001_initial_schema.sql`

2. Enable anonymous authentication:
   - Go to Authentication → Providers
   - Enable "Anonymous" provider

### Using the Database

The Supabase client is configured in `lib/supabase.ts`:

```typescript
import { supabase, signInAnonymously } from './lib/supabase';
import { initializeUser } from './lib/user-helpers';
import { createCheckIn, getCheckIns } from './lib/database-helpers';

// Initialize user on app start
await initializeUser();

// Create a check-in
await createCheckIn({
  user_id: userId,
  mood: 'calm',
  energy: 7,
  emotions: ['content', 'peaceful'],
});
```

See `lib/supabase.example.ts` and `lib/database-helpers.ts` for more usage examples.