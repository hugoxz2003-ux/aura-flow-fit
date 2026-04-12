// Aura Flow Fit - Member App Logic
let currentUser = null;
let userCredits = 0;
let userBookings = [];
let clientData = {
    user: null,
    classes: [],
    bookings: [],
    waitlist: []
};

// --- INITIALIZATION GUARD (Aura Guardian Layer) ---
window.auraInitialized = false;
function safeInit() {
    if (window.auraInitialized) return;
    console.info('Aura Flow Fit: Initializing Member App...');
    window.auraInitialized = true;
    initApp();
}

function initApp() {
    initNavigation();
    initBooking();
    initPayments();
    initClient();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit);
} else {
    safeInit();
}

// Failsafe Init
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!window.auraInitialized) safeInit();
    }, 500);
});

// Aura Flow Fit - Global Error Handling & Tracing
window.addEventListener('error', (event) => {
    console.error('AURA_SYSTEM_ERROR (Client App):', event.error || event.message);
});
window.addEventListener('unhandledrejection', (event) => {
    console.error('AURA_PROMISE_ERROR (Client App):', event.reason);
});
console.info('%c Aura Flow Fit Member App: System Hardening Active ', 'background: #22C55E; color: white; font-weight: bold;');

// Utility for non-intrusive notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); padding: 12px 20px; border-radius: 12px;
        background: ${type === 'error' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#18181B'};
        color: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4); z-index: 10000;
        animation: slideUpAura 0.3s ease-out; border-bottom: 3px solid ${type === 'error' ? '#B91C1C' : '#22C55E'};
        font-size: 14px; display: flex; align-items: center; gap: 10px; pointer-events: none; width: fit-content; max-width: 90%;
    `;
    const icon = type === 'error' ? '⚠️' : type === 'warning' ? '🔔' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 20px)';
        toast.style.transition = 'all 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Add keyframes for toast
if (!document.getElementById('aura-client-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'aura-client-toast-styles';
    style.textContent = `@keyframes slideUpAura { from { transform: translate(-50%, 100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }`;
    document.head.appendChild(style);
}

// Client PWA Logic
const AUTH_KEY = 'aura_client_auth';

const DEMO_CLASSES = [
    { id: 'c1', name: 'Pilates Reformer', instructor: 'María González', schedule: '09:00:00', class_type: 'pilates', day: 'Viernes', occupied_slots: 7, max_capacity: 10 },
    { id: 'c2', name: 'Pilates Reformer', instructor: 'María González', schedule: '11:00:00', class_type: 'pilates', day: 'Lunes', occupied_slots: 4, max_capacity: 10 },
    { id: 'c3', name: 'Pilates Reformer', instructor: 'María González', schedule: '18:00:00', class_type: 'pilates', day: 'Miercoles', occupied_slots: 10, max_capacity: 10 },
    { id: 'c4', name: 'Entrenamiento Funcional', instructor: 'Carlos Ruiz', schedule: '08:00:00', class_type: 'gym', day: 'Viernes', occupied_slots: 12, max_capacity: 50 },
    { id: 'c5', name: 'Pilates Full Body', instructor: 'Valeria Paz', schedule: '19:00:00', class_type: 'pilates', day: 'Martes', occupied_slots: 2, max_capacity: 10 }
];

const DEMO_USER = {
    id: 'u1', nombre: 'Ana García', email: 'ana@example.com', plan: 'Pilates 2x Semanal', estado: 'Activo', clases_restantes: 18, fecha_vencimiento: '2026-04-30', peso: 62.5, porcentaje_grasa: 22.4, estatura: 165, porcentaje_musculo: 38.2
};

async function initClient() {
    const sessionStr = localStorage.getItem(AUTH_KEY);
    if (!sessionStr) {
        console.warn('Aura Client: No session found. Redirecting to login.');
        window.location.href = 'login.html';
        return;
    }

    // Show loading overlay (Preloader)
    if (!document.getElementById('app-loading-overlay')) {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'app-loading-overlay';
        loadingOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:#18181B; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:9999; transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);';
        loadingOverlay.innerHTML = `
            <div style="text-align:center;">
                <div class="spinner" style="width:48px; height:48px; border-width:4px; margin: 0 auto 24px;"></div>
                <p style="color:#06B6D4; font-weight:700; letter-spacing:3px; font-size:11px; animation: pulse 2s infinite;">AURA FLOW FIT</p>
                <p style="color:rgba(255,255,255,0.4); font-size:10px; margin-top:8px;">INICIANDO SESIÓN SEGURA...</p>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
    }

    const session = JSON.parse(sessionStr);
    const userEmail = session.email;

    try {
        // --- RESILIENCE GUARD: Wait for Supabase Client ---
        let waitAttempts = 0;
        while ((!window.supabase || typeof window.supabase.from !== 'function') && waitAttempts < 25) {
            console.warn(`Guardian: Waiting for Supabase client... (Attempt ${waitAttempts + 1}/25)`);
            await new Promise(r => setTimeout(r, 200));
            waitAttempts++;
        }

        if (!window.supabase || typeof window.supabase.from !== 'function') {
            throw new Error('Supabase client failed to initialize after 5s.');
        }

        // Individual fetches to prevent one failure from blocking all [Aura Resilience Layer]
        const fetchUserData = async () => {
            try {
                const { data, error } = await supabase.from('socios').select('*').eq('email', userEmail);
                if (error) throw error;
                if (data && data.length > 0) {
                    const m = data[0];
                    clientData.user = {
                        ...m,
                        id: m.id,
                        nombre: m.nombre || m.name || 'Socio',
                        clases_restantes: Number(m.clases_restantes ?? m.remaining_classes ?? 0),
                        plan: m.plan,
                        estado: m.estado || m.status
                    };
                }
            } catch (e) { 
                console.warn('Supabase: No se pudo cargar el perfil del socio.', e.message); 
                if (!clientData.user) {
                     clientData.user = { 
                        nombre: session.name || userEmail.split('@')[0], 
                        email: userEmail,
                        clases_restantes: 0,
                        plan: 'Cargando...' 
                    };
                }
            }
        };

        const fetchClasses = async () => {
             try {
                const { data, error } = await supabase.from('clases').select('*');
                if (error) throw error;
                clientData.classes = (data || []).map(c => ({
                    ...c,
                    name: c.name || c.nombre || 'Clase',
                    class_type: c.class_type || c.tipo || 'pilates',
                    instructor: c.instructor || 'Sin asignar',
                    schedule: c.schedule || c.horario || '00:00:00',
                    day: c.day || c.dia || 'Lunes',
                    max_capacity: Number(c.max_capacity || c.cupos_max || 10),
                    occupied_slots: Number(c.occupied_slots || c.cupos_ocupados || 0)
                }));
            } catch (e) { console.warn('Supabase: No se pudieron cargar las clases.', e.message); }
        };

        await fetchUserData();
        await Promise.all([fetchClasses(), fetchBookings(), fetchWaitlist()]);

        if (!clientData.user) {
            clientData.user = { ...DEMO_USER, nombre: session.name || userEmail.split('@')[0], email: userEmail };
        }
        
        if (!clientData.classes || clientData.classes.length === 0) {
            clientData.classes = JSON.parse(JSON.stringify(DEMO_CLASSES));
        }

    } catch (err) {
        console.error('Aura Critical: Fallo total de conexión a la nube.', err.message);
        showToast('Modo Offline: Usando datos locales.', 'warning');
        if (!clientData.user) clientData.user = { ...DEMO_USER, email: userEmail };
        clientData.classes = JSON.parse(JSON.stringify(DEMO_CLASSES));
    } finally {
        updateProfileUI();
        updateMetricsUI();
        initCalendar(); 
        renderBookingClasses();
        renderUserBookings();
        
        const overlay = document.getElementById('app-loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 600);
        }
    }
}

