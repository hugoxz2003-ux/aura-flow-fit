// Client PWA Logic
const AUTH_KEY = 'aura_client_auth';

let clientData = {
    user: null,
    classes: [],
    bookings: [],
    waitlist: [],
    notifications: []
};

const DEMO_CLASSES = [
    { id: 'c1', nombre: 'Pilates Reformer', instructor: 'María González', horario: '09:00:00', tipo: 'pilates', cupos_ocupados: 7, cupos_max: 10 },
    { id: 'c2', nombre: 'Pilates Reformer', instructor: 'María González', horario: '11:00:00', tipo: 'pilates', cupos_ocupados: 4, cupos_max: 10 },
    { id: 'c3', nombre: 'Pilates Reformer', instructor: 'María González', horario: '18:00:00', tipo: 'pilates', cupos_ocupados: 10, cupos_max: 10 },
    { id: 'c4', nombre: 'Entrenamiento Funcional', instructor: 'Carlos Ruiz', horario: '08:00:00', tipo: 'gym', cupos_ocupados: 12, cupos_max: 50 },
    { id: 'c5', nombre: 'Pilates Full Body', instructor: 'Valeria Paz', horario: '19:00:00', tipo: 'pilates', cupos_ocupados: 2, cupos_max: 10 }
];

const DEMO_USER = {
    id: 'u1', nombre: 'Ana García', email: 'ana@example.com', plan: 'Pilates 2x Semanal', estado: 'Activo', clases_restantes: 18, fecha_vencimiento: '2026-04-30', peso: 62.5, porcentaje_grasa: 22.4, estatura: 165, porcentaje_musculo: 38.2
};

async function initClient() {
    const sessionStr = localStorage.getItem(AUTH_KEY);
    if (!sessionStr) {
        window.location.href = 'login.html';
        return;
    }

    // Show loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'app-loading-overlay';
    loadingOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:#18181B; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:9999;';
    loadingOverlay.innerHTML = `
        <div class="flex flex-col items-center gap-lg">
            <div class="spinner" style="width:40px; height:40px; border-width:4px;"></div>
            <p style="color:var(--primary); font-weight:700; letter-spacing:2px; font-size:12px; margin-top:20px;">INICIANDO AURA FLOW...</p>
        </div>
    `;
    document.body.appendChild(loadingOverlay);

    const session = JSON.parse(sessionStr);
    const userEmail = session.email;

    try {
        // Fetch user data
        const { data: users, error: userError } = await supabase
            .from('socios')
            .select('*')
            .eq('email', userEmail);

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

        // Fetch Notifications
        const { data: notifications, error: notifError } = await supabase
            .from('notificaciones')
            .select('*')
            .order('id', { ascending: false });
        
        clientData.notifications = (notifications || []).filter(n => n.tipo === 'global');

        console.log('Client data initialized:', clientData);

    } catch (err) {
        console.error('Error initializing client:', err);
        console.warn('Supabase no responde. Cargando DEMO DATA local...');
        clientData.user = userEmail === 'ana@example.com' ? DEMO_USER : { ...DEMO_USER, nombre: session.email, email: session.email };
        clientData.classes = JSON.parse(JSON.stringify(DEMO_CLASSES));
        clientData.bookings = JSON.parse(localStorage.getItem('demo_bookings') || '[]');
        clientData.waitlist = JSON.parse(localStorage.getItem('demo_waitlist') || '[]');
    } finally {
        updateProfileUI();
        updateMetricsUI();
        initCalendar(); 
        renderBookingClasses();
        renderUserBookings();
        renderNotifications();
        
        // Remove loading overlay
        setTimeout(() => {
            const overlay = document.getElementById('app-loading-overlay');
            if (overlay) overlay.remove();
        }, 300);
    }
}

let selectedDate = new Date().toISOString().split('T')[0];

function initCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;

    // Generate next 10 days (as requested)
    let html = '';
    const today = new Date();

    // Group by month to show title
    const monthName = today.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const monthHeader = document.getElementById('calendar-month-header');
    if (monthHeader) monthHeader.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    for (let i = 0; i < 10; i++) {
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
        const estado = b.estado || (b.type === 'WAIT' ? 'En Espera' : 'Confirmada');
        const badgeClass = estado === 'Asistió' ? 'badge-success' : (estado === 'En Espera' ? 'badge-warning' : 'badge-primary');
        
        return `
            <div class="card p-md flex justify-between items-center ${b.type === 'WAIT' ? 'border-warning' : ''}">
                <div>
                    <p class="font-600">${b.clases.nombre}</p>
                    <p class="text-xs text-muted">${bDateStr} • ${b.clases.horario.substring(0, 5)}</p>
                </div>
                <span class="badge ${badgeClass}">${estado}</span>
            </div>
        `;
    }).join('');
}

function renderNotifications() {
    const list = document.getElementById('notif-list');
    const badge = document.getElementById('notif-badge');
    if(!list) return;

    if(clientData.notifications.length === 0) {
        list.innerHTML = '<p class="text-muted text-center p-xl">No hay mensajes nuevos</p>';
        if(badge) badge.style.display = 'none';
        return;
    }

    if(badge) badge.style.display = 'block';
    list.innerHTML = clientData.notifications.map(n => `
        <div class="card p-lg border-primary-20">
            <p class="text-xs font-700 text-primary uppercase mb-xs">${n.titulo}</p>
            <p class="text-sm opacity-90">${n.mensaje}</p>
        </div>
    `).join('');
}


document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initBooking();
    initPayments();
    initClient();
    
    // Auto-refresh data every 30s
    setInterval(initClient, 30000);
});


function initNavigation() {
    const clickable = document.querySelectorAll('[data-view]');
    const views = document.querySelectorAll('.view');

    clickable.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-view');
            if (targetId) {
                e.preventDefault();
                views.forEach(v => v.classList.remove('active'));
                const targetView = document.getElementById(targetId);
                if (targetView) targetView.classList.add('active');
                
                // Active class for nav buttons
                clickable.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });
}



