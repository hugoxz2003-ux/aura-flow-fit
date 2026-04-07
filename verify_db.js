const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://epacysjywesekvxasnmg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwYWN5c2p5d2VzZWt2eGFzbm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDA5NTYsImV4cCI6MjA4NjcxNjk1Nn0.cliNyuxjU-5-_YIj_DrFpmAmCHJf2UiMnlw-8gtUI3E';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verify() {
    console.log('Verifying Supabase connection...');
    
    const tables = ['socios', 'clases', 'reservas', 'lista_espera', 'membership_plans', 'transactions'];
    
    for (const table of tables) {
        const { data, error, count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
        
        if (error) {
            console.error(`Error checking table ${table}:`, error.message);
        } else {
            console.log(`Table ${table}: EXISTS (Count: ${count})`);
        }
    }

    // Check for a sample socio
    const { data: socios } = await supabase.from('socios').select('nombre, email').limit(5);
    console.log('Sample Socios:', socios);

    // Check for classes
    const { data: classes } = await supabase.from('clases').select('nombre, dia, horario').limit(5);
    console.log('Sample Classes:', classes);
}

verify();
