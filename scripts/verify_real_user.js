// Verification Script: Create Real User using native fetch

const SUPABASE_URL = 'https://epacysjywesekvxasnmg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwYWN5c2p5d2VzZWt2eGFzbm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDA5NTYsImV4cCI6MjA4NjcxNjk1Nn0.cliNyuxjU-5-_YIj_DrFpmAmCHJf2UiMnlw-8gtUI3E';

const newUser = {
    nombre: 'Usuario Real Prueba',
    email: 'real@auraflow.cl',
    plan: 'Plan Gimnasio',
    estado: 'Activo',
    clases_restantes: 999,
    fecha_vencimiento: '2027-04-01'
};

async function verifyCreate() {
    console.log('--- Verifying Real User Creation ---');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/socios`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(newUser)
    });

    if (response.ok) {
        console.log('✅ Success: User "Usuario Real Prueba" created.');
    } else {
        const error = await response.json();
        console.error('❌ Failed to create real user:', error);
    }
}

verifyCreate();
