import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verify credentials exist and are not placeholders
const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('dummy_anon_key');

if (!isConfigured) {
  console.warn(
    'Supabase environment variables are missing or default. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel settings.'
  );
}

// Only instantiate the client if properly configured to avoid throwing during load
export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
