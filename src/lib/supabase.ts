import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_SUPABASE_URL = 'lapaktani_supabase_url_custom';
const STORAGE_KEY_SUPABASE_KEY = 'lapaktani_supabase_key_custom';

export function getCustomSupabaseConfig(): { url: string; key: string } {
  try {
    const savedUrl = localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || '';
    const savedKey = localStorage.getItem(STORAGE_KEY_SUPABASE_KEY) || '';
    
    const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
    const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
    
    // Priority: custom saved in localStorage > environment variable > default
    const url = savedUrl || envUrl || 'https://tgalvjwpwgrnrqhybglz.supabase.co';
    const key = savedKey || envKey || 'sb_publishable_K3sjmBb6lsfqTzx_4JudbQ_PFSSXCdx';
    return { url, key };
  } catch (e) {
    return {
      url: (import.meta as any).env?.VITE_SUPABASE_URL || '',
      key: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
    };
  }
}

export function saveCustomSupabaseConfig(url: string, key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_SUPABASE_KEY, key.trim());
  } catch (e) {
    console.error('Failed to save custom supabase config:', e);
  }
}

export function clearCustomSupabaseConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_SUPABASE_URL);
    localStorage.removeItem(STORAGE_KEY_SUPABASE_KEY);
  } catch (e) {
    console.error('Failed to clear custom supabase config:', e);
  }
}

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getCustomSupabaseConfig();
  return Boolean(
    url && 
    key && 
    url !== 'MY_SUPABASE_URL' && 
    url.startsWith('https://') &&
    key.length > 20
  );
};

let currentClient: SupabaseClient | null = null;
let currentConfigKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  const { url, key } = getCustomSupabaseConfig();
  const configKey = `${url}:${key}`;
  if (!currentClient || currentConfigKey !== configKey) {
    try {
      currentClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      currentConfigKey = configKey;
    } catch (err) {
      console.error('Failed to create Supabase client:', err);
      return null;
    }
  }
  return currentClient;
}

export const supabase = getSupabaseClient();
