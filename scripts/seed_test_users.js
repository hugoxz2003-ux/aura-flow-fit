// Seeding 10 Test Users using native fetch

const SUPABASE_URL = 'https://epacysjywesekvxasnmg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwYWN5c2p5d2VzZWt2eGFzbm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDA5NTYsImV4cCI6MjA4NjcxNjk1Nn0.cliNyuxjU-5-_YIj_DrFpmAmCHJf2UiMnlw-8gtUI3E';

const testUsers = [
    { nombre: 'Socio Prueba 1', email: 'test1@auraflow.cl', plan: 'Pilates 2x Semanal', estado: 'Activo', clases_restantes: 8, fecha_vencimiento: '2026-05-01', peso: 70, estatura: 175, porcentaje_grasa: 15.5, porcentaje_musculo: 40.2 },
    { nombre: 'Socio Prueba 2', email: 'test2@auraflow.cl', plan: 'Pilates 3x Semanal', estado: 'Activo', clases_restantes: 12, fecha_vencimiento: '2026-05-15', peso: 65, estatura: 168, porcentaje_grasa: 22.1, porcentaje_musculo: 35.8 },
    { nombre: 'Socio Prueba 3', email: 'test3@auraflow.cl', plan: 'Plan Gimnasio', estado: 'Activo', clases_restantes: 999, fecha_vencimiento: '2027-01-01', peso: 82, estatura: 180, porcentaje_grasa: 18.2, porcentaje_musculo: 42.5 },
    { nombre: 'Socio Prueba 4', email: 'test4@auraflow.cl', plan: 'Pilates 1x Semanal', estado: 'Activo', clases_restantes: 4, fecha_vencimiento: '2026-04-15', peso: 58, estatura: 162, porcentaje_grasa: 25.0, porcentaje_musculo: 32.1 },
    { nombre: 'Socio Prueba 5', email: 'test5@auraflow.cl', plan: 'Pilates 2x Semanal', estado: 'Vencido', clases_restantes: 0, fecha_vencimiento: '2026-03-01', peso: 74, estatura: 178, porcentaje_grasa: 20.3, porcentaje_musculo: 38.7 },
    { nombre: 'Socio Prueba 6', email: 'test6@auraflow.cl', plan: 'Pilates 4x Semanal', estado: 'Activo', clases_restantes: 16, fecha_vencimiento: '2026-05-30', peso: 61, estatura: 166, porcentaje_grasa: 19.8, porcentaje_musculo: 34.2 },
    { nombre: 'Socio Prueba 7', email: 'test7@auraflow.cl', plan: 'Pilates 2x Semanal', estado: 'Activo', clases_restantes: 8, fecha_vencimiento: '2026-05-10', peso: 69, estatura: 172, porcentaje_grasa: 17.5, porcentaje_musculo: 39.1 },
    { nombre: 'Socio Prueba 8', email: 'test8@auraflow.cl', plan: 'Plan Gimnasio', estado: 'Activo', clases_restantes: 999, fecha_vencimiento: '2026-12-31', peso: 78, estatura: 185, porcentaje_grasa: 14.2, porcentaje_musculo: 45.3 },
    { nombre: 'Socio Prueba 9', email: 'test9@auraflow.cl', plan: 'Pilates 3x Semanal', estado: 'Activo', clases_restantes: 12, fecha_vencimiento: '2026-05-20', peso: 63, estatura: 169, porcentaje_grasa: 21.0, porcentaje_musculo: 36.4 },
    { nombre: 'Socio Prueba 10', email: 'test10@auraflow.cl', plan: 'Pilates 2x Semanal', estado: 'Congelado', clases_restantes: 6, fecha_vencimiento: '2026-06-01', peso: 72, estatura: 174, porcentaje_grasa: 23.4, porcentaje_musculo: 37.9 }
];

async function seed() {
    console.log('--- Seeding 10 Test Users ---');
    
    for (const user of testUsers) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/socios`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(user)
            });
            
            if (response.ok) {
                console.log(`✅ Success: ${user.nombre}`);
            } else {
                const error = await response.json();
                console.error(`❌ Failed: ${user.nombre}`, error);
            }
        } catch (err) {
            console.error(`💥 Error: ${user.nombre}`, err.message);
        }
    }
}

seed();
