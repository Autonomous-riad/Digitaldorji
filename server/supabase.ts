import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';

const supabaseServiceRoleKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseServiceRoleKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('placeholder')
);

if (!isServerSupabaseConfigured) {
  console.info('[Digital Dorji] ℹ️ Server-side Supabase client is inactive. Relying purely on local JSON-flat-database storage.');
}

let serverSupabaseClient: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient | null {
  if (!isServerSupabaseConfigured) {
    return null;
  }
  if (!serverSupabaseClient) {
    try {
      serverSupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
    } catch (err) {
      console.warn('Server Supabase initialization failed:', err);
      return null;
    }
  }
  return serverSupabaseClient;
}

/**
 * Server-side helper to verify a Supabase access token and return the authenticated user
 */
export async function verifySupabaseToken(token: string) {
  const sb = getServerSupabase();
  if (!sb) return null;

  try {
    const { data: { user }, error } = await sb.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch (err) {
    console.error('Failed to verify Supabase token:', err);
    return null;
  }
}
