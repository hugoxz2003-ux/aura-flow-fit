// Client PWA Logic
let clientData = {
    user: null, // Simulated logged in user for now
    classes: [],
    bookings: []
};

// Simulated login: In a real app, this would come from Supabase Auth
const MOCK_USER_EMAIL = 'maria@example.com';

async function initClient() {
    try {
        // Fetch user data
        const { data: users, error: userError } = await supabase
            .from('socios')
            .select('*')
            .eq('email', MOCK_USER_EMAIL);

        if (userError) throw userError;
        clientData.user = users[0];

        // Fetch classes
        const { data: classes, error: classError } = await supabase
            .from('clases')
            .select('*');

        if (classError) throw classError;
        clientData.classes = classes;

        // Fetch User Reservations (Future and Recent)
        const { data: bookings, error: bookingsError } = await supabase
            .from('reservas')
            .select('*, clases(*)')
            .eq('socio_id', clientData.user.id)
            .order('fecha', { ascending: true });

        if (bookingsError) throw bookingsError;
        clientData.bookings = bookings;

        // Fetch Waitlist status
        const { data: waitlist, error: waitlistError } = await supabase
            .from('lista_espera')
            .select('*, clases(*)')
            .eq('socio_id', clientData.user.id);

        clientData.waitlist = waitlist || [];

        console.log('Client data initialized:', clientData);

        updateProfileUI();
        updateMetricsUI();
        initCalendar(); // Initialize calendar dates
        renderBookingClasses();
        renderUserBookings();
    } catch (err) {
        console.error('Error initializing client:', err);
    }
}

let selectedDate = new Date().toISOString().split('T')[0];

function initCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;

    // Generate next 30 days
    let html = '';
    const today = new Date();

    for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const iso = d.toISOString().split('T')[0];
        const dayNum = d.getDate();
        const dayLabel = d.toLocaleDateString('es-ES', { weekday: 'short' }).substring(0, 2).toUpperCase();
        const isToday = i === 0;

        html += `
            <button class="day-btn ${isToday ? 'active' : ''}" data-date="${iso}" onclick="selectDate('${iso}', this)">
                <span class="day">${dayLabel}</span>
                <span class="date">${dayNum}</span>
            </button>
        `;
    }
    calendarDays.innerHTML = html;
}

window.selectDate = (date, btn) => {
    selectedDate = date;
    document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderBookingClasses();
};