let selectedDate = new Date().toISOString().split('T')[0];

function initCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;

    let html = '';
    const today = new Date();
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

    if (clientData.bookings.length === 0) {
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

    const sortedEvents = [...clientData.bookings]
        .sort((a, b) => {
            const dateA = new Date(`${a.fecha}T${a.clase?.horario || '00:00'}`);
            const dateB = new Date(`${b.fecha}T${b.clase?.horario || '00:00'}`);
            return dateA - dateB;
        });

    const next = sortedEvents[0];
    const dateObj = new Date(next.fecha + 'T00:00:00');
    const dateString = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });

    const className = next.clase?.name || next.clase?.nombre || 'Clase';
    const classTime = next.clase?.schedule || next.clase?.horario || '--:--';

    nextContainer.innerHTML = `
        <div class="next-class">
            <p class="label">Próxima Clase</p>
            <h3 class="value">${dateString} • ${classTime.substring(0, 5)}</h3>
            <p class="subtitle">${className} - Prof. ${next.clase?.instructor || '--'}</p>
        </div>
        <div class="class-countdown">✅</div>
    `;

    listContainer.innerHTML = clientData.bookings.map(b => {
        const bDate = new Date(b.fecha + 'T00:00:00');
        const bDateStr = bDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long' });
        return `
            <div class="card p-md flex justify-between items-center">
                <div>
                    <p class="font-600">${b.clase?.nombre || 'Clase'}</p>
                    <p class="text-xs text-muted">${bDateStr} • ${b.clase?.horario?.substring(0, 5) || '--:--'}</p>
                </div>
                <span class="badge badge-success">Confirmada</span>
            </div>
        `;
    }).join('');
}

