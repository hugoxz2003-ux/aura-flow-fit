// Aura Flow Fit - Global Supabase Configuration
const SUPABASE_URL = 'https://epacysjywesekvxasnmg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwYWN5c2p5d2VzZWt2eGFzbm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDA5NTYsImV4cCI6MjA4NjcxNjk1Nn0.cliNyuxjU-5-_YIj_DrFpmAmCHJf2UiMnlw-8gtUI3E';

// Initialize the Supabase client safely
(function() {
    if (typeof supabase === 'undefined') {
        console.error('AURA_CLOUD_ERROR: Supabase library (supabase.js) is missing. Check your <script> tags.');
        return;
    }

    try {
        const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        // Expose globally for both CRM and Member App
        window.auraSupabase = client;
        window.supabase = client;
        console.info('%c Aura Flow Fit: Cloud Connection Initialized ', 'background: #06B6D4; color: white; padding: 2px 5px; border-radius: 3px;');
    } catch (err) {
        console.error('AURA_CLOUD_CONFIG_ERROR:', err);
        // Provide a mock to prevent crashing the whole UI
        if (!window.supabase) {
            window.supabase = { 
                from: () => ({ select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }) })
            };
        }
    }
})();
