// Supabase Configuration
// This file connects both the Admin Dashboard and the Client PWA to the backend.

const SUPABASE_URL = 'https://epacysjywesekvxasnmg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwYWN5c2p5d2VzZWt2eGFzbm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDA5NTYsImV4cCI6MjA4NjcxNjk1Nn0.cliNyuxjU-5-_YIj_DrFpmAmCHJf2UiMnlw-8gtUI3E';

// Initialize the Supabase client
// We use a different name initially to avoid conflict with the global 'supabase' object from the CDN
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export it to the global scope so dashboard.js and client.js can use 'supabase'
window.supabase = _supabase;

console.log('Aura Flow Fit - Supabase Initialized Successfully');