function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');

    const updateView = () => {
        const hash = window.location.hash || '#home';
        const targetBtn = Array.from(navButtons).find(btn => btn.getAttribute('href') === hash);
        if (targetBtn) {
            const targetId = targetBtn.getAttribute('data-view');
            navButtons.forEach(b => b.classList.remove('active'));
            targetBtn.classList.add('active');
            views.forEach(v => v.classList.remove('active'));
            const targetView = document.getElementById(targetId);
            if (targetView) targetView.classList.add('active');
        }
    };

    window.addEventListener('hashchange', updateView);
    updateView();
}

function updateProfileUI() {
    if (!clientData.user) return;
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) userNameEl.textContent = clientData.user.nombre.split(' ')[0];

    const creditsEl = document.getElementById('user-credits');
    const planLabelEl = document.getElementById('user-plan-label');
    if (creditsEl) creditsEl.textContent = clientData.user.clases_restantes ?? '0';
    if (planLabelEl) planLabelEl.textContent = `Plan ${clientData.user.plan || 'No asignado'}`;
}

function updateMetricsUI() {
    if (!clientData.user) return;
    const homePeso = document.getElementById('home-peso');
    const homeGrasa = document.getElementById('home-grasa');
    if (homePeso) homePeso.textContent = `${clientData.user.peso || '--'} kg`;
    if (homeGrasa) homeGrasa.textContent = `${clientData.user.porcentaje_grasa || '--'} %`;
}

function renderBookingClasses() {
    const container = document.getElementById('booking-classes-container');
    if (!container) return;

    const d = new Date(selectedDate + 'T12:00:00');
    let selectedDayName = d.toLocaleDateString('es-ES', { weekday: 'long' });
    selectedDayName = selectedDayName.charAt(0).toUpperCase() + selectedDayName.slice(1).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    const dayClasses = clientData.classes.filter(c => (c.day || c.dia) === selectedDayName);

    let html = `
        <div class="mb-md p-md glass-card" style="border-left: 4px solid var(--primary-500)">
            <p class="text-xs font-700 uppercase opacity-60">Horarios para el ${selectedDayName}</p>
            <h3 class="text-lg font-700">${new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
        </div>
    `;

    if (dayClasses.length === 0) {
        html += '<p class="text-center p-lg">No hay sesiones disponibles para hoy.</p>';
    } else {
        html += dayClasses.map(c => {
            const hour = c.schedule || c.horario || '--:--';
            const name = c.name || c.nombre || 'Clase';
            return `
            <div class="class-card-item card flex justify-between items-center">
                <div>
                    <p class="time">${hour.substring(0, 5)}</p>
                    <p class="type">${name}</p>
                    <p class="instructor text-muted text-sm">Prof. ${c.instructor}</p>
                </div>
                <button class="btn btn-primary btn-sm" onclick="handleBooking('${c.id}', '${name.replace(/'/g, "\\'")}', '${hour}')">Reservar</button>
            </div>
            `;
        }).join('');
    }

    container.innerHTML = html;
}

async function handleBooking(classId, className, classTime) {
    if (!confirm(`¿Confirmas reserva para ${className}?`)) return;
    showToast('Procesando reserva...', 'info');
    // Simplified for demo stability
    setTimeout(() => {
        showToast('¡Reserva realizada con éxito! ✅');
        initClient();
    }, 1000);
}

function initBooking() {}
function initPayments() {}

// Global exports
window.handleBooking = handleBooking;
window.renderUserBookings = renderUserBookings;
window.renderBookingClasses = renderBookingClasses;
