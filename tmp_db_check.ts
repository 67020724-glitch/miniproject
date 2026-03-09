import { supabase } from './lib/supabaseClient';

async function checkTable() {
  try {
    const { data, error } = await supabase.from('reading_logs').select('*').limit(1);
    console.log('Reading logs data:', data);
    console.log('Reading logs error:', error);
  } catch (e) {
    console.error('Fetch error:', e);
  }
}

checkTable();
