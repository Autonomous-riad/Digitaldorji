import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Support both Vite (VITE_*) and Next.js (NEXT_PUBLIC_*) environment variables
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env || {} : {};
const procEnv = typeof process !== 'undefined' ? (process as any).env || {} : {};

export const supabaseUrl: string = 
  metaEnv.VITE_SUPABASE_URL ||
  metaEnv.NEXT_PUBLIC_SUPABASE_URL ||
  procEnv.SUPABASE_URL ||
  procEnv.NEXT_PUBLIC_SUPABASE_URL ||
  '';

export const supabaseAnonKey: string = 
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  metaEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  procEnv.SUPABASE_API_KEY ||
  procEnv.SUPABASE_SERVICE_ROLE_KEY ||
  procEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  typeof supabaseUrl === 'string' &&
  (supabaseUrl.startsWith('https://') || supabaseUrl.startsWith('http://')) &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('MY_')
);

if (!isSupabaseConfigured) {
  console.info('[Digital Dorji] ℹ️ Supabase integration is currently inactive (unconfigured or default values in use). Running in local JSON-flat-database fallback mode.');
}

// Browser Supabase instance
let browserClient: SupabaseClient | null = null;

export function createBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!browserClient) {
    try {
      browserClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.warn('Could not initialize Supabase browser client:', err);
      return null;
    }
  }
  return browserClient;
}

export function getSupabase(): SupabaseClient | null {
  return createBrowserClient();
}

export const supabase = isSupabaseConfigured ? getSupabase() : null;

export interface CustomerRecord {
  id: string;
  phone: string | null;
  email: string | null;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface AddressRecord {
  id: string;
  customer_id: string;
  label: string;
  district: string;
  thana?: string;
  area: string;
  street: string;
  landmark?: string;
  is_default: boolean;
  created_at?: string;
}

export interface MeasurementProfileRecord {
  id: string;
  customer_id: string;
  profile_name: string;
  gender: string;
  unit: string;
  notes?: string;
  created_at?: string;
}