function renderUserBookings() {
    const listContainer = document.getElementById('my-bookings-list');
    const nextContainer = document.getElementById('next-booking-container');
    if (!listContainer || !nextContainer) return;

    if (clientData.bookings.length === 0 && clientData.waitlist.length === 0) {
        listContainer.innerHTML = '<p class="text-sm text-muted p-md">Aún no tienes reservas activas.</p>';
        nextContainer.innerHTML = `
            <div class="next-class">
                <p class="label">Próxima Clase</p>
                <h3 class="value">Sin agendamiento</h3>
                <p class="subtitle">¡Reserva tu primera clase hoy!</p>
            </div>
        `;
        return;
    }

    // Format for sorting
    const allEvents = [
        ...clientData.bookings.map(b => ({ ...b, type: 'RES' })),
        ...clientData.waitlist.map(w => ({ ...w, type: 'WAIT' }))
    ].sort((a, b) => a.fecha.localeCompare(b.fecha));

    // Update Next Booking Card
    const next = allEvents[0];
    const dateObj = new Date(next.fecha + 'T00:00:00');
    const dateString = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });

    nextContainer.innerHTML = `
        <div class="next-class">
            <p class="label">${next.type === 'WAIT' ? 'En Lista de Espera' : 'Próxima Clase'}</p>
            <h3 class="value">${dateString} • ${next.clases.horario.substring(0, 5)}</h3>
            <p class="subtitle">${next.clases.nombre} - Prof. ${next.clases.instructor}</p>
        </div>
        <div class="class-countdown">
            ${next.type === 'WAIT' ? '⌛' : '✅'}
        </div>
    `;

    // Render List
    listContainer.innerHTML = allEvents.map(b => {
        const bDate = new Date(b.fecha + 'T00:00:00');
        const bDateStr = bDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long' });
        return `
            <div class="card p-md flex justify-between items-center ${b.type === 'WAIT' ? 'border-warning' : ''}">
                <div>
                    <p class="font-600">${b.clases.nombre}</p>
                    <p class="text-xs text-muted">${bDateStr} • ${b.clases.horario.substring(0, 5)}</p>
                </div>
                <span class="badge ${b.type === 'WAIT' ? 'badge-warning' : 'badge-success'}">
                    ${b.type === 'WAIT' ? 'Espera' : 'Confirmada'}
                </span>
            </div>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initBooking();
    initPayments();
    initClient();
    simulateLoading();
});

function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-view');

            if (targetId) {
                e.preventDefault();

                // Update active button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update active view
                views.forEach(v => v.classList.remove('active'));
                const targetView = document.getElementById(targetId);
                if (targetView) {
                    targetView.classList.add('active');
                    targetView.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                // Update header title based on view
                const labelElement = btn.querySelector('span');
                const title = labelElement ? labelElement.textContent : 'Detalle';
                document.querySelector('.app-title').textContent =
                    title === 'Inicio' ? 'Tu Progreso' : title;
            }
        });
    });
}

function updateProfileUI() {
    if (!clientData.user) return;

    // Update Greeting
    const userName = document.getElementById('user-name');
    if (userName) userName.textContent = clientData.user.nombre.split(' ')[0];

    // Update Profile View
    const planName = document.getElementById('profile-plan-name');
    const clasesTotales = document.getElementById('profile-clases-totales');
    const clasesRestantes = document.getElementById('profile-clases-restantes');
    const statusBadge = document.getElementById('profile-status-badge');
    const vencimientoDate = document.getElementById('profile-vencimiento-date');

    if (planName) planName.textContent = clientData.user.plan;
    if (clasesTotales) clasesTotales.textContent = '8 Sesiones'; // Hardcoded for MVP or fetch from plan
    if (clasesRestantes) clasesRestantes.textContent = `${clientData.user.clases_restantes}`;

    if (statusBadge) {
        statusBadge.textContent = clientData.user.estado;
        statusBadge.className = 'badge-premium';
    }

    if (vencimientoDate) {
        const date = new Date(clientData.user.fecha_vencimiento);
        vencimientoDate.textContent = date.toLocaleDateString('es-CL', { day: '2-digit', month: 'long' });
    }

    // Show Eval button only for Gym plans
    const evalBtn = document.getElementById('gym-eval-btn');
    if (evalBtn && clientData.user.plan && clientData.user.plan.toLowerCase().includes('entrenamiento')) {
        evalBtn.style.display = 'block';
    }

    // Update Home Summary
    const membershipDay = document.querySelector('.stats-grid .card:last-child h4');
    if (membershipDay) {
        const days = Math.ceil((new Date(clientData.user.fecha_vencimiento) - new Date()) / (1000 * 60 * 60 * 24));
        membershipDay.textContent = `${days} días`;
    }
}

function updateMetricsUI() {
    if (!clientData.user) return;

    // Home Summary
    const homePeso = document.getElementById('home-peso');
    const homeGrasa = document.getElementById('home-grasa');
    if (homePeso) homePeso.textContent = `${clientData.user.peso || '--'} kg`;
    if (homeGrasa) homeGrasa.textContent = `${clientData.user.porcentaje_grasa || '--'} %`;

    // Detail View
    const progPeso = document.getElementById('prog-peso');
    const progEstatura = document.getElementById('prog-estatura');
    const progGrasa = document.getElementById('prog-grasa');
    const progMusculo = document.getElementById('prog-musculo');
    const barGrasa = document.getElementById('bar-grasa');
    const barMusculo = document.getElementById('bar-musculo');

    if (progPeso) progPeso.textContent = `${clientData.user.peso || '--'} kg`;
    if (progEstatura) progEstatura.textContent = `${clientData.user.estatura || '--'} cm`;
    if (progGrasa) progGrasa.textContent = `${clientData.user.porcentaje_grasa || '--'}%`;
    if (progMusculo) progMusculo.textContent = `${clientData.user.porcentaje_musculo || '--'}%`;

    if (barGrasa) barGrasa.style.width = `${clientData.user.porcentaje_grasa || 0}%`;
    if (barMusculo) barMusculo.style.width = `${clientData.user.porcentaje_musculo || 0}%`;
}

function renderBookingClasses() {
    const container = document.getElementById('booking-classes-container');
    if (!container) return;

    if (clientData.classes.length === 0) {
        container.innerHTML = '<p class="text-center p-lg">No hay clases disponibles en este momento.</p>';
        return;
    }

    // Group by Date
    // Note: In real app, we'd fetch classes for specific day. 
    // For demo, we vary availability based on the day.
    const daySeed = new Date(selectedDate).getDate();

    const pilatesClasses = clientData.classes.filter(c => c.tipo === 'pilates');
    const gymClasses = clientData.classes.filter(c => c.tipo === 'entrenamiento');

    let html = `
        <div class="mb-md p-md glass-card" style="border-left: 4px solid var(--primary-500)">
            <p class="text-xs font-700 uppercase opacity-60">Horarios para el</p>
            <h3 class="text-lg font-700">${new Date(selectedDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
        </div>
    `;

    if (pilatesClasses.length > 0) {
        html += '<h4 class="text-sm font-700 uppercase opacity-50 mb-sm">Clases de Pilates (Cupo 10)</h4>';
        html += pilatesClasses.map(c => {
            const isFull = c.cupos_ocupados >= 10; // Cap at 10 as requested
            const isBooked = clientData.bookings.some(b => b.clase_id === c.id);
            const isWaitlisted = clientData.waitlist.some(w => w.clase_id === c.id);

            return `
                <div class="class-card-item card flex justify-between items-center ${isFull && !isWaitlisted && !isBooked ? 'border-warning' : ''}">
                    <div>
                        <p class="time">${c.horario.substring(0, 5)}</p>
                        <p class="type">${c.nombre}</p>
                        <p class="instructor text-muted text-sm">Prof. ${c.instructor} • ${c.cupos_ocupados}/10</p>
                    </div>
                    ${isBooked
                    ? '<span class="text-success font-700 text-sm">✓ Agendada</span>'
                    : isWaitlisted
                        ? '<span class="text-warning font-700 text-sm">⌛ En Espera</span>'
                        : isFull
                            ? `<button class="btn btn-secondary btn-sm" onclick="handleWaitlist('${c.id}', '${c.nombre}')">Lista de Espera</button>`
                            : `<button class="btn btn-primary btn-sm" onclick="handleBooking('${c.id}', '${c.nombre}', '${c.horario}')">Reservar</button>`
                }
                </div>
            `;
        }).join('');
    }

    if (gymClasses.length > 0) {
        html += '<h4 class="text-sm font-700 uppercase opacity-50 mt-lg mb-sm">Entrenamiento (Con Planilla)</h4>';
        html += gymClasses.map(c => {
            const isBooked = clientData.bookings.some(b => b.clase_id === c.id);
            return `
                <div class="class-card-item card flex justify-between items-center bg-zinc-900/30">
                    <div>
                        <p class="time">${c.horario.substring(0, 5)}</p>
                        <p class="type">${c.nombre}</p>
                        <p class="instructor text-muted text-sm">Acceso libre con planilla de entrenamiento</p>
                    </div>
                    ${isBooked
                    ? '<span class="text-success font-700 text-sm">✓ Confirmado</span>'
                    : `<button class="btn btn-primary btn-sm" onclick="handleBooking('${c.id}', '${c.nombre}', '${c.horario}')">Ingresar</button>`
                }
                </div>
            `;
        }).join('');
    }

    container.innerHTML = html;
}

async function handleBooking(classId, className, classTime) {
    if (!clientData.user) {
        showNotification('Error: Usuario no identificado', 'error');
        return;
    }

    if (clientData.user.clases_restantes <= 0) {
        showNotification('No tienes clases disponibles. Por favor renueva tu plan.', 'error');
        return;
    }

    const classObj = clientData.classes.find(c => c.id === classId);
    const dateStr = new Date().toISOString().split('T')[0]; // Simplify for demo to today

    if (confirm(`¿Confirmas tu reserva para ${className} a las ${classTime.substring(0, 5)}?`)) {
        try {
            // 1. Create reservation
            const { error: resError } = await supabase
                .from('reservas')
                .insert([{
                    socio_id: clientData.user.id,
                    clase_id: classId,
                    fecha: dateStr
                }]);

            if (resError) throw resError;

            // 2. Update user's remaining classes (only for Pilates)
            if (classObj.tipo === 'pilates') {
                const { error: userUpdateError } = await supabase
                    .from('socios')
                    .update({ clases_restantes: clientData.user.clases_restantes - 1 })
                    .eq('id', clientData.user.id);
                if (userUpdateError) throw userUpdateError;
            }

            // 3. Update class occupancy
            const { error: classUpdateError } = await supabase
                .from('clases')
                .update({ cupos_ocupados: classObj.cupos_ocupados + 1 })
                .eq('id', classId);

            if (classUpdateError) throw classUpdateError;

            showNotification('¡Reserva realizada con éxito! ✅');
            initClient();
        } catch (err) {
            console.error('Error in handling booking:', err);
            showNotification('Error al realizar la reserva', 'error');
        }
    }
}

async function handleWaitlist(classId, className) {
    if (confirm(`La clase de ${className} está llena. ¿Deseas unirte a la lista de espera?`)) {
        try {
            const { error: waitError } = await supabase
                .from('lista_espera')
                .insert([{
                    socio_id: clientData.user.id,
                    clase_id: classId,
                    fecha: new Date().toISOString().split('T')[0]
                }]);

            if (waitError) throw waitError;

            showNotification('Te has unido a la lista de espera ⌛');
            initClient();
        } catch (err) {
            console.error('Error joining waitlist:', err);
            showNotification('Error al unirse a la lista de espera', 'error');
        }
    }
}

// Global scope exposures
window.handleWaitlist = handleWaitlist;
window.handleBooking = handleBooking;


function initBooking() {
    const dayButtons = document.querySelectorAll('.day-btn');
    dayButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            dayButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function showNotification(text, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        z-index: 1000;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease-out;
    `;
    toast.textContent = text;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease-in forwards';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function initPayments() {
    const renewBtn = document.getElementById('renew-btn');
    if (renewBtn) {
        renewBtn.addEventListener('click', () => {
            showTuuCheckout();
        });
    }
}

function showTuuCheckout() {
    // Create mock modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.95);
        z-index: 2000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.3s;
    `;

    modal.innerHTML = `
        <div class="glass-card p-xl flex flex-col items-center w-full" style="max-width: 400px; border-top: 4px solid #06B6D4">
            <h2 class="text-primary mb-md">TUU Checkout</h2>
            <p class="mb-lg text-center">Plan Premium - Pilates Reformer<br><strong>$65.000 CLP</strong></p>
            
            <div class="w-full mb-lg grid gap-sm">
                <button class="btn btn-secondary w-full justify-between">
                    <span>Tarjeta de Crédito</span>
                    <span>💳</span>
                </button>
                <button class="btn btn-secondary w-full justify-between">
                    <span>RedCompra / Débito</span>
                    <span>🏧</span>
                </button>
            </div>
            
            <div class="flex gap-md w-full">
                <button id="cancel-pay" class="btn btn-secondary flex-1">Cancelar</button>
                <button id="confirm-pay" class="btn btn-primary flex-1">Pagar Ahora</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('cancel-pay').onclick = () => modal.remove();
    document.getElementById('confirm-pay').onclick = () => {
        const btn = document.getElementById('confirm-pay');
        btn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px"></div>';

        setTimeout(() => {
            modal.innerHTML = `
                <div class="glass-card p-xl flex flex-col items-center w-full text-center" style="max-width: 400px">
                    <div style="font-size: 50px; margin-bottom: 20px">✅</div>
                    <h2 class="text-success mb-md">¡Pago Exitoso!</h2>
                    <p class="mb-lg">Tu membresía ha sido renovada hasta el 05 de Abril, 2024.</p>
                    <button id="close-success" class="btn btn-primary w-full">Volver a la App</button>
                </div>
            `;
            document.getElementById('close-success').onclick = () => modal.remove();
            showNotification('Membresía renovada con éxito');
        }, 1500);
    };
}

function handleLogout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        window.location.href = '../index.html';
    }
}

function downloadPlanilla() {
    showNotification('Generando planilla de entrenamiento...', 'info');
    setTimeout(() => {
        showNotification('Planilla descargada con éxito 📥');
    }, 1500);
}

// Global scope exposures
window.handleWaitlist = handleWaitlist;
window.handleBooking = handleBooking;
window.handleLogout = handleLogout;
window.downloadPlanilla = downloadPlanilla;
window.showNotification = showNotification;
