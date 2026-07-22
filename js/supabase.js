// Supabase credentials – replace locally, or let Netlify inject via env vars
const SUPABASE_URL = 'SUPABASE_URL_PLACEHOLDER';
const SUPABASE_ANON_KEY = 'SUPABASE_ANON_KEY_PLACEHOLDER';

// Attach to window so every script can access it reliably
if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✅ Supabase client ready');
} else {
  console.error('❌ Supabase library not loaded – check CDN script in HTML');
}