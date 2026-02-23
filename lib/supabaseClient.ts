
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Helper to check if a string is a valid URL
const isValidUrl = (urlString: string | undefined) => {
    try {
        return Boolean(new URL(urlString ?? ''));
    }
    catch (e) {
        return false;
    }
}

export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey
    ? createClient(supabaseUrl!, supabaseAnonKey)
    : createClient('https://placeholder.supabase.co', 'placeholder-key'); // Fallback to avoid crash

