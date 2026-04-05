const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://epacysjywesekvxasnmg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwYWN5c2p5d2VzZWt2eGFzbm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDA5NTYsImV4cCI6MjA4NjcxNjk1Nn0.cliNyuxjU-5-_YIj_DrFpmAmCHJf2UiMnlw-8gtUI3E';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seed() {
    console.log('🚀 Iniciando sembrado de datos demo FINAL...');
    
    // 1. Socio de Prueba
    const { data: socio, error: errSocio } = await supabase
        .from('socios')
        .upsert({
            nombre: 'Ana Aura Flow',
            email: 'ana@example.com',
            plan: 'Pilates 2x Semanal',
            estado: 'Activo',
            clases_restantes: 8,
            fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            peso: 62.5,
            estatura: 165
        }, { onConflict: 'email' })
        .select()
        .single();

    if (errSocio) console.error('❌ Error Socio:', errSocio.message);
    else console.log('✅ Socio Demo listo:', socio.nombre);

    // 2. Clases para hoy y mañana
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const hoyIdx = new Date().getDay();
    const hoyDia = dias[hoyIdx];
    const mananaDia = dias[(hoyIdx + 1) % 7];

    const clasesData = [
        { nombre: 'Pilates Reformer Mañana', instructor: 'María González', horario: '09:00:00', tipo: 'pilates', cupos_ocupados: 3, cupos_max: 8, dia: hoyDia },
        { nombre: 'Pilates Reformer Tarde', instructor: 'María González', horario: '18:00:00', tipo: 'pilates', cupos_ocupados: 5, cupos_max: 8, dia: hoyDia },
        { nombre: 'Clase de Prueba Especial', instructor: 'Carlos Instructor', horario: '11:00:00', tipo: 'pilates', cupos_ocupados: 2, cupos_max: 10, dia: hoyDia },
        { nombre: 'Clase de Prueba Gratis', instructor: 'Carlos Instructor', horario: '12:00:00', tipo: 'pilates', cupos_ocupados: 0, cupos_max: 12, dia: mananaDia }
    ];

    const clasesIds = [];
    for (const c of clasesData) {
        // En lugar de upsert con onConflict (que requiere constraint), hacemos un select then insert/update
        const { data: existing } = await supabase
            .from('clases')
            .select('id')
            .match({ nombre: c.nombre, horario: c.horario, dia: c.dia })
            .single();

        if (existing) {
            console.log(`ℹ️ Clase existente: ${c.nombre} (${existing.id})`);
            clasesIds.push(existing.id);
        } else {
            const { data: cl, error: errCl } = await supabase.from('clases').insert([c]).select().single();
            if (errCl) console.error(`❌ Error Clase ${c.nombre}:`, errCl.message);
            else {
                console.log('✅ Clase creada:', cl.nombre);
                clasesIds.push(cl.id);
            }
        }
    }

    // 3. Reserva vinculada para el socio demo
    if (socio && clasesIds.length > 0) {
        const { error: errReserva } = await supabase
            .from('reservas')
            .insert([{
                socio_id: socio.id,
                clase_id: clasesIds[0],
                fecha: new Date().toISOString().split('T')[0],
                estado: 'Confirmada'
            }]);

        // Ignoramos error de duplicado en reservas para el demo
        console.log('✅ Intento de reserva para Ana finalizado.');
    }

    // 4. Leads de prueba
    const leadsData = [
        { nombre: 'Juan Lead Instagram', email: 'juan.inst@test.cl', source: 'Instagram', status: 'Nuevo', phone: '+56912345678', notas: 'Interesado en clase gratis' },
        { nombre: 'Carla Lead Web', email: 'carla.web@test.cl', source: 'Web', status: 'Contactado', phone: '+56987654321', notas: 'Quiere venir mañana' }
    ];

    for (const lead of leadsData) {
        const { error: errLead } = await supabase.from('leads').insert([lead]);
        if (errLead) console.log('ℹ️ Lead posiblemente ya existe:', lead.nombre);
        else console.log('✅ Lead agregado:', lead.nombre);
    }

    console.log('✨ Sembrado finalizado exitosamente.');
    process.exit(0);
}

seed();