function updateProfileUI() {
    if (!clientData.user) return;

    // Update Greeting
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) userNameEl.textContent = clientData.user.nombre.split(' ')[0];

    // Home Summary (New Cards)
    const creditsEl = document.getElementById('user-credits');
    const planLabelEl = document.getElementById('user-plan-label');
    const daysRemainingEl = document.getElementById('days-remaining');
    const expiryDateEl = document.getElementById('expiry-date');

    if (creditsEl) creditsEl.textContent = clientData.user.clases_restantes ?? '--';
    if (planLabelEl) planLabelEl.textContent = `Plan ${clientData.user.plan || 'No asignado'}`;

    if (daysRemainingEl && clientData.user.fecha_vencimiento) {
        const diff = new Date(clientData.user.fecha_vencimiento) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        daysRemainingEl.textContent = `${days > 0 ? days : 0} días`;
        
        if (expiryDateEl) {
            const date = new Date(clientData.user.fecha_vencimiento);
            expiryDateEl.textContent = `Vence ${date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}`;
        }
    }

    // Update Profile View (Detailed)
    const planName = document.getElementById('profile-plan-name');
    const clasesRestantes = document.getElementById('profile-clases-restantes');
    const statusBadge = document.getElementById('profile-status-badge');
    const vencimientoDate = document.getElementById('profile-vencimiento-date');

    if (planName) planName.textContent = clientData.user.plan || 'Socio Activo';
    if (clasesRestantes) clasesRestantes.textContent = `${clientData.user.clases_restantes ?? 0}`;

    if (statusBadge) {
        statusBadge.textContent = clientData.user.estado || 'Activo';
        statusBadge.className = 'badge-premium';
    }

    if (vencimientoDate && clientData.user.fecha_vencimiento) {
        const date = new Date(clientData.user.fecha_vencimiento);
        vencimientoDate.textContent = date.toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });
    }

    // Nav Calendar Handlers
    const prevBtn = document.getElementById('prev-day');
    const nextBtn = document.getElementById('next-day');
    const daysContainer = document.getElementById('calendar-days');

    if (prevBtn && daysContainer) {
        prevBtn.onclick = () => {
            daysContainer.scrollBy({ left: -100, behavior: 'smooth' });
        };
    }
    if (nextBtn && daysContainer) {
        nextBtn.onclick = () => {
            daysContainer.scrollBy({ left: 100, behavior: 'smooth' });
        };
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

    // Map ISO date to Day Name in Spanish to filter classes
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const selectedDayName = dayNames[new Date(selectedDate + 'T00:00:00').getDay()];

    const userPlan = (clientData.user.plan || "").toLowerCase();
    const isPilatesUser = userPlan.includes('pilates');
    const isGymUser = userPlan.includes('gimnasio') || userPlan.includes('gym');
    const isSpecialUser = !isPilatesUser && !isGymUser; // Admin/Staff or generic plan

    const pilatesClasses = clientData.classes.filter(c => c.tipo === 'pilates' && c.dia === selectedDayName);
    const gymClasses = clientData.classes.filter(c => (c.tipo === 'gym' || c.tipo === 'entrenamiento') && c.dia === selectedDayName);

    let html = `
        <div class="mb-md p-md glass-card" style="border-left: 4px solid var(--primary-500)">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-xs font-700 uppercase opacity-60">Horarios para el ${selectedDayName}</p>
                    <h3 class="text-lg font-700">${new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                </div>
                <div class="badge-premium" style="background:#22C55E22; color:#22C55E; font-size:9px;">
                    Plan: ${clientData.user.plan}
                </div>
            </div>
        </div>
    `;

    // Filtered Rendering
    if (isPilatesUser || isSpecialUser) {
        if (pilatesClasses.length > 0) {
            html += '<h4 class="text-sm font-700 uppercase opacity-50 mb-sm">Clases de Pilates (Cupo 10)</h4>';
            html += pilatesClasses.map(c => {
                const isFull = c.cupos_ocupados >= 10;
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
    }

    if (isGymUser || isSpecialUser) {
        if (gymClasses.length > 0) {
            html += '<h4 class="text-sm font-700 uppercase opacity-50 mt-lg mb-sm">Entrenamiento (Gimnasio)</h4>';
            html += gymClasses.map(c => {
                const isBooked = clientData.bookings.some(b => b.clase_id === c.id);
                return `
                    <div class="class-card-item card flex justify-between items-center bg-zinc-900/30">
                        <div>
                            <p class="time">${c.horario.substring(0, 5)}</p>
                            <p class="type">${c.nombre}</p>
                            <p class="instructor text-muted text-sm">Acceso libre por hora</p>
                        </div>
                        ${isBooked
                        ? '<span class="text-success font-700 text-sm">✓ Confirmado</span>'
                        : `<button class="btn btn-primary btn-sm" onclick="handleBooking('${c.id}', '${c.nombre}', '${c.horario}')">Ingresar</button>`
                    }
                    </div>
                `;
            }).join('');
        }
    }

    // Edge case: User has a plan but there are no classes for that plan today
    const visiblePilates = (isPilatesUser || isSpecialUser) && pilatesClasses.length > 0;
    const visibleGym = (isGymUser || isSpecialUser) && gymClasses.length > 0;

    if (!visiblePilates && !visibleGym) {
        html += `
            <div class="p-xl text-center">
                <p class="text-muted mb-md">No hay sesiones de ${isPilatesUser ? 'Pilates' : 'Gimnasio'} disponibles para el ${selectedDayName}.</p>
                <div class="badge-premium" style="display:inline-block; opacity:0.5;">Verifica otros días en el calendario superior</div>
            </div>
        `;
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
    const dateStr = selectedDate; 

    // Plan Enforcement
    const userPlan = (clientData.user.plan || "").toLowerCase();
    if (classObj.tipo === 'pilates' && !userPlan.includes('pilates')) {
        showNotification('Tu plan no permite agendar clases de Pilates.', 'error');
        return;
    }
    if ((classObj.tipo === 'gym' || classObj.tipo === 'entrenamiento') && !userPlan.includes('gimnasio') && !userPlan.includes('gym')) {
        showNotification('Tu plan no permite el acceso al Gimnasio.', 'error');
        return;
    }

    // Bypass confirm for automated testing
    if (confirm(`¿Confirmas tu reserva para ${className} el ${new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} a las ${classTime.substring(0, 5)}?`)) {
        try {
            console.log('Attempting booking for:', { classId, className, dateStr, user: clientData.user });
            
            if (!clientData.user || !clientData.user.id) {
                throw new Error('Usuario no autenticado o ID faltante');
            }

            const currentCredits = parseInt(clientData.user.clases_restantes) || 0;

            // 1. Create reservation
            const { error: resError } = await supabase
                .from('reservas')
                .insert([{
                    socio_id: clientData.user.id,
                    clase_id: classId,
                    fecha: dateStr,
                    estado: 'Confirmada'
                }]);

            if (resError) {
                console.error('Supabase Reservation Error:', resError);
                throw resError;
            }

            // 2. Update user's remaining classes (only for Pilates)
            if (classObj && classObj.tipo === 'pilates') {
                console.log('Deducting class from pilates plan...');
                const { error: userUpdateError } = await supabase
                    .from('socios')
                    .update({ clases_restantes: Math.max(0, currentCredits - 1) })
                    .eq('id', clientData.user.id);
                
                if (userUpdateError) {
                    console.error('Supabase User Update Error:', userUpdateError);
                    // We don't throw here to avoid failing a successful reservation if just the credit update fails
                } else {
                    clientData.user.clases_restantes = Math.max(0, currentCredits - 1);
                }
            }

            // 3. Update class occupancy
            console.log('Increasing class occupancy...');
            const { error: classUpdateError } = await supabase
                .from('clases')
                .update({ cupos_ocupados: (classObj.cupos_ocupados || 0) + 1 })
                .eq('id', classId);

            if (classUpdateError) {
                console.error('Supabase Class Update Error:', classUpdateError);
            } else {
                classObj.cupos_ocupados = (classObj.cupos_ocupados || 0) + 1;
            }

            console.log('Booking successful!');
            showNotification('¡Reserva realizada con éxito! ✅');
            
            // Refresh local UI
            setTimeout(() => initClient(), 1000);
        } catch (err) {
            console.error('Error in handling booking:', err);
            // FALLBACK OFFLINE
            const newBooking = {
                id: 'b' + Date.now(),
                socio_id: clientData.user.id,
                clase_id: classId,
                fecha: dateStr,
                clases: classObj
            };
            
            clientData.bookings.push(newBooking);
            localStorage.setItem('demo_bookings', JSON.stringify(clientData.bookings));
            
            if (classObj.tipo === 'pilates') clientData.user.clases_restantes -= 1;
            classObj.cupos_ocupados += 1;
            
            showNotification('¡Reserva realizada con éxito (Modo Local)! ✅');
            renderBookingClasses();
            renderUserBookings();
            updateProfileUI();
        }
    }
}

async function handleWaitlist(classId, className) {
    // Bypass confirm for automated testing
    if (confirm(`La clase de ${className} está llena. ¿Deseas unirte a la lista de espera?`)) {
        try {
            const { error: waitError } = await supabase
                .from('lista_espera')
                .insert([{
                    socio_id: clientData.user.id,
                    clase_id: classId,
                    fecha: selectedDate
                }]);

            if (waitError) throw waitError;

            showNotification('Te has unido a la lista de espera ⌛');
            initClient();
        } catch (err) {
            console.error('Error joining waitlist:', err);
            // FALLBACK OFFLINE
            const newWait = {
                id: 'w' + Date.now(),
                socio_id: clientData.user.id,
                clase_id: classId,
                fecha: selectedDate,
                clases: clientData.classes.find(c => c.id === classId)
            };
            clientData.waitlist.push(newWait);
            localStorage.setItem('demo_waitlist', JSON.stringify(clientData.waitlist));
            showNotification('Te has unido a la lista de espera (Modo Local) ⌛');
            renderBookingClasses();
            renderUserBookings();
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
        localStorage.removeItem(AUTH_KEY);
        window.location.href = 'login.html';
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


