// Aura Flow Fit - Global Supabase Configuration
const SUPABASE_URL = 'https://epacysjywesekvxasnmg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwYWN5c2p5d2VzZWt2eGFzbm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDA5NTYsImV4cCI6MjA4NjcxNjk1Nn0.cliNyuxjU-5-_YIj_DrFpmAmCHJf2UiMnlw-8gtUI3E';

// Create a persistence check to ensure window.supabase is eventually the client
(function() {
    let retryCount = 0;
    const MAX_RETRIES = 5;

    function initAuraCloud() {
        try {
            if (typeof supabase === 'undefined') {
                console.error('Guardian: Supabase SDK not found in window.');
                return;
            }

            // If it's already a client (has .from), don't recreate unless necessary
            if (window.supabase && typeof window.supabase.from === 'function') {
                return;
            }

            const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            
            // Expose globally - We use auraClient to avoid name collisions with the SDK in initial ticks
            window.auraClient = client;
            window.auraSupabase = client;
            
            // Attempt to overwrite window.supabase carefully
            // In many environments window.supabase might be the SDK object
            window.supabase = client;

            console.info('Aura Flow Fit: Client Initialized.');
            
            // Health Probe (Async, non-blocking)
            client.from('socios').select('count', { count: 'exact', head: true }).then(({ error }) => {
                if (!error || error.message === 'Unexpected token <') {
                    sessionStorage.setItem('aura_cloud_health', 'online');
                    console.info('%c Aura Flow Fit: Cloud Connection SECURED ', 'background: #06B6D4; color: white; padding: 2px 5px; border-radius: 3px;');
                } else {
                    throw error;
                }
            }).catch(err => {
                console.warn('Aura Cloud Probe Error:', err.message);
            });

        } catch (err) {
            console.error(`Aura Config Error:`, err.message);
        }
    }

    // Run immediately and also on a short delay to ensure SDK is parsed
    initAuraCloud();
    setTimeout(initAuraCloud, 100);
})();
