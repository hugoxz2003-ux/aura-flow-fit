// Dashboard JavaScript

// ==========================================
// DEMO FALLBACK DATA (used when Supabase is unreachable)
// ==========================================
const DEMO_MEMBERS = [
    { id: 1, nombre: 'Ana García', email: 'ana@example.com', plan: 'Pilates 2x Semanal', estado: 'Activo', clases_restantes: 8, fecha_vencimiento: '2026-04-30' },
    { id: 2, nombre: 'Laura Torres', email: 'laura@example.com', plan: 'Pilates 3x Semanal', estado: 'Activo', clases_restantes: 12, fecha_vencimiento: '2026-04-30' },
    { id: 3, nombre: 'Sofía Ramos', email: 'sofia@example.com', plan: 'Plan Gimnasio', estado: 'Activo', clases_restantes: 999, fecha_vencimiento: '2026-05-15' },
    { id: 4, nombre: 'Carlos Mendoza', email: 'carlos@example.com', plan: 'Pilates 1x Semanal', estado: 'Vencido', clases_restantes: 0, fecha_vencimiento: '2026-02-28' },
    { id: 5, nombre: 'María Soto', email: 'maria@example.com', plan: 'Pilates 4x Semanal', estado: 'Activo', clases_restantes: 16, fecha_vencimiento: '2026-04-15' }
];

const DEMO_CLASSES = [
    { id: 1, nombre: 'Pilates Reformer', instructor: 'María González', horario: '09:00:00', tipo: 'pilates', cupos_ocupados: 7, cupos_max: 8 },
    { id: 2, nombre: 'Pilates Reformer', instructor: 'María González', horario: '11:00:00', tipo: 'pilates', cupos_ocupados: 4, cupos_max: 8 },
    { id: 3, nombre: 'Pilates Reformer', instructor: 'María González', horario: '18:00:00', tipo: 'pilates', cupos_ocupados: 6, cupos_max: 8 },
    { id: 4, nombre: 'Entrenamiento Funcional', instructor: 'Carlos Ruiz', horario: '08:00:00', tipo: 'gym', cupos_ocupados: 12, cupos_max: 20 },
    { id: 5, nombre: 'Yoga Flow', instructor: 'Valeria Paz', horario: '10:00:00', tipo: 'grupal', cupos_ocupados: 8, cupos_max: 15 }
];

const DEMO_LEADS = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@prospecto.cl', phone: '+56912345678', source: 'Instagram', status: 'Nuevo' },
    { id: 2, nombre: 'Clara Soto', email: 'clara@prospecto.cl', phone: '+56987654321', source: 'Web', status: 'Contactado' },
    { id: 3, nombre: 'Diego Ríos', email: 'diego@prospecto.cl', phone: '+56955566677', source: 'Recomendación', status: 'Interesado' },
    { id: 4, nombre: 'Fernanda Lagos', email: 'fernanda@prospecto.cl', phone: '+56933344455', source: 'Instagram', status: 'Nuevo' }
];

const DEMO_FINANCES = [
    { id: 1, description: 'Pilates 2x - Ana García', amount: 65000, status: 'Pagado', payment_method: 'Transferencia', created_at: '2026-03-15T10:00:00Z' },
    { id: 2, description: 'Pilates 3x - Laura Torres', amount: 85000, status: 'Pagado', payment_method: 'Débito', created_at: '2026-03-14T15:30:00Z' },
    { id: 3, description: 'Plan Gimnasio - Sofía Ramos', amount: 35000, status: 'Pagado', payment_method: 'Efectivo', created_at: '2026-03-10T09:00:00Z' },
    { id: 4, description: 'Pilates 4x - María Soto', amount: 105000, status: 'Pagado', payment_method: 'Transferencia', created_at: '2026-03-01T11:00:00Z' }
];

const DEMO_PLANS = [
    { id: 1, name: 'Pilates 1x Semanal', price: 45000, credits_per_month: 4, duration_days: 30, category: 'pilates' },
    { id: 2, name: 'Pilates 2x Semanal', price: 65000, credits_per_month: 8, duration_days: 30, category: 'pilates' },
    { id: 3, name: 'Pilates 3x Semanal', price: 85000, credits_per_month: 12, duration_days: 30, category: 'pilates' },
    { id: 4, name: 'Plan Gimnasio', price: 35000, credits_per_month: 999, duration_days: 30, category: 'gym' }
];

function loadDemoData() {
    dashboardData.members = DEMO_MEMBERS;
    dashboardData.classes = JSON.parse(JSON.stringify(DEMO_CLASSES));
    dashboardData.leads = DEMO_LEADS;
    dashboardData.finances = DEMO_FINANCES;
    dashboardData.plans = DEMO_PLANS;
    dashboardData.bookings = [];
    dashboardData.waitlist = [];
    console.warn('Aura Flow Fit: Usando datos de respaldo (Supabase no disponible)');
    
    // Inyectar banner de modo demo
    if (!document.getElementById('demo-banner')) {
        const banner = document.createElement('div');
        banner.id = 'demo-banner';
        banner.style.cssText = 'background:#F59E0B; color:black; text-align:center; padding:4px; font-size:10px; font-weight:800; position:fixed; top:0; left:0; width:100%; z-index:10001; text-transform:uppercase; letter-spacing:1px;';
        banner.textContent = '⚠️ MODO DEMO ACTIVO (Sin conexión a base de datos)';
        document.body.appendChild(banner);
    }
}

// Data state
let dashboardData = {
    members: [],
    leads: [],
    finances: [],
    classes: [],
    plans: [],
    bookings: [],
    waitlist: []
};

// EXPOSE GLOBALLY for index.html inline scripts
window.dashboardData = dashboardData;


// Fetch real data from Supabase
// Aura Flow Fit - Global Error Handling & Tracing
window.addEventListener('error', (event) => {
    console.error('AURA_SYSTEM_ERROR (Dashboard):', event.error || event.message);
});
window.addEventListener('unhandledrejection', (event) => {
    console.error('AURA_PROMISE_ERROR (Dashboard):', event.reason);
});
console.info('%c Aura Flow Fit CRM Dashboard: System Hardening Active ', 'background: #06B6D4; color: white; font-weight: bold;');

// Utility for non-intrusive notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; padding: 12px 20px; border-radius: 12px;
        background: ${type === 'error' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#18181B'};
        color: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4); z-index: 10000;
        animation: slideInAura 0.3s ease-out; border-left: 4px solid ${type === 'error' ? '#B91C1C' : '#06B6D4'};
        font-size: 14px; display: flex; align-items: center; gap: 10px; pointer-events: none;
    `;
    const icon = type === 'error' ? '⚠️' : type === 'warning' ? '🔔' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'all 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Add keyframes for toast
if (!document.getElementById('aura-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'aura-toast-styles';
    style.textContent = `@keyframes slideInAura { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
    document.head.appendChild(style);
}

async function fetchDashboardData() {
    console.info('Aura Flow Fit: Sincronizando datos de producción...');
    
    // Check if overlay already exists to avoid duplicates
    if (!document.getElementById('global-loading')) {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'global-loading';
        loadingOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(24,24,27,0.95); display:flex; align-items:center; justify-content:center; z-index:9999; backdrop-filter:blur(8px); transition: opacity 0.5s ease;';
        loadingOverlay.innerHTML = '<div style="text-align:center;"><div class="spinner" style="margin: 0 auto 20px;"></div><p style="font-weight:700; letter-spacing:2px; color:#06B6D4; animation: pulse 2s infinite;">ESTABILIZANDO AURA FLOW FIT...</p></div>';
        document.body.appendChild(loadingOverlay);
    }

    // Safety timeout: 10 seconds
    if (window._loadSafetyTimeout) clearTimeout(window._loadSafetyTimeout);
    window._loadSafetyTimeout = setTimeout(() => {
        const overlay = document.getElementById('global-loading');
        if (overlay) {
            console.warn('Aura Security: Tiempo de espera agotado. Forzando acceso.');
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
            if (dashboardData.members.length === 0) {
                loadDemoData();
                const target = window.location.hash.substring(1) || 'dashboard';
                showSection(target);
            }
        }
    }, 10000);

    try {
        if (!window.supabase) {
            throw new Error('Supabase SDK not loaded');
        }

        const fetchTasks = [
            { key: 'members', table: 'socios', query: supabase.from('socios').select('*') },
            { key: 'classes', table: 'clases', query: supabase.from('clases').select('*') },
            { key: 'leads', table: 'leads', query: supabase.from('leads').select('*') },
            { key: 'bookings', table: 'reservas', query: supabase.from('reservas').select('*, socio:socios(*), clase:clases(*)').order('created_at', { ascending: false }) },
            { key: 'waitlist', table: 'lista_espera', query: supabase.from('lista_espera').select('*, socio:socios(*), clase:clases(*)').order('created_at', { ascending: true }) },
            { key: 'finances', table: 'transactions', query: supabase.from('transactions').select('*').order('created_at', { ascending: false }) },
            { key: 'plans', table: 'membership_plans', query: supabase.from('membership_plans').select('*').order('name', { ascending: true }) }
        ];

        await Promise.all(fetchTasks.map(async (task) => {
            try {
                const { data, error } = await task.query;
                if (error) throw error;
                dashboardData[task.key] = data || [];
            } catch (innerErr) {
                console.warn(`Error en tabla ${task.table}:`, innerErr.message);
            }
        }));

        // Fallback to Demo Data ONLY if core data is missing
        if (dashboardData.members.length === 0) {
            loadDemoData();
        } else {
            console.info('Aura Cloud: Datos sincronizados exitosamente.');
        }

    } catch (err) {
        console.error('Aura Critical Auth/Data Error:', err);
        showToast('Error de conexión. Activando modo offline.', 'warning');
        loadDemoData();
    } finally {
        if (window._loadSafetyTimeout) {
            clearTimeout(window._loadSafetyTimeout);
            delete window._loadSafetyTimeout;
        }

        // Final UI refresh
        try {
            updateKPIs();
            initializeCharts();
            const target = window.location.hash.substring(1) || 'dashboard';
            showSection(target);
        } catch (uiErr) {
            console.error('UI Refresh error:', uiErr);
        }

        const overlay = document.getElementById('global-loading');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 600);
        }
        
        // Hide loader after all is done
        const preloader = document.querySelector('.preloader');
        if (preloader) preloader.style.display = 'none';
    }
}

// ==========================================
// ROLE BASED ACCESS CONTROL (RBAC) - CORE
// ==========================================
function applyRoleAccess(role) {
    console.log('Applying access for role:', role);
    const roleTag = document.getElementById('logo-role-tag');
    if (roleTag) {
        if (role === 'superadmin') roleTag.textContent = 'SUPER ADMIN';
        else if (role === 'admin') roleTag.textContent = 'ADMINISTRADOR';
        else if (role === 'staff') roleTag.textContent = 'EQUIPO STAFF';
        else if (role === 'instructor') roleTag.textContent = 'INSTRUCTORA';
    }

    // Fix Greeting for Superadmin
    const user = JSON.parse(localStorage.getItem('aura_flow_auth') || '{}').user;
    const greeting = document.querySelector('.greeting');
    if (greeting && user) {
        const name = user.name || user.email.split('@')[0];
        const roleLabel = role === 'superadmin' ? 'Superadmin' : (role === 'admin' ? 'Admin' : 'Staff');
        greeting.innerHTML = `Bienvenido, <span class="text-primary">${name}</span> <span class="text-xs text-muted">(${roleLabel})</span>`;
    }

    const navItems = {
        'nav-dashboard': true,
        'nav-calendar': true,
        'nav-plans': ['superadmin', 'admin'],
        'nav-members': ['superadmin', 'admin', 'staff'],
        'nav-leads': ['superadmin', 'admin', 'staff'],
        'nav-finances': ['superadmin', 'admin'],
        'nav-evaluations': true,
        'nav-attendance': true,
        'nav-freetrial': true,
        'nav-comunicacion': ['superadmin', 'admin'],
        'nav-settings': ['superadmin', 'admin']
    };

    Object.keys(navItems).forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        const access = navItems[id];
        if (access === true) {
            el.style.display = 'flex';
        } else if (Array.isArray(access)) {
            if (access.includes(role)) {
                el.style.display = 'flex';
            } else {
                el.style.display = 'none';
            }
        }
    });

    // Staff/Instructor Restrictions on UI elements
    if (role === 'staff' || role === 'instructor') {
        const revenueCard = document.querySelector('.kpi-card:nth-child(1)');
        if (revenueCard) revenueCard.style.display = 'none';
        
        // Hide Admin-only buttons (like delete or global settings inside sections)
        document.querySelectorAll('.btn-admin-only').forEach(btn => btn.style.display = 'none');
    }
}

window.applyRoleAccess = applyRoleAccess;


let revenueChartInstance = null;
let occupancyChartInstance = null;
window.revenueChartInstance = null; // exposed for period filter
window.dashboardData = dashboardData; // expose for inline scripts

let _isInitializingCharts = false;

function initializeCharts() {
    if (_isInitializingCharts) return;
    
    const revenueCtx = document.getElementById('revenueChart');
    const occupancyCtx = document.getElementById('occupancyChart');
    if (!revenueCtx && !occupancyCtx) return;

    _isInitializingCharts = true;

    try {
        console.info('Aura Flow Fit: Initializing Charts...');
        
        if (revenueCtx) {
            const currentYear = new Date().getFullYear();
            const monthlyData = new Array(12).fill(0);
            const targetData = [8, 8, 8.5, 8.5, 9, 9, 9.5, 9.5, 10, 10, 10.5, 10.5];

            if (dashboardData.finances && dashboardData.finances.length > 0) {
                dashboardData.finances.forEach(f => {
                    if ((f.status === 'success' || f.status === 'Pagado') && f.amount > 0) {
                        const date = new Date(f.created_at);
                        if (date.getFullYear() === currentYear) {
                            monthlyData[date.getMonth()] += Number(f.amount);
                        }
                    }
                });
            }
            const dataInMillions = monthlyData.map(val => val > 0 ? (val / 1000000).toFixed(2) : 0);

            if (revenueChartInstance) revenueChartInstance.destroy();
            revenueChartInstance = new Chart(revenueCtx, {
                type: 'bar',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                    datasets: [
                        {
                            label: 'Ingresos Reales ($M)',
                            data: dataInMillions,
                            backgroundColor: 'rgba(6, 182, 212, 0.5)',
                            borderColor: '#06B6D4',
                            borderWidth: 1,
                            borderRadius: 4
                        },
                        {
                            label: 'Objetivo ($M)',
                            data: targetData,
                            type: 'line',
                            borderColor: '#22C55E',
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            pointRadius: 0,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: '#D4D4D8',
                                font: { family: 'Inter', size: 12 },
                                usePointStyle: true,
                                padding: 20
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                            ticks: {
                                color: '#A1A1AA',
                                font: { family: 'Inter', size: 11 },
                                callback: function (value) { return '$' + value + 'M'; }
                            }
                        },
                        x: {
                            grid: { display: false, drawBorder: false },
                            ticks: { color: '#A1A1AA', font: { family: 'Inter', size: 11 } }
                        }
                    }
                }
            });
            window.revenueChartInstance = revenueChartInstance;
        }

        if (occupancyCtx) {
            let countReformer = 0;
            let countPersonal = 0;
            let countGrupal = 0;

            if (dashboardData.classes && dashboardData.classes.length > 0) {
                dashboardData.classes.forEach(c => {
                    const name = c.nombre?.toLowerCase() || '';
                    if (c.tipo === 'pilates' || name.includes('reformer')) countReformer += c.cupos_ocupados || 0;
                    else if (c.tipo === 'personal' || name.includes('personal')) countPersonal += c.cupos_ocupados || 0;
                    else countGrupal += c.cupos_ocupados || 0;
                });
            }

            if (countReformer === 0 && countPersonal === 0 && countGrupal === 0) {
                countReformer = 65; countPersonal = 25; countGrupal = 10;
            }

            if (occupancyChartInstance) occupancyChartInstance.destroy();
            occupancyChartInstance = new Chart(occupancyCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Reformer', 'Personal', 'Grupal'],
                    datasets: [{
                        data: [countReformer, countPersonal, countGrupal],
                        backgroundColor: ['#06B6D4', '#22C55E', '#F59E0B'],
                        borderWidth: 0,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                color: '#D4D4D8',
                                font: { family: 'Inter', size: 12 },
                                padding: 20,
                                usePointStyle: true
                            }
                        }
                    }
                }
            });
        }
    } finally {
        _isInitializingCharts = false;
    }
}

function setupAuraSystem() {
    // Escuchar cambios en la URL (hash) para navegación global
    window.addEventListener('hashchange', () => {
        const target = window.location.hash.substring(1) || 'dashboard';
        showSection(target);
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            console.log('Aura Search:', e.target.value.toLowerCase());
        });
    }

    // Toggle Mobile Sidebar
    document.addEventListener('click', (e) => {
        const toggle = e.target.closest('#mobile-menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        if (toggle && sidebar) {
            sidebar.classList.toggle('open');
        } else if (sidebar && sidebar.classList.contains('open') && !e.target.closest('.sidebar')) {
            sidebar.classList.remove('open');
        }
        
        // Auto-close sidebar on item click (mobile)
        if (e.target.closest('.nav-item') && window.innerWidth <= 768) {
            sidebar?.classList.remove('open');
        }

        // Delegated Check-in Logic
        const checkinBtn = e.target.closest('.btn-primary.btn-sm');
        if (checkinBtn && checkinBtn.textContent.includes('Check-in')) {
            if (confirm('¿Registrar asistencia?')) {
                checkinBtn.textContent = 'Registrado ✅';
                checkinBtn.classList.replace('btn-primary', 'btn-success');
                checkinBtn.style.pointerEvents = 'none';
            }
        }

        // Nuevo Socio Logic
        if (e.target.matches('.btn-primary.btn-sm') && e.target.textContent.trim() === '+ Nuevo Socio') {
            showNewMemberModal();
        }
    });
}

function showNewMemberModal() {
    const wrap = document.getElementById('member-form-wrap');
    if (wrap) {
        wrap.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Fallback if we are not in members section
        showSection('members');
        setTimeout(() => {
            const wrapRetry = document.getElementById('member-form-wrap');
            if (wrapRetry) {
                wrapRetry.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 300);
    }
}

window.showNewMemberModal = showNewMemberModal;


function showSection(sectionId) {
    if (!sectionId) sectionId = 'dashboard';
    console.log('--- Aura Routing: Switching to', sectionId);
    
    const mainContent = document.querySelector('.main-content');
    const pageTitle = document.querySelector('.page-title');
    
    if (!mainContent) {
        console.error('Aura Flow: CRITICAL ERROR - .main-content not found');
        return;
    }

    if (window._currentSection === sectionId) return;
    window._currentSection = sectionId;

    // Update Side-menu active state globally
    document.querySelectorAll('.nav-item').forEach(nav => {
        if (nav.getAttribute('href') === `#${sectionId}`) {
            nav.classList.add('active');
        } else {
            nav.classList.remove('active');
        }
    });

    // Remove any existing dynamic content
    const existingDynamic = document.getElementById('dynamic-content');
    if (existingDynamic) existingDynamic.remove();

    // Elements that belong ONLY to the dashboard
    const dashboardElements = [
        document.querySelector('.kpi-grid'),
        document.querySelector('.charts-row'),
        document.querySelector('.alerts-section'),
        document.querySelector('.today-classes-section')
    ];
    
    if (sectionId === 'dashboard') {
        dashboardElements.forEach(el => { if (el) el.style.display = 'grid'; });
        // Specific fix for today-classes which might be a different display type
        const tcs = document.querySelector('.today-classes-section');
        if (tcs) tcs.style.display = 'block';

        if (pageTitle) pageTitle.textContent = 'Dashboard';
        renderTodayClasses();
        updateKPIs();
        setTimeout(initializeCharts, 100);
        return;
    }

    // Hide dashboard elements for any other section
    dashboardElements.forEach(el => { if (el) el.style.display = 'none'; });

    // Create dynamic content area
    const dynamicContent = document.createElement('div');
    dynamicContent.id = 'dynamic-content';
    mainContent.appendChild(dynamicContent);

    try {
        switch (sectionId) {
            case 'members':
                pageTitle.textContent = 'Gestión de Socios';
                renderMembers(dynamicContent);
                break;
            case 'leads':
                pageTitle.textContent = 'Pipeline de Leads';
                renderLeads(dynamicContent);
                break;
            case 'finances':
                pageTitle.textContent = 'Finanzas y Pagos';
                renderFinances(dynamicContent);
                break;
            case 'calendar':
                pageTitle.textContent = 'Calendario de Clases';
                renderCalendar(dynamicContent);
                break;
            case 'plans':
                pageTitle.textContent = 'Gestión de Planes y Precios';
                renderPlans(dynamicContent);
                break;
            case 'waitlist':
                pageTitle.textContent = 'Lista de Espera';
                renderWaitlist(dynamicContent);
                break;
            case 'evaluations':
                pageTitle.textContent = 'Evaluaciones Físicas';
                renderEvaluations(dynamicContent);
                break;
            case 'attendance':
                pageTitle.textContent = 'Control de Asistencia';
                renderAttendance(dynamicContent);
                break;
            case 'freetrial':
                pageTitle.textContent = 'Gestión de Clases de Prueba';
                renderFreeTrial(dynamicContent);
                break;
            default:
                console.log('Aura: Loading generic module', sectionId);
                pageTitle.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
                dynamicContent.innerHTML = `<div class="card p-xl flex flex-col items-center justify-center">
                    <p class="text-xl mb-md">Módulo ${sectionId} en construcción</p>
                    <div class="spinner"></div>
                </div>`;
        }
    } catch (err) {
        console.error('Aura: Error rendering section', sectionId, err);
        dynamicContent.innerHTML = `
            <div class="glass-card p-xl text-center">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h3 class="mb-sm">Error al cargar el módulo</h3>
                <p class="text-muted mb-lg">${err.message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Recargar Aplicación</button>
            </div>
        `;
    }
}

function renderTodayClasses() {
    const tbody = document.getElementById('today-classes-body');
    if (!tbody) return;

    if (dashboardData.classes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center p-lg">No hay clases programadas para hoy.</td></tr>';
        return;
    }

    tbody.innerHTML = dashboardData.classes.map(c => {
        const max = c.tipo === 'pilates' ? 10 : 50;
        const percent = Math.min(100, Math.round((c.cupos_ocupados / max) * 100));
        const inWaitlist = dashboardData.waitlist.filter(w => w.clase_id === c.id).length;

        return `
        <tr>
            <td>${c.horario.substring(0, 5)}</td>
            <td>
                <div class="flex flex-col">
                    <span class="font-600">${c.nombre}</span>
                    <span class="text-xs ${c.tipo === 'pilates' ? 'text-primary' : 'text-success'} uppercase font-700">${c.tipo}</span>
                </div>
            </td>
            <td>${c.instructor}</td>
            <td>
                <div class="occupancy-bar">
                    <div class="occupancy-fill ${percent >= 100 ? 'bg-error' : ''}" style="width: ${percent}%"></div>
                    <span>${c.cupos_ocupados}/${max}</span>
                </div>
                ${inWaitlist > 0 ? `<span class="text-xs text-warning font-600">⌛ ${inWaitlist} en espera</span>` : ''}
            </td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="handleCheckIn('${c.id}', '${c.nombre}')">Check-in</button>
                ${inWaitlist > 0 ? `<button class="btn btn-secondary btn-sm" onclick="showSection('waitlist')">Ver Lista</button>` : ''}
            </td>
        </tr>
    `;
    }).join('');
}

function updateKPIs() {
    console.log('--- Aura CRM: Updating KPIs...', Object.keys(dashboardData).map(k => `${k}: ${dashboardData[k]?.length || 0}`));

    // 1. Ingresos del Mes (April 2026 or latest available)
    const now = new Date();
    const currentMonthStr = now.toISOString().slice(0, 7); // "2026-04"
    
    let monthlyIncome = (dashboardData.finances || [])
        .filter(f => (f.status === 'success' || f.status === 'Pagado') && f.amount > 0 && f.created_at?.startsWith(currentMonthStr))
        .reduce((sum, f) => sum + Number(f.amount), 0);
    
    // If current month is 0 (start of month), show previous month to avoid "empty" feeling
    if (monthlyIncome === 0) {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthStr = lastMonth.toISOString().slice(0, 7);
        monthlyIncome = (dashboardData.finances || [])
            .filter(f => (f.status === 'success' || f.status === 'Pagado') && f.amount > 0 && f.created_at?.startsWith(lastMonthStr))
            .reduce((sum, f) => sum + Number(f.amount), 0);
    }

    const incomeKpi = document.querySelector('.kpi-card:nth-child(1) .kpi-value');
    if (incomeKpi) {
        const value = monthlyIncome > 1000000 ? (monthlyIncome / 1000000).toFixed(1) + 'M' : (monthlyIncome / 1000).toFixed(0) + 'K';
        incomeKpi.textContent = value;
    }

    // 2. Socios Activos
    const activeMembers = (dashboardData.members || []).filter(m => m.estado === 'Activo').length;
    const membersKpi = document.querySelector('.kpi-card:nth-child(2) .kpi-value');
    if (membersKpi) membersKpi.textContent = activeMembers;

    // 3. Ocupación Promedio
    const totalOccupied = (dashboardData.classes || []).reduce((sum, c) => sum + (Number(c.cupos_ocupados) || 0), 0);
    const totalMax = (dashboardData.classes || []).reduce((sum, c) => sum + (Number(c.cupos_max) || 10), 0);
    const avgOccupancy = totalMax > 0 ? Math.round((totalOccupied / totalMax) * 100) : 0;
    const occKpi = document.querySelector('.kpi-card:nth-child(3) .kpi-value');
    if (occKpi) occKpi.textContent = avgOccupancy + '%';

    // 4. Leads Nuevos
    const newLeads = (dashboardData.leads || []).filter(l => l.status === 'Nuevo').length;
    const leadsKpi = document.querySelector('.kpi-card:nth-child(4) .kpi-value');
    if (leadsKpi) leadsKpi.textContent = newLeads;

    // Resync charts with real data
    // Charts are initialized separately or once per load
}


function renderMembers(container) {
    const allPlans = dashboardData.plans || [];

    container.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-xl" style="padding-top: 10px;">
            <div>
                <h2 class="page-title" style="margin-bottom:0;display:none;">Socios</h2>
                <p class="text-sm text-muted">Base de datos de alumnos y membresías.</p>
            </div>
            <div class="flex gap-sm">
                <button class="btn btn-secondary" onclick="window.exportMembers()">📥 Exportar</button>
                <button class="btn btn-primary" onclick="document.getElementById('member-form-wrap').style.display='block'; window.scrollTo(0,0);">+ Nuevo Socio</button>
            </div>
        </div>
        
        <!-- Add Member Form -->
        <div id="member-form-wrap" style="display:none;" class="glass-card p-xl mb-lg border-primary">
            <h4 class="mb-lg" style="color:var(--primary);">Registro de Nuevo Socio</h4>
            <form id="member-form" onsubmit="window.guardarSocio(event)">
                <div class="grid grid-cols-2 gap-md mb-md">
                    <div>
                        <label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Nombre Completo</label>
                        <input id="ms-nombre" required placeholder="María González" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                    </div>
                    <div>
                        <label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Email</label>
                        <input id="ms-email" type="email" required placeholder="maria@email.com" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                    </div>
                    <div>
                        <label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Teléfono</label>
                        <input id="ms-tel" placeholder="+569 1234 5678" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                    </div>
                    <div>
                        <label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Seleccionar Plan</label>
                        <select id="ms-plan" required style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                            <option value="">-- Elige un plan --</option>
                            ${allPlans.map(p => `<option value="${p.id}">${p.name} ($${p.price})</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Fecha Inicio</label>
                        <input id="ms-inicio" type="date" value="${new Date().toISOString().split('T')[0]}" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                    </div>
                    <div>
                        <label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Estado Inicial</label>
                        <select id="ms-estado" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                            <option>Activo</option>
                            <option>Inactivo</option>
                        </select>
                    </div>
                </div>
                <div class="flex gap-md">
                    <button type="submit" class="btn btn-primary">✓ Confirmar Registro</button>
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('member-form-wrap').style.display='none';">Cancelar</button>
                </div>
            </form>
        </div>

        <div class="glass-card">
            <div class="p-md flex justify-between items-center border-b border-white-05">
                <h3>Lista de Socios (${dashboardData.members.length})</h3>
                <button class="btn btn-primary btn-sm" onclick="document.getElementById('member-form-wrap').style.display='block'; window.scrollTo(0,0);">+ Nuevo Socio</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Socio</th>
                        <th>Plan</th>
                        <th>Clases Rest.</th>
                        <th>Vencimiento</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${dashboardData.members.length === 0 ? '<tr><td colspan="5" class="text-center p-lg">Sin socios registrados</td></tr>' :
                        dashboardData.members.map(m => `
                        <tr>
                            <td>
                                <div class="flex items-center gap-sm">
                                    <div class="avatar">${(m.nombre || '?').charAt(0)}</div>
                                    <div>
                                        <div class="font-600">${m.nombre}</div>
                                        <div class="text-xs text-muted">${m.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td><span class="plan-badge">${m.plan || 'S/P'}</span></td>
                            <td><span style="font-weight:700;color:${(m.clases_restantes || 0) === 0 ? 'var(--error)' : (m.clases_restantes || 0) < 4 ? 'var(--warning)' : 'var(--success)'}">${m.clases_restantes === 999 ? '∞' : (m.clases_restantes ?? 0)}</span></td>
                            <td>${m.fecha_vencimiento ? new Date(m.fecha_vencimiento + 'T12:00:00').toLocaleDateString('es-CL') : '-'}</td>
                            <td>
                                <div class="flex items-center gap-sm">
                                    <span class="badge badge-${m.estado === 'Activo' ? 'success' : m.estado === 'Vencido' ? 'error' : 'warning'}">${m.estado}</span>
                                    <button class="btn btn-sm" style="padding:2px 8px; font-size:10px; background:var(--primary)22; color:var(--primary);" onclick="mostrarModalPago('${m.id}')">💳 Cargar</button>
                                </div>
                            </td>
                        </tr>`).join('')}
                </tbody>
            </table>
        </div>`;
}

window.guardarSocio = async function(e) {
    e.preventDefault();
    const planId = document.getElementById('ms-plan').value;
    const planObj = dashboardData.plans.find(p => p.id == planId);
    
    if (!planObj) {
        alert('Por favor selecciona un plan válido');
        return;
    }

    const startDate = new Date(document.getElementById('ms-inicio').value);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (planObj.duration_days || 30));

    const payload = {
        nombre: document.getElementById('ms-nombre').value,
        email: document.getElementById('ms-email').value,
        plan: planObj.name,
        clases_restantes: planObj.credits_per_month,
        estado: document.getElementById('ms-estado').value,
        fecha_vencimiento: endDate.toISOString().split('T')[0]
    };

    try {
        const { error } = await supabase.from('socios').insert([payload]);
        if (error) throw error;
        
        alert('Socio registrado con éxito ✅');
        document.getElementById('member-form-wrap').style.display = 'none';
        document.getElementById('member-form').reset();
        fetchDashboardData();
    } catch (err) {
        alert('Error al registrar socio: ' + err.message);
    }
};

function showMemberDashboard(memberId) {
    const m = dashboardData.members.find(x => x.id == memberId) || dashboardData.members[dashboardData.members.length-1];
    if(!m) return;
    
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    
    const mainContent = document.querySelector('.main-content');
    const pageTitle = document.querySelector('.page-title');
    pageTitle.textContent = `Dashboard de Socio: ${m.nombre}`;
    
    document.querySelector('.kpi-grid').style.display = 'none';
    document.querySelector('.charts-row').style.display = 'none';
    document.querySelector('.alerts-section').style.display = 'none';
    document.querySelector('.today-classes-section').style.display = 'none';

    let existingDynamic = document.getElementById('dynamic-content');
    if (!existingDynamic) {
        existingDynamic = document.createElement('div');
        existingDynamic.id = 'dynamic-content';
        mainContent.appendChild(existingDynamic);
    }
    
    const asists = JSON.parse(localStorage.getItem('asistencias') || '[]').filter(a => a.socio === m.nombre);
    existingDynamic.innerHTML = `
        <div class="flex items-center justify-between mb-lg">
            <button class="btn btn-secondary btn-sm" onclick="showSection('members')">← Volver a Socios</button>
        </div>
        <div class="grid grid-cols-3 gap-lg mb-lg">
            <div class="glass-card p-xl" style="height: fit-content;">
                <div style="width:60px;height:60px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;margin-bottom:1rem;">
                    ${m.nombre.charAt(0).toUpperCase()}
                </div>
                <h3 class="mb-sm">${m.nombre}</h3>
                <p class="text-xs text-muted mb-xs">Email: <span class="text-primary">${m.email || 'No registrado'}</span></p>
                <p class="text-xs text-muted mb-lg">Estado: <span class="badge badge-${m.estado === 'Activo'?'success':m.estado === 'Vencido'?'error':'warning'}">${m.estado}</span></p>
                
                <h4 class="text-xs uppercase text-muted mb-xs">Membresía actual</h4>
                <p class="font-600 mb-xs">${m.plan}</p>
                <p class="text-xs mb-sm">Clases restantes: <span class="font-700 ${m.clases_restantes>2?'text-success':'text-warning'}">${m.clases_restantes === 999 ? 'Ilimitadas' : m.clases_restantes}</span></p>
                <p class="text-xs mb-md">Vencimiento: <span style="color: ${new Date(m.fecha_vencimiento) < new Date() ? 'var(--error)' : 'white'};">${m.fecha_vencimiento ? new Date(m.fecha_vencimiento+'T12:00:00').toLocaleDateString('es-CL') : '-'}</span></p>
                
                <button class="btn btn-primary btn-sm w-full" onclick="alert('Funcionalidad de renovación en desarrollo');">Restablecer / Renovar Plan</button>
            </div>

            <div class="glass-card" style="grid-column:span 2;">
                <div class="p-md border-b border-white-05"><h3>Historial de Asistencia</h3></div>
                <table class="w-full">
                    <thead><tr><th style="text-align:left;">Fecha</th><th style="text-align:left;">Clase</th></tr></thead>
                    <tbody>
                        ${asists.length === 0 ? '<tr><td colspan="2" class="p-lg text-center text-muted">Aún no tiene asistencias registradas.</td></tr>' : 
                            asists.slice().reverse().map(a => `<tr><td class="p-md border-b border-white-05" style="vertical-align: middle;">${new Date(a.fecha+'T12:00:00').toLocaleDateString('es-CL')}</td><td class="p-md border-b border-white-05" style="vertical-align: middle;">${a.clase}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
window.showMemberDashboard = showMemberDashboard;

function renderLeads(container) {
    const statuses = [
        { key: 'Nuevo', color: '#3B82F6', icon: '🆕' },
        { key: 'Contactado', color: '#F59E0B', icon: '📞' },
        { key: 'Interesado', color: '#8B5CF6', icon: '⭐' },
        { key: 'Convertido', color: '#22C55E', icon: '✅' }
    ];
    container.innerHTML = `
        <!-- Add Lead Form -->
        <div id="lead-form-wrap" style="display:none;" class="glass-card p-lg mb-lg">
            <h4 class="mb-md" style="color:var(--primary);">Nuevo Lead</h4>
            <form id="lead-form" onsubmit="guardarLead(event)">
                <div class="grid grid-cols-4 gap-md mb-md">
                    <input id="ld-nombre" required placeholder="Nombre" style="background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                    <input id="ld-email" placeholder="Email o Teléfono" style="background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                    <select id="ld-source" style="background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                        <option>Instagram</option><option>Web</option><option>Recomendación</option><option>WhatsApp</option><option>Directo</option>
                    </select>
                    <select id="ld-status" style="background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                        <option>Nuevo</option><option>Contactado</option><option>Interesado</option><option>Convertido</option>
                    </select>
                </div>
                <div class="flex gap-md">
                    <button type="submit" class="btn btn-primary btn-sm">Guardar Lead</button>
                    <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('lead-form-wrap').style.display='none';">Cancelar</button>
                </div>
            </form>
        </div>

        <div class="flex justify-between items-center mb-lg">
            <h3>Pipeline de Leads (${dashboardData.leads.length})</h3>
            <button class="btn btn-primary btn-sm" onclick="document.getElementById('lead-form-wrap').style.display='block';">+ Nuevo Lead</button>
        </div>
        <div class="grid grid-cols-4 gap-lg">
            ${statuses.map(s => {
        const leads = dashboardData.leads.filter(l => l.status === s.key);
        return `
                <div style="background:var(--bg-secondary);border-radius:12px;padding:1rem;border-top:3px solid ${s.color};">
                    <div class="flex justify-between items-center mb-md">
                        <h4 style="font-size:.75rem;text-transform:uppercase;letter-spacing:1px;color:${s.color};">${s.icon} ${s.key}</h4>
                        <span style="background:${s.color}22;color:${s.color};border-radius:999px;padding:2px 8px;font-size:.7rem;font-weight:700;">${leads.length}</span>
                    </div>
                    ${leads.length === 0 ? '<p style="font-size:.75rem;color:var(--text-muted);text-align:center;padding:1rem;">Sin leads</p>' :
                leads.map(l => `
                        <div style="background:var(--bg-primary);border-radius:8px;padding:.75rem;margin-bottom:.5rem;border:1px solid rgba(255,255,255,.05);">
                            <div class="flex justify-between">
                                <p style="font-weight:600;font-size:.875rem;">${l.nombre || l.name}</p>
                                <span style="font-size:.65rem;color:var(--text-muted);">${l.created_at ? new Date(l.created_at).toLocaleDateString('es-CL') : 'Hoy'}</span>
                            </div>
                            <p style="font-size:.75rem;color:var(--text-muted);margin:.25rem 0;">${l.email || l.phone || ''}</p>
                            <div class="flex justify-between items-center" style="margin-top:.5rem;">
                                <span style="font-size:.65rem;background:rgba(255,255,255,.07);padding:2px 7px;border-radius:4px;">${l.source || 'Directo'}</span>
                                <select onchange="cambiarEstadoLead(${l.id}, this.value)" style="font-size:.65rem;background:var(--bg-tertiary);border:none;color:var(--text-muted);border-radius:4px;padding:2px 4px;">
                                    ${statuses.map(ss => `<option value="${ss.key}" ${ss.key === l.status ? 'selected' : ''}>${ss.key}</option>`).join('')}
                                </select>
                            </div>
                        </div>`).join('')
            }
                </div>`;
    }).join('')}
        </div>`;
}

async function guardarLead(e) {
    e.preventDefault();
    const lead = {
        nombre: document.getElementById('ld-nombre').value,
        email: document.getElementById('ld-email').value,
        source: document.getElementById('ld-source').value,
        status: document.getElementById('ld-status').value
    };

    const { error } = await supabase.from('leads').insert([lead]);

    if (error) {
        showToast('Error al guardar lead: ' + error.message, 'error');
    } else {
        await fetchDashboardData();
        document.getElementById('lead-form-wrap').style.display = 'none';
        document.getElementById('lead-form').reset();
        showSection('leads');
        showToast('Lead guardado exitosamente ✅', 'success');
    }
}

async function cambiarEstadoLead(id, newStatus) {
    const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    if (error) {
        showToast('Error al actualizar estado: ' + error.message, 'error');
    } else {
        await fetchDashboardData();
        showSection('leads');
        showToast('Estado de lead actualizado ✅', 'info');
    }
}
window.guardarLead = guardarLead;
window.cambiarEstadoLead = cambiarEstadoLead;

function renderFinances(container) {
    const fmt = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });
    const ingresos = dashboardData.finances.filter(f => f.amount > 0).reduce((s, f) => s + Number(f.amount), 0);
    const egresos = dashboardData.finances.filter(f => f.amount < 0).reduce((s, f) => s + Number(f.amount), 0);
    container.innerHTML = `
        <!-- Add Transaction Form -->
        <div id="fin-form-wrap" style="display:none;" class="glass-card p-lg mb-lg">
            <h4 class="mb-md" style="color:var(--primary);">Registrar Cobro / Pago</h4>
            <form id="fin-form" onsubmit="guardarTransaccion(event)">
                <div class="grid grid-cols-3 gap-md mb-md">
                    <div><label style="display:block;font-size:.75rem;color:var(--text-muted);margin-bottom:4px;">Tipo</label>
                        <select id="fin-tipo" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                            <option value="ingreso">💰 Ingreso (Cobro)</option>
                            <option value="egreso">💸 Egreso (Gasto)</option>
                        </select></div>
                    <div><label style="display:block;font-size:.75rem;color:var(--text-muted);margin-bottom:4px;">Concepto</label>
                        <input id="fin-desc" required placeholder="Membresía, arriendo, etc." style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;"></div>
                    <div><label style="display:block;font-size:.75rem;color:var(--text-muted);margin-bottom:4px;">Monto (CLP)</label>
                        <input id="fin-monto" type="number" required placeholder="65000" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;"></div>
                    <div><label style="display:block;font-size:.75rem;color:var(--text-muted);margin-bottom:4px;">Método de Pago</label>
                        <select id="fin-metodo" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                            <option>Transferencia</option><option>Tarjeta Débito</option><option>Tarjeta Crédito</option><option>Efectivo</option><option>Flow.cl</option>
                        </select></div>
                    <div><label style="display:block;font-size:.75rem;color:var(--text-muted);margin-bottom:4px;">Fecha</label>
                        <input id="fin-fecha" type="date" value="${new Date().toISOString().split('T')[0]}" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;"></div>
                    <div><label style="display:block;font-size:.75rem;color:var(--text-muted);margin-bottom:4px;">Socio (opcional)</label>
                        <select id="fin-socio" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                            <option value="">Sin asignar</option>
                            ${dashboardData.members.map(m => `<option value="${m.nombre}">${m.nombre}</option>`).join('')}
                        </select></div>
                </div>
                <div class="flex gap-md">
                    <button type="submit" class="btn btn-primary">Registrar</button>
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('fin-form-wrap').style.display='none';">Cancelar</button>
                </div>
            </form>
        </div>

        <!-- Totals -->
        <div class="grid grid-cols-3 gap-lg mb-lg">
            <div class="card p-lg text-center"><p class="text-muted text-xs mb-sm">INGRESOS TOTALES</p><h3 class="text-success">${fmt.format(ingresos)}</h3></div>
            <div class="card p-lg text-center"><p class="text-muted text-xs mb-sm">EGRESOS TOTALES</p><h3 class="text-error">${fmt.format(Math.abs(egresos))}</h3></div>
            <div class="card p-lg text-center"><p class="text-muted text-xs mb-sm">UTILIDAD NETA</p><h3 style="color:${ingresos + egresos >= 0 ? 'var(--primary)' : 'var(--error)'}">${fmt.format(ingresos + egresos)}</h3></div>
        </div>

        <div class="glass-card">
            <div class="p-md flex justify-between items-center border-b border-white-05">
                <h3>Historial de Transacciones (${dashboardData.finances.length})</h3>
                <button class="btn btn-primary btn-sm" onclick="document.getElementById('fin-form-wrap').style.display='block'; window.scrollTo(0,0);">+ Registrar Cobro</button>
            </div>
            <table>
                <thead><tr><th>Fecha</th><th>Concepto</th><th>Socio</th><th>Monto</th><th>Método</th><th>Estado</th></tr></thead>
                <tbody>
                    ${dashboardData.finances.length === 0 ? '<tr><td colspan="6" class="text-center p-lg">Sin transacciones — usa el botón Registrar Cobro</td></tr>' :
            dashboardData.finances.map(f => {
                const isInc = Number(f.amount) > 0;
                return `<tr>
                    <td>${new Date(f.created_at).toLocaleDateString('es-CL')}</td>
                    <td>${f.description || f.item_name || 'Servicio'}</td>
                    <td>${f.socio_nombre || '-'}</td>
                    <td class="font-700 ${isInc ? 'text-success' : 'text-error'}">${isInc ? '+' : ''}${fmt.format(Number(f.amount))}</td>
                    <td>${f.payment_method || '-'}</td>
                    <td><span class="badge badge-${f.status === 'Pagado' || f.status === 'success' ? 'success' : 'warning'}">${f.status === 'success' ? 'Pagado' : f.status || 'Pagado'}</span></td>
                </tr>`;
            }).join('')}
                </tbody>
            </table>
        </div>`;
}

async function guardarTransaccion(e) {
    e.preventDefault();
    const tipo = document.getElementById('fin-tipo').value;
    const rawMonto = parseFloat(document.getElementById('fin-monto').value);
    const monto = tipo === 'egreso' ? -rawMonto : rawMonto;
    const desc = document.getElementById('fin-desc').value;
    const socio_nombre = document.getElementById('fin-socio').value;
    const metodo = document.getElementById('fin-metodo').value;
    const fecha = document.getElementById('fin-fecha').value;

    const { error } = await supabase.from('pagos').insert([{
        description: desc,
        amount: monto,
        payment_method: metodo,
        status: 'success',
        socio_nombre: socio_nombre,
        created_at: fecha + 'T12:00:00Z'
    }]);

    if (error) {
        showToast('Error al registrar transacción: ' + error.message, 'error');
    } else {
        await fetchDashboardData();
        document.getElementById('fin-form-wrap').style.display = 'none';
        document.getElementById('fin-form').reset();
        showSection('finances');
        setTimeout(initializeCharts, 100);
        showToast('Transacción registrada ✅', 'success');
    }
}
window.guardarTransaccion = guardarTransaccion;

function renderCalendar(container) {
    container.innerHTML = `
        <!-- Add Class Form -->
        <div id="clase-form-wrap" style="display:none;" class="glass-card p-xl mb-lg">
            <h4 class="mb-lg" style="color:var(--primary);">Nueva Clase</h4>
            <form id="clase-form" onsubmit="guardarClase(event)">
                <div class="grid grid-cols-3 gap-md mb-md">
                    <div><label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Nombre de la Clase</label>
                        <input id="cl-nombre" required placeholder="Pilates Reformer" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;"></div>
                    <div><label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Tipo</label>
                        <select id="cl-tipo" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                            <option value="pilates">Pilates</option><option value="gym">Gimnasio</option><option value="grupal">Grupal / HIIT</option><option value="personal">Entrenamiento Personal</option>
                        </select></div>
                    <div><label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Instructor</label>
                        <input id="cl-instructor" required placeholder="María González" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;"></div>
                    <div><label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Horario</label>
                        <input id="cl-horario" type="time" required value="09:00" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;"></div>
                    <div><label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Cupos Máx.</label>
                        <input id="cl-cupos" type="number" required value="8" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;"></div>
                    <div><label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Días</label>
                        <select id="cl-dias" multiple style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:8px;color:white;height:80px;">
                            <option value="Lun" selected>Lunes</option><option value="Mar">Martes</option><option value="Mie">Miércoles</option>
                            <option value="Jue">Jueves</option><option value="Vie">Viernes</option><option value="Sab">Sábado</option><option value="Dom">Domingo</option>
                        </select></div>
                </div>
                <p style="font-size:.7rem;color:var(--text-muted);margin-bottom:1rem;">💡 Mantén Ctrl presionado para seleccionar múltiples días</p>
                <div class="flex gap-md">
                    <button type="submit" class="btn btn-primary">Guardar Clase</button>
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('clase-form-wrap').style.display='none';">Cancelar</button>
                </div>
            </form>
        </div>

        <!-- Class List -->
        <div class="flex justify-between items-center mb-lg">
            <h3>Calendario de Clases (${dashboardData.classes.length})</h3>
            <button class="btn btn-primary btn-sm" onclick="document.getElementById('clase-form-wrap').style.display='block';">+ Nueva Clase</button>
        </div>
        <div class="glass-card overflow-hidden mb-lg">
            <table>
                <thead><tr><th>Hora</th><th>Clase</th><th>Tipo</th><th>Instructor</th><th>Cupos</th><th>Ocupación</th><th>Acciones</th></tr></thead>
                <tbody>
                    ${dashboardData.classes.length === 0 ? '<tr><td colspan="7" class="text-center p-lg">Sin clases — agrega una con el botón superior</td></tr>' :
            dashboardData.classes.map((c, idx) => {
                const max = c.max_capacity || 8;
                const occ = c.occupied_slots || 0;
                const pct = Math.min(100, Math.round(occ / max * 100));
                const color = pct >= 100 ? 'var(--error)' : pct >= 75 ? 'var(--warning)' : 'var(--success)';
                return `<tr>
                    <td style="font-weight:700;">${c.schedule ? c.schedule.substring(0, 5) : '--:--'}</td>
                    <td>${c.name}</td>
                    <td><span style="background:var(--primary)22;color:var(--primary);padding:2px 8px;border-radius:4px;font-size:.7rem;font-weight:700;text-transform:uppercase;">${c.class_type}</span></td>
                    <td>${c.instructor}</td>
                    <td>${occ}/${max}</td>
                    <td><div style="display:flex;align-items:center;gap:.5rem;">
                        <div style="width:80px;height:6px;background:var(--bg-tertiary);border-radius:999px;"><div style="width:${pct}%;height:100%;background:${color};border-radius:999px;"></div></div>
                        <span style="font-size:.75rem;color:${color};font-weight:700;">${pct}%</span>
                    </div></td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="editarClase(${idx})">Editar</button>
                        <button class="btn btn-sm" style="background:var(--error)22;color:var(--error);" onclick="eliminarClase(${idx})">✕</button>
                    </td>
                </tr>`;
            }).join('')}
                </tbody>
            </table>
        </div>`;
}

async function guardarClase(e) {
    e.preventDefault();
    const diasSel = Array.from(document.getElementById('cl-dias').selectedOptions).map(o => o.value);
    
    // As per schema, we save one entry per day or just handle the first one for now
    const dia = diasSel[0] || 'Lunes'; 

    const { error } = await supabase.from('clases').insert([{
        name: document.getElementById('cl-nombre').value,
        class_type: document.getElementById('cl-tipo').value,
        instructor: document.getElementById('cl-instructor').value,
        schedule: document.getElementById('cl-horario').value + ':00',
        max_capacity: parseInt(document.getElementById('cl-cupos').value),
        dia: dia,
        occupied_slots: 0
    }]);

    if (error) {
        showToast('Error al crear clase: ' + error.message, 'error');
    } else {
        await fetchDashboardData();
        document.getElementById('clase-form-wrap').style.display = 'none';
        document.getElementById('clase-form').reset();
        showSection('calendar');
        showToast(`Clase agregada correctamente ✅`, 'success');
    }
}

function editarClase(idx) {
    const c = dashboardData.classes[idx];
    const nuevoNombre = prompt('Nombre de la clase:', c.name);
    const nuevoHorario = prompt('Horario (HH:MM):', c.schedule ? c.schedule.substring(0, 5) : '09:00');
    const nuevoCupos = prompt('Cupos máximos:', c.max_capacity);
    if (nuevoNombre) c.name = nuevoNombre;
    if (nuevoHorario) c.schedule = nuevoHorario + ':00';
    if (nuevoCupos) c.max_capacity = parseInt(nuevoCupos);
    showSection('calendar');
}

function eliminarClase(idx) {
    if (confirm(`¿Eliminar la clase "${dashboardData.classes[idx].nombre}"?`)) {
        dashboardData.classes.splice(idx, 1);
        showSection('calendar');
    }
}
window.guardarClase = guardarClase;
window.editarClase = editarClase;
window.eliminarClase = eliminarClase;

function renderWaitlist(container) {
    if (dashboardData.waitlist.length === 0) {
        container.innerHTML = '<div class="glass-card p-xl text-center"><p class="text-muted">No hay socios en lista de espera actualmente.</p></div>';
        return;
    }

    container.innerHTML = `
        <div class="glass-card">
            <table>
                <thead>
                    <tr>
                        <th>Socio</th>
                        <th>Clase</th>
                        <th>Fecha Solicitud</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${dashboardData.waitlist.map(w => `
                        <tr>
                            <td>${w.socio.nombre}</td>
                            <td>${w.clase.nombre} • ${w.clase.horario.substring(0, 5)}</td>
                            <td>${new Date(w.created_at).toLocaleDateString('es-CL')}</td>
                            <td>
                                <button class="btn btn-primary btn-sm" onclick="promoteFromWaitlist('${w.id}')">Asignar Cupo</button>
                                <button class="btn btn-secondary btn-sm" onclick="removeFromWaitlist('${w.id}')">Quitar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

async function handleCheckIn(classId, className) {
    const user = window.getCurrentUser ? window.getCurrentUser() : { role: 'admin' };

    // Check-in logic...
    if (confirm(`¿Confirmar asistencia para ${className}?`)) {
        alert(`Check-in realizado para clase de ${className}`);
    }
}

async function promoteFromWaitlist(waitlistId) {
    const item = dashboardData.waitlist.find(w => w.id === waitlistId);
    if (!item) return;

    if (confirm(`¿Promover a ${item.socio.nombre} a la clase de ${item.clase.nombre}?`)) {
        try {
            // 1. Create reservation
            const { error: resError } = await supabase
                .from('reservas')
                .insert([{
                    socio_id: item.socio_id,
                    clase_id: item.clase_id,
                    fecha: item.fecha
                }]);

            if (resError) throw resError;

            // 2. Remove from waitlist
            const { error: delError } = await supabase
                .from('lista_espera')
                .delete()
                .eq('id', waitlistId);

            if (delError) throw delError;

            alert('Socio promovido con éxito ✅');
            fetchDashboardData();
        } catch (err) {
            console.error('Error promoting:', err);
            alert('Error al promover socio');
        }
    }
}

async function removeFromWaitlist(waitlistId) {
    if (confirm('¿Quitar de la lista de espera?')) {
        await supabase.from('lista_espera').delete().eq('id', waitlistId);
        fetchDashboardData();
    }
}

async function handleNewLead() {
    document.getElementById('lead-form-wrap') && (document.getElementById('lead-form-wrap').style.display = 'block');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(amount);
}

async function showNewMemberModal() {
    // Create professional modal overlay for member creation
    const modal = document.createElement('div');
    modal.id = 'member-creation-modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index:10000; backdrop-filter:blur(8px);';
    
    // Fetch current plans for the dropdown
    const plans = dashboardData.plans || [];
    const planOptions = plans.map(p => `<option value="${p.id}" data-credits="${p.credits_per_month}" data-duration="${p.duration_days}" data-price="${p.price}">${p.name} (${formatCurrency(p.price)})</option>`).join('');

    modal.innerHTML = `
        <div class="glass-card p-xl" style="width:500px; max-width:95%;">
            <h2 class="mb-md text-primary">Registrar Nuevo Socio</h2>
            <form id="new-member-form-flow" class="grid gap-md">
                <div class="grid grid-cols-2 gap-md">
                    <div>
                        <label class="text-xs text-muted uppercase font-700">Nombre Completo</label>
                        <input type="text" id="m-nombre" class="w-full bg-secondary p-sm rounded-md border-white-05" required style="background:var(--bg-secondary); border:1px solid var(--glass-border); color:white; padding:10px;">
                    </div>
                    <div>
                        <label class="text-xs text-muted uppercase font-700">Correo Electrónico</label>
                        <input type="email" id="m-email" class="w-full bg-secondary p-sm rounded-md border-white-05" required style="background:var(--bg-secondary); border:1px solid var(--glass-border); color:white; padding:10px;">
                    </div>
                </div>

                <div>
                    <label class="text-xs text-muted uppercase font-700">Seleccionar Plan</label>
                    <select id="m-plan-id" class="w-full bg-secondary p-sm rounded-md border-white-05" style="background:var(--bg-secondary); border:1px solid var(--glass-border); color:white; padding:10px;">
                        <option value="">Seleccione un plan...</option>
                        ${planOptions}
                        <option value="custom">-- PRECIO PERSONALIZADO / PROMO --</option>
                    </select>
                </div>

                <div id="custom-plan-fields" style="display:none;" class="grid grid-cols-3 gap-md p-md bg-white-05 rounded-xl border-warning border">
                    <div>
                        <label class="text-xs text-warning uppercase font-700">Precio Promo</label>
                        <input type="number" id="m-custom-price" class="w-full bg-secondary p-sm rounded-md" style="background:var(--bg-secondary); border:1px solid var(--warning); color:white;">
                    </div>
                    <div>
                        <label class="text-xs text-warning uppercase font-700">Créditos</label>
                        <input type="number" id="m-custom-credits" value="8" class="w-full bg-secondary p-sm rounded-md" style="background:var(--bg-secondary); border:1px solid var(--warning); color:white;">
                    </div>
                    <div>
                        <label class="text-xs text-warning uppercase font-700">Duración (Días)</label>
                        <select id="m-custom-duration" class="w-full bg-secondary p-sm rounded-md" style="background:var(--bg-secondary); border:1px solid var(--warning); color:white;">
                            <option value="30">Mensual (30)</option>
                            <option value="90">Trimestral (90)</option>
                            <option value="365">Anual (365)</option>
                        </select>
                    </div>
                </div>

                <div class="flex gap-md justify-end mt-lg">
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('member-creation-modal').remove()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Crear Socio y Plan</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Dynamic field showing
    const planSelect = document.getElementById('m-plan-id');
    const customFields = document.getElementById('custom-plan-fields');
    planSelect.addEventListener('change', () => {
        customFields.style.display = planSelect.value === 'custom' ? 'grid' : 'none';
    });

    // Form logic
    document.getElementById('new-member-form-flow').onsubmit = async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('m-nombre').value;
        const email = document.getElementById('m-email').value;
        const planId = planSelect.value;
        
        let finalPlanName = '';
        let finalPrice = 0;
        let finalCredits = 0;
        let finalDuration = 30;

        if (planId === 'custom') {
            finalPlanName = 'Plan Promoción';
            finalPrice = parseInt(document.getElementById('m-custom-price').value) || 0;
            finalCredits = parseInt(document.getElementById('m-custom-credits').value) || 8;
            finalDuration = parseInt(document.getElementById('m-custom-duration').value) || 30;
        } else {
            const selectedPlan = plans.find(p => p.id === planId);
            if (!selectedPlan) return alert('Por favor seleccione un plan');
            finalPlanName = selectedPlan.name;
            finalPrice = selectedPlan.price;
            finalCredits = selectedPlan.credits_per_month;
            finalDuration = selectedPlan.duration_days;
        }

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + finalDuration);
        const expiryISO = expiryDate.toISOString().split('T')[0];

        try {
            // 1. Create Socio
            const { data: newSocio, error: socioErr } = await supabase.from('socios').insert([{
                nombre, email, plan: finalPlanName, 
                clases_restantes: finalCredits, 
                fecha_vencimiento: expiryISO,
                estado: 'Activo'
            }]).select();

            if (socioErr) throw socioErr;

            // 2. Create Pago (Transaction) record
            await supabase.from('pagos').insert([{
                socio_id: newSocio[0].id,
                socio_nombre: nombre,
                amount: finalPrice,
                status: 'success',
                description: `Suscripción inicial: ${finalPlanName} (${finalDuration} días)`
            }]);

            showToast(`Socio ${nombre} creado con éxito ✅`, 'success');
            modal.remove();
            fetchDashboardData();
        } catch (err) {
            showToast('Error al crear socio: ' + err.message, 'error');
        }
    };
}


window.getPlansData = function() {
    const all = dashboardData.plans || [];
    return {
        pilates: all.filter(p => (p.description || '').toLowerCase().includes('pilates') || p.category === 'pilates'),
        gym: all.filter(p => !(p.description || '').toLowerCase().includes('pilates') && p.category !== 'pilates')
    };
};

function renderPlans(container) {
    const plansData = window.getPlansData();
    container.innerHTML = `
        <div class="grid grid-cols-2 gap-lg mb-lg">
            <div class="glass-card p-lg">
                <div class="flex justify-between items-center mb-md">
                    <h3 class="text-primary">Pilates</h3>
                    <button class="btn btn-primary btn-sm" onclick="window.mostrarModalPlan('pilates')">+ Añadir</button>
                </div>
                <div class="grid gap-md">
                    ${plansData.pilates.map(p => `
                        <div class="flex justify-between items-center p-md bg-white-05 rounded-xl border border-white-05 plan-editor-card">
                            <div style="flex:1;">
                                <div class="flex items-center gap-sm">
                                    <p class="font-700 text-md">${p.name}</p>
                                    <span class="badge badge-info text-xs">${p.duration_days} días</span>
                                </div>
                                <p class="text-xs text-muted mt-xs">${p.credits_per_month === 999 ? 'Ilimitado' : p.credits_per_month + ' clases'} • ${formatCurrency(p.price)}</p>
                            </div>
                            <div class="flex items-center gap-sm">
                                <button class="btn btn-sm btn-outline" style="padding:4px 8px; font-size:12px;" onclick="window.editarPlan('${p.id}')">🖊️</button>
                                <button class="btn btn-sm" style="background:var(--error)22;color:var(--error);padding:4px 8px; font-size:12px;" onclick="window.eliminarPlan('${p.id}')">🗑️</button>
                            </div>
                        </div>
                    `).join('')}
                    ${plansData.pilates.length === 0 ? '<p class="text-muted text-sm my-md text-center">No hay planes de Pilates</p>' : ''}
                </div>
            </div>
            <div class="glass-card p-lg">
                <div class="flex justify-between items-center mb-md">
                    <h3 class="text-success">Gimnasio & Otros</h3>
                    <button class="btn btn-primary btn-sm" onclick="window.mostrarModalPlan('gym')">+ Añadir</button>
                </div>
                <div class="grid gap-md">
                    ${plansData.gym.map(p => `
                        <div class="flex justify-between items-center p-md bg-white-05 rounded-xl border border-white-05 plan-editor-card">
                            <div style="flex:1;">
                                <div class="flex items-center gap-sm">
                                    <p class="font-700 text-md">${p.name}</p>
                                    <span class="badge badge-success text-xs">${p.duration_days} días</span>
                                </div>
                                <p class="text-xs text-muted mt-xs">${p.credits_per_month === 999 ? 'Ilimitado' : p.credits_per_month + ' clases'} • ${formatCurrency(p.price)}</p>
                            </div>
                            <div class="flex items-center gap-sm">
                                <button class="btn btn-sm btn-outline" style="padding:4px 8px; font-size:12px;" onclick="window.editarPlan('${p.id}')">🖊️</button>
                                <button class="btn btn-sm" style="background:var(--error)22;color:var(--error);padding:4px 8px; font-size:12px;" onclick="window.eliminarPlan('${p.id}')">🗑️</button>
                            </div>
                        </div>
                    `).join('')}
                    ${plansData.gym.length === 0 ? '<p class="text-muted text-sm my-md text-center">No hay planes de Gimnasio</p>' : ''}
                </div>
            </div>
        </div>

        <!-- Add/Edit Plan Modal -->
        <div id="modal-plan" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.85); z-index:9999; align-items:center; justify-content:center; backdrop-filter:blur(10px);">
            <div class="glass-card p-xl" style="width: 450px; max-width: 90%; border:1px solid var(--primary-50);">
                <h3 id="plan-modal-title" class="mb-lg text-primary text-xl">Crear Nuevo Plan</h3>
                <form id="plan-form" onsubmit="window.guardarPlan(event)">
                    <input type="hidden" id="p-id">
                    
                    <div class="mb-md">
                        <label class="text-xs text-muted uppercase font-700 mb-xs block">Nombre del Plan</label>
                        <input id="p-nombre" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:10px;padding:12px;color:white;" required placeholder="Ej: Pilates Mensual Premium">
                    </div>

                    <div class="grid grid-cols-2 gap-md mb-md">
                        <div>
                            <label class="text-xs text-muted uppercase font-700 mb-xs block">Precio (CLP)</label>
                            <input type="number" id="p-precio" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:10px;padding:12px;color:white;" required placeholder="0">
                        </div>
                        <div>
                            <label class="text-xs text-muted uppercase font-700 mb-xs block">Categoría</label>
                            <select id="p-categoria" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:10px;padding:12px;color:white;">
                                <option value="pilates">Pilates</option>
                                <option value="gym">Gimnasio / Otro</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-md mb-lg">
                        <div>
                            <label class="text-xs text-muted uppercase font-700 mb-xs block">Clases/Mes</label>
                            <input type="number" id="p-creditos" value="8" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:10px;padding:12px;color:white;" required>
                            <span class="text-xs text-muted">999 para ilimitado</span>
                        </div>
                        <div>
                            <label class="text-xs text-muted uppercase font-700 mb-xs block">Vigencia (Periodo)</label>
                            <select id="p-duracion-preset" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:10px;padding:12px;color:white;" onchange="window.updatePlanDuration(this.value)">
                                <option value="30">Mensual (30 días)</option>
                                <option value="90">Trimestral (90 días)</option>
                                <option value="180">Semestral (180 días)</option>
                                <option value="365">Anual (365 días)</option>
                                <option value="custom">Personalizado (días)</option>
                            </select>
                            <input type="number" id="p-duracion-custom" value="30" style="display:none; width:100%; margin-top:8px; background:var(--bg-secondary); border:1px solid var(--glass-border); border-radius:10px; padding:12px; color:white;">
                        </div>
                    </div>

                    <div class="flex gap-md justify-end mt-xl">
                        <button type="button" class="btn btn-secondary" onclick="document.getElementById('modal-plan').style.display='none'">Cancelar</button>
                        <button type="submit" class="btn btn-primary" style="padding:12px 24px;">✓ Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

window.updatePlanDuration = function(val) {
    const customInput = document.getElementById('p-duracion-custom');
    if (val === 'custom') {
        customInput.style.display = 'block';
    } else {
        customInput.style.display = 'none';
        customInput.value = val;
    }
};

window.mostrarModalPlan = function(tipo = 'pilates') {
    document.getElementById('plan-modal-title').textContent = 'Crear Nuevo Plan';
    document.getElementById('p-id').value = "";
    document.getElementById('p-nombre').value = "";
    document.getElementById('p-precio').value = "";
    document.getElementById('p-categoria').value = tipo;
    document.getElementById('p-creditos').value = "8";
    document.getElementById('p-duracion-preset').value = "30";
    document.getElementById('p-duracion-custom').value = "30";
    document.getElementById('p-duracion-custom').style.display = 'none';
    document.getElementById('modal-plan').style.display = 'flex';
};

window.editarPlan = function(id) {
    const plans = (dashboardData.plans || []);
    const p = plans.find(plan => plan.id === id);
    if (!p) return;

    document.getElementById('plan-modal-title').textContent = 'Editar Plan Existente';
    document.getElementById('p-id').value = p.id;
    document.getElementById('p-nombre').value = p.name;
    document.getElementById('p-precio').value = p.price;
    document.getElementById('p-categoria').value = p.category || 'pilates';
    document.getElementById('p-creditos').value = p.credits_per_month;
    
    const duration = p.duration_days;
    const preset = [30, 90, 180, 365].includes(duration) ? duration.toString() : 'custom';
    document.getElementById('p-duracion-preset').value = preset;
    document.getElementById('p-duracion-custom').value = duration;
    document.getElementById('p-duracion-custom').style.display = preset === 'custom' ? 'block' : 'none';

    document.getElementById('modal-plan').style.display = 'flex';
};

window.guardarPlan = async function(e) {
    e.preventDefault();
    const id = document.getElementById('p-id').value;
    const planData = {
        name: document.getElementById('p-nombre').value,
        price: parseInt(document.getElementById('p-precio').value),
        category: document.getElementById('p-categoria').value,
        credits_per_month: parseInt(document.getElementById('p-creditos').value),
        duration_days: parseInt(document.getElementById('p-duracion-custom').value),
        description: document.getElementById('p-categoria').value
    };

    try {
        let result;
        if (id) {
            result = await supabase.from('membership_plans').update(planData).eq('id', id);
        } else {
            result = await supabase.from('membership_plans').insert([planData]);
        }

        if (result.error) throw result.error;
        
        alert('Plan gestionado con éxito ✅');
        document.getElementById('modal-plan').style.display = 'none';
        fetchDashboardData();
    } catch (err) {
        alert('Error al guardar plan: ' + err.message);
    }
};

window.eliminarPlan = async function(id) {
    if (!confirm('¿Seguro que deseas eliminar este plan? No podrá deshacerse.')) return;
    try {
        const { error } = await supabase.from('membership_plans').delete().eq('id', id);
        if (error) throw error;
        alert('Plan eliminado ✅');
        fetchDashboardData();
    } catch (err) {
        alert('Error al eliminar plan: ' + err.message);
    }
};


window.updatePlanPrice = async function(id, newPrice) {
    try {
        const { error } = await supabase.from('membership_plans').update({ price: parseInt(newPrice) }).eq('id', id);
        if (error) throw error;
        console.log('Price updated');
    } catch (err) {
        alert('Error al actualizar precio: ' + err.message);
    }
};

function renderEvaluations(container) {
    container.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-xl" style="padding-top: 10px;">
            <div>
                <h2 class="page-title" style="margin-bottom:0;">Gestión de Socios</h2>
                <p class="text-sm text-muted">Administra la base de datos de alumnos y sus planes.</p>
            </div>
            <div class="flex gap-sm">
                <button class="btn btn-secondary" onclick="window.exportMembers()"><span class="nav-icon-sm">📥</span> Exportar</button>
                <button class="btn btn-primary" onclick="window.showNewMemberModal()">+ Nuevo Socio</button>
            </div>
        </div>
        <div class="flex justify-between items-center mb-lg">
            <div>
                <h3>Estado Físico y Antropometría</h3>
                <p class="text-sm text-muted">Datos sincronizados con la App de Socios</p>
            </div>
            <button class="btn btn-primary" onclick="showEvalForm()" id="btn-nueva-eval">+ Actualizar Métricas</button>
        </div>

        <!-- Form (hidden by default) -->
        <div id="eval-form-container" style="display:none;" class="glass-card p-xl mb-lg border-primary">
            <h4 class="mb-lg" style="color:var(--primary);">Actualizar Ficha de Evolución</h4>
            <form id="eval-form" onsubmit="guardarEvaluacion(event)">
                <div class="grid grid-cols-2 gap-lg mb-lg">
                    <div>
                        <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:6px;">Socio</label>
                        <select id="eval-socio" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;font-size:0.9rem;" required>
                            <option value="">Seleccionar socio...</option>
                            ${dashboardData.members.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-4 gap-md mb-lg">
                    <div>
                        <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:4px;">Peso (kg)</label>
                        <input type="number" step="0.1" id="eval-peso" placeholder="70.5" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;" oninput="calcularIMC()">
                    </div>
                    <div>
                        <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:4px;">Altura (cm)</label>
                        <input type="number" step="1" id="eval-altura" placeholder="170" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;" oninput="calcularIMC()">
                    </div>
                    <div>
                        <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:4px;">IMC (auto)</label>
                        <input type="text" id="eval-imc" readonly style="width:100%;background:var(--bg-tertiary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:var(--primary);font-weight:700;">
                    </div>
                    <div>
                        <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:4px;">% Grasa</label>
                        <input type="number" step="0.1" id="eval-grasa" placeholder="20.5" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                    </div>
                    <div>
                        <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:4px;">% Músculo</label>
                        <input type="number" step="0.1" id="eval-musculo" placeholder="38.2" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                    </div>
                </div>

                <div class="flex gap-md">
                    <button type="submit" class="btn btn-primary">✓ Guardar y Sincronizar</button>
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('eval-form-container').style.display='none';">Cancelar</button>
                </div>
            </form>
        </div>

        <div class="glass-card overflow-hidden">
            <table>
                <thead>
                    <tr>
                        <th>Socio</th>
                        <th>Peso</th>
                        <th>IMC</th>
                        <th>% Grasa</th>
                        <th>% Músculo</th>
                        <th>Estatura</th>
                        <th>Estado App</th>
                    </tr>
                </thead>
                <tbody>
                    ${dashboardData.members.map(m => {
                        const imc = (m.peso && m.estatura) ? (m.peso / Math.pow(m.estatura / 100, 2)).toFixed(1) : '--';
                        return `
                        <tr>
                            <td><strong>${m.nombre}</strong><br><span class="text-xs text-muted">${m.email}</span></td>
                            <td>${m.peso ? m.peso + ' kg' : '--'}</td>
                            <td><span class="badge ${imc !== '--' ? 'badge-info' : ''}">${imc}</span></td>
                            <td>${m.porcentaje_grasa ? m.porcentaje_grasa + '%' : '--'}</td>
                            <td>${m.porcentaje_musculo ? m.porcentaje_musculo + '%' : '--'}</td>
                            <td>${m.estatura ? m.estatura + ' cm' : '--'}</td>
                            <td><span class="badge badge-success">✓ Sincronizado</span></td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function showEvalForm() {
    const fc = document.getElementById('eval-form-container');
    if (fc) fc.style.display = fc.style.display === 'none' ? 'block' : 'none';
}

function calcularIMC() {
    const peso = parseFloat(document.getElementById('eval-peso')?.value);
    const altura = parseFloat(document.getElementById('eval-altura')?.value);
    if (peso > 0 && altura > 0) {
        const imc = (peso / Math.pow(altura / 100, 2)).toFixed(1);
        const el = document.getElementById('eval-imc');
        if (el) el.value = imc;
    }
}

async function guardarEvaluacion(e) {
    e.preventDefault();
    const socioId = document.getElementById('eval-socio').value;
    if (!socioId) return alert('Selecciona un socio.');

    const eval_data = {
        peso: parseFloat(document.getElementById('eval-peso').value) || null,
        estatura: parseInt(document.getElementById('eval-altura').value) || null,
        porcentaje_grasa: parseFloat(document.getElementById('eval-grasa').value) || null,
        porcentaje_musculo: parseFloat(document.getElementById('eval-musculo').value) || null
    };

    try {
        const { error } = await supabase
            .from('socios')
            .update(eval_data)
            .eq('id', socioId);

        if (error) throw error;
        
        showToast('Evaluación sincronizada con éxito ✅', 'success');
        fetchDashboardData();
        document.getElementById('eval-form-container').style.display = 'none';
    } catch (err) {
        showToast('Error al guardar evaluación: ' + err.message, 'error');
    }
}
window.mostrarModalPago = function(sid) {
    const socio = dashboardData.members.find(m => m.id === sid);
    if (!socio) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="glass-card p-xl" style="width:400px; border:1px solid var(--primary-50);">
            <h3 class="mb-md">Cargar Créditos: ${socio.nombre}</h3>
            <p class="text-xs text-muted mb-lg">Añade clases y extiende la vigencia del socio.</p>
            
            <div class="mb-md">
                <label class="text-xs uppercase font-700 opacity-60">Seleccionar Plan</label>
                <select id="pago-plan" class="form-input w-full" style="background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;width:100%;">
                    ${(dashboardData.plans || []).map(p => `<option value="${p.id}">${p.nombre} (${formatCurrency(p.price)})</option>`).join('')}
                    <option value="custom">Carga Personalizada</option>
                </select>
            </div>

            <div id="custom-params" style="display:none;" class="grid grid-cols-2 gap-md mb-md">
                <div>
                    <label class="text-xs uppercase font-700 opacity-60">Clases</label>
                    <input type="number" id="pago-creds" value="8" class="form-input w-full" style="background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;width:100%;">
                </div>
                <div>
                    <label class="text-xs uppercase font-700 opacity-60">Días extra</label>
                    <input type="number" id="pago-days" value="30" class="form-input w-full" style="background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;width:100%;">
                </div>
            </div>

            <div class="mb-lg">
                <label class="text-xs uppercase font-700 opacity-60">Monto Cobrado (CLP)</label>
                <input type="number" id="pago-amt" value="65000" class="form-input w-full" style="background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;width:100%;">
            </div>

            <div class="flex gap-md">
                <button class="btn btn-secondary flex-1" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                <button class="btn btn-primary flex-1" id="confirm-pago-btn">Confirmar ✅</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('pago-plan').onchange = (e) => {
        const cp = document.getElementById('custom-params');
        if (e.target.value === 'custom') {
            cp.style.display = 'grid';
        } else {
            cp.style.display = 'none';
            const plan = dashboardData.plans.find(p => p.id === e.target.value);
            if (plan) {
                document.getElementById('pago-amt').value = plan.price;
            }
        }
    };

    document.getElementById('confirm-pago-btn').onclick = async () => {
        const planId = document.getElementById('pago-plan').value;
        const amt = parseInt(document.getElementById('pago-amt').value);
        let creds, days, planName;

        if (planId === 'custom') {
            creds = parseInt(document.getElementById('pago-creds').value);
            days = parseInt(document.getElementById('pago-days').value);
            planName = 'Personalizado';
        } else {
            const plan = dashboardData.plans.find(p => p.id === planId);
            creds = plan.credits_per_month;
            days = plan.duration_days;
            planName = plan.nombre;
        }

        const currentExp = new Date(socio.fecha_vencimiento > new Date().toISOString() ? socio.fecha_vencimiento : new Date());
        currentExp.setDate(currentExp.getDate() + days);

        try {
            // Update credits in DB
            await supabase.from('socios').update({
                clases_restantes: (socio.clases_restantes || 0) + creds,
                fecha_vencimiento: currentExp.toISOString().split('T')[0],
                plan: planName // Update plan to the one paid
            }).eq('id', sid);

            // Log tx
            await supabase.from('pagos').insert([{
                socio_id: sid,
                socio_nombre: socio.nombre,
                amount: amt, // Using 'amount' to match CRM logic
                status: 'success',
                description: `Renovación: ${planName} (+${creds} clases)`
            }]);

            showToast(`¡Pago de ${socio.nombre} registrado con éxito! ✅`, 'success');
            modal.remove();
            fetchDashboardData();
        } catch (err) {
            showToast('Error de sincronización: ' + err.message, 'error');
        }
    };
};

// ==========================================
// WAITLIST & UTILS
// ==========================================
function renderWaitlist(container) {
    const waitlist = dashboardData.waitlist || [];
    container.innerHTML = `
        <div class="glass-card">
            <div class="p-lg border-b">
                <h3>Socios en Espera</h3>
                <p class="text-sm text-muted">Personas esperando cupo en clases llenas</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Socio</th>
                        <th>Clase Solicitada</th>
                        <th>Posición</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    ${waitlist.map((w, idx) => `
                        <tr>
                            <td>${new Date(w.created_at).toLocaleDateString()}</td>
                            <td><strong>${w.socio?.nombre || 'Socio'}</strong></td>
                            <td>${w.clase?.nombre || 'Clase'}</td>
                            <td><span class="badge badge-info">#${idx + 1}</span></td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="notifyWaitlist('${w.id}')">Notificar Cupo</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

window.notifyWaitlist = function(id) {
    alert('Simulación: Enviando mensaje por WhatsApp y Notificación Push al socio... 📱\n"¡Hola! Se ha liberado un cupo para tu clase. Entra a la App para confirmar."');
};

async function handleLogout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        if (window.logout) {
            window.logout();
        } else {
            window.location.href = 'login.html';
        }
    }
}

window.handleCheckIn = handleCheckIn;
window.promoteFromWaitlist = promoteFromWaitlist;
window.removeFromWaitlist = removeFromWaitlist;
window.showSection = showSection;
window.handleNewLead = handleNewLead;
window.showNewMemberModal = showNewMemberModal;
window.updatePlanPrice = updatePlanPrice;
window.handleLogout = handleLogout;
window.showEvalForm = showEvalForm;
window.guardarEvaluacion = guardarEvaluacion;
window.calcularIMC = calcularIMC;
window.calcularIMC = calcularIMC;
window.updateAttendance = async function(id, status) {
    await supabase.from('reservas').update({ estado: status }).eq('id', id);
    fetchDashboardData();
};

/* ============================================================
   NEW MODULE: ASISTENCIA
============================================================ */
function renderAttendance(container) {
    container.innerHTML = `
        <div class="flex gap-sm mb-lg border-b border-white-05" style="padding-bottom:1rem;">
            <button id="tab-att-gen" class="btn btn-primary" onclick="setAttendanceTab('general')">Asistencia General</button>
            <button id="tab-att-coach" class="btn btn-secondary" onclick="setAttendanceTab('coach')">Pasar Lista (Coach)</button>
            <button id="tab-att-rep" class="btn btn-secondary" onclick="setAttendanceTab('report')">Reporte Coaches</button>
        </div>
        <div id="attendance-content"></div>
    `;
    setTimeout(() => setAttendanceTab('general'), 0);
}

window.setAttendanceTab = function(tab) {
    document.getElementById('tab-att-gen').className = 'btn ' + (tab === 'general' ? 'btn-primary' : 'btn-secondary');
    document.getElementById('tab-att-coach').className = 'btn ' + (tab === 'coach' ? 'btn-primary' : 'btn-secondary');
    document.getElementById('tab-att-rep').className = 'btn ' + (tab === 'report' ? 'btn-primary' : 'btn-secondary');
    
    const content = document.getElementById('attendance-content');
    if (!content) return;

    if (tab === 'general') renderAttendanceGeneral(content);
    else if (tab === 'coach') renderAttendanceCoachView(content);
    else if (tab === 'report') renderAttendanceReport(content);
};

function renderAttendanceGeneral(container) {
    const asistencias = dashboardData.asistencias || [];
    container.innerHTML = `
        <div class="glass-card p-lg mb-lg">
            <h4 class="mb-md" style="color:var(--primary);">Registrar Asistencia Rápida</h4>
            <div class="grid grid-cols-4 gap-md">
                <select id="att-socio" style="background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                    <option value="">Seleccionar Socio...</option>
                    ${dashboardData.members.map(m => `<option value="${m.nombre}">${m.nombre}</option>`).join('')}
                </select>
                <select id="att-clase" style="background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                    <option value="">Seleccionar Clase...</option>
                    ${dashboardData.classes.map(c => `<option value="${c.nombre}">${c.nombre} (${c.horario ? c.horario.substring(0, 5) : '--:--'})</option>`).join('')}
                </select>
                <input id="att-fecha" type="date" value="${new Date().toISOString().split('T')[0]}" style="background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                <button class="btn btn-primary" onclick="registrarAsistencia()">✓ Registrar Asistencia</button>
            </div>
        </div>

        <!-- Stats Row -->
        <div class="grid grid-cols-3 gap-lg mb-lg">
            <div class="card p-lg text-center">
                <p class="text-muted text-xs mb-sm">ASISTENCIAS HOY</p>
                <h3 style="color:var(--primary);">${asistencias.filter(a => a.fecha === new Date().toISOString().split('T')[0]).length}</h3>
            </div>
            <div class="card p-lg text-center">
                <p class="text-muted text-xs mb-sm">ASISTENCIAS ESTE MES</p>
                <h3 style="color:var(--success);">${asistencias.filter(a => new Date(a.fecha).getMonth() === new Date().getMonth()).length}</h3>
            </div>
            <div class="card p-lg text-center">
                <p class="text-muted text-xs mb-sm">TOTAL REGISTRADAS</p>
                <h3>${asistencias.length}</h3>
            </div>
        </div>

        <div class="glass-card">
            <div class="p-md border-b border-white-05">
                <h3>Historial de Asistencia (${asistencias.length})</h3>
            </div>
            <table>
                <thead><tr><th>Fecha</th><th>Socio</th><th>Clase</th><th>Hora Registro</th><th>Estado</th></tr></thead>
                <tbody>
                    ${asistencias.length === 0
            ? '<tr><td colspan="5" class="text-center p-lg">Sin asistencias — registra con el formulario superior</td></tr>'
            : asistencias.slice().reverse().map(a => `
                    <tr>
                        <td>${new Date(a.fecha + 'T12:00:00').toLocaleDateString('es-CL')}</td>
                        <td><strong>${a.socio}</strong></td>
                        <td>${a.clase}</td>
                        <td>${a.hora}</td>
                        <td><span class="badge badge-success">✅ Presente</span></td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>`;
}

async function registrarAsistencia() {
    const socioNombre = document.getElementById('att-socio').value;
    const claseId = document.getElementById('att-clase').value;
    const fecha = document.getElementById('att-fecha').value;
    if (!socioNombre || !claseId) { alert('Por favor selecciona socio y clase'); return; }

    const socio = dashboardData.members.find(m => m.nombre === socioNombre);
    const clase = dashboardData.classes.find(c => c.nombre === claseId);

    const { error } = await supabase.from('asistencias').insert([{
        socio_id: socio ? socio.id : null,
        clase_id: clase ? clase.id : null,
        clase_nombre: claseId,
        fecha: fecha,
        hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    }]);

    if (error) {
        showToast('Error al registrar asistencia: ' + error.message, 'error');
    } else {
        if (socio && socio.clases_restantes !== 999 && socio.clases_restantes > 0) {
            await supabase.from('socios').update({ clases_restantes: socio.clases_restantes - 1 }).eq('id', socio.id);
        }
        await fetchDashboardData();
        setAttendanceTab('general');
        showToast(`Asistencia de ${socioNombre} registrada ✅`, 'success');
    }
}

function guardarAsistLocal(socio, clase, fecha) {
    const asistencias = JSON.parse(localStorage.getItem('asistencias') || '[]');
    const now = new Date();
    asistencias.push({ id: Date.now(), socio, clase, fecha, hora: now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) });
    localStorage.setItem('asistencias', JSON.stringify(asistencias));
    const m = dashboardData.members.find(x => x.nombre === socio);
    if (m && m.clases_restantes !== 999 && m.clases_restantes > 0) m.clases_restantes--;
}
window.registrarAsistencia = registrarAsistencia;

function renderAttendanceCoachView(container) {
    const coaches = [...new Set(dashboardData.classes.map(c => c.instructor).filter(Boolean))];
    const userRole = window.getCurrentUser ? window.getCurrentUser().role : 'admin';
    const userName = window.getCurrentUser ? window.getCurrentUser().name : '';
    
    let coachOptions = '<option value="">Seleccionar Instructor...</option>';
    if (userRole === 'coach') {
        coachOptions = `<option value="${userName}">${userName}</option>`;
    } else {
        coachOptions += coaches.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    container.innerHTML = `
        <div class="glass-card p-lg mb-lg">
            <h4 class="mb-md" style="color:var(--primary);">Pasar Lista por Instructor</h4>
            <div class="grid grid-cols-3 gap-md">
                <select id="coach-selector" onchange="loadCoachClasses()" style="background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                    ${coachOptions}
                </select>
                <select id="coach-class-selector" onchange="loadCoachClassStudents()" style="background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;" disabled>
                    <option value="">Selecciona clase...</option>
                </select>
                <input id="coach-date" type="date" value="${new Date().toISOString().split('T')[0]}" onchange="loadCoachClassStudents()" style="background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
            </div>
        </div>
        <div id="coach-class-students">
            <div class="glass-card"><p class="text-center text-muted p-lg">Selecciona un instructor y una clase para ver los alumnos anotados.</p></div>
        </div>
    `;
    if (userRole === 'coach') {
        setTimeout(() => {
            const sel = document.getElementById('coach-selector');
            if(sel && sel.options.length > 1) {
                sel.selectedIndex = 1;
                loadCoachClasses();
            }
        }, 50);
    }
}

window.loadCoachClasses = function() {
    const coach = document.getElementById('coach-selector').value;
    const classSel = document.getElementById('coach-class-selector');
    if(!coach) {
        classSel.innerHTML = '<option value="">Selecciona clase...</option>';
        classSel.disabled = true;
        document.getElementById('coach-class-students').innerHTML = '<div class="glass-card"><p class="text-center text-muted p-lg">Selecciona un instructor y una clase para ver los alumnos anotados.</p></div>';
        return;
    }
    const classes = dashboardData.classes.filter(c => c.instructor === coach);
    classSel.innerHTML = '<option value="">Selecciona clase...</option>' + 
        classes.map(c => `<option value="${c.id}">${c.nombre} (${c.horario ? c.horario.substring(0,5) : ''})</option>`).join('');
    classSel.disabled = false;
    document.getElementById('coach-class-students').innerHTML = '<div class="glass-card"><p class="text-center text-muted p-lg">Clases cargadas. Ahora selecciona una clase.</p></div>';
};

window.loadCoachClassStudents = function() {
    const classId = document.getElementById('coach-class-selector').value;
    const fecha = document.getElementById('coach-date').value;
    const container = document.getElementById('coach-class-students');
    if(!classId) {
        container.innerHTML = '<div class="glass-card"><p class="text-center text-muted p-lg">Selecciona una clase primero.</p></div>'; return;
    }
    
    // Find Bookings for this class on this date
    let students = dashboardData.bookings.filter(b => b.clase_id == classId);
    
    // If no real bookings yet, fallback to dummy
    if(students.length === 0) {
        const dummyNames = ["Ana García", "Laura Torres", "Carlos Mendoza", "María Soto", "Juan Pérez", "Diego Ríos"];
        students = dummyNames.slice(0, Math.floor(Math.random()*4)+2).map((n, i) => ({ id: 'd'+i, socio: { nombre: n }, socio_nombre: n }));
    }

    const asistencias = JSON.parse(localStorage.getItem('asistencias') || '[]');
    const cl = dashboardData.classes.find(c => c.id == classId);
    const className = cl ? cl.nombre : '';

    container.innerHTML = `
        <div class="glass-card">
            <div class="p-md border-b border-white-05 flex justify-between items-center">
                <h3>Alumnos de la clase: ${className}</h3>
                <button class="btn btn-primary btn-sm" onclick="marcarTodosPresentes('${className}', '${fecha}')">✓ Marcar todos presentes</button>
            </div>
            <table>
                <thead><tr><th>Alumno</th><th>Estado</th><th>Acción</th></tr></thead>
                <tbody>
                    ${students.map(s => {
                        const name = s.socio ? s.socio.nombre : s.socio_nombre;
                        if(!name) return '';
                        const isPresent = asistencias.some(a => a.socio === name && a.clase === className && a.fecha === fecha);
                        return `
                        <tr>
                            <td><strong>${name}</strong></td>
                            <td>${isPresent ? '<span class="badge badge-success">✅ Asistió</span>' : '<span class="badge badge-warning">Pendiente</span>'}</td>
                            <td>
                                ${isPresent 
                                    ? `<button class="btn btn-secondary btn-sm" disabled>Registrado</button>`
                                    : `<button class="btn btn-primary btn-sm btn-mark-present" onclick="registrarCoachAsistencia('${name}', '${className}', '${fecha}')">✔ Presente</button>`}
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
};

window.registrarCoachAsistencia = function(socio, clase, fecha) {
    guardarAsistLocal(socio, clase, fecha);
    loadCoachClassStudents(); // reload list
};

window.marcarTodosPresentes = function(clase, fecha) {
    if(!confirm('¿Marcar todos los alumnos como presentes?')) return;
    const rows = document.getElementById('coach-class-students').querySelectorAll('tbody tr');
    let count = 0;
    rows.forEach(r => {
        const btn = r.querySelector('.btn-mark-present');
        if(btn) {
            btn.click();
            count++;
        }
    });
    // no alert, click handles reload
};

function renderAttendanceReport(container) {
    const asistencias = JSON.parse(localStorage.getItem('asistencias') || '[]');
    const coaches = [...new Set(dashboardData.classes.map(c => c.instructor).filter(Boolean))];
    
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getMonth();
    
    const statsData = coaches.map(coach => {
        const classes = dashboardData.classes.filter(c => c.instructor === coach);
        const classNames = classes.map(c => c.nombre);
        const coachAsists = asistencias.filter(a => classNames.includes(a.clase));
        
        const asistHoy = coachAsists.filter(a => a.fecha === today).length;
        const asistMes = coachAsists.filter(a => new Date(a.fecha).getMonth() === thisMonth).length;
        
        let totalReservas = 0;
        classes.forEach(c => {
            let res = dashboardData.bookings.filter(b => b.clase_id === c.id).length;
            if(res === 0) res = (c.cupos_ocupados || 5) * 4; // default multiplier
            totalReservas += res;
        });
        
        const pct = totalReservas > 0 ? Math.round((asistMes / totalReservas) * 100) : 0;
        
        return { name: coach, classes: classes.length, asistHoy, asistMes, totalReservas, pct };
    });

    container.innerHTML = `
        <div class="glass-card mb-lg">
            <div class="p-md border-b border-white-05">
                <h3>Rendimiento y Asistencia por Instructor</h3>
            </div>
            <table>
                <thead>
                    <tr>
                        <th style="text-align:left;">Instructor</th>
                        <th>Clases a Cargo</th>
                        <th>Asistencias Hoy</th>
                        <th>Asistencias Mes</th>
                        <th>Cumplimiento (%)</th>
                    </tr>
                </thead>
                <tbody>
                    ${statsData.map(s => `
                    <tr>
                        <td><strong>${s.name}</strong></td>
                        <td align="center">${s.classes}</td>
                        <td align="center">${s.asistHoy}</td>
                        <td align="center">${s.asistMes} / ${s.totalReservas} reservas</td>
                        <td>
                            <div style="display:flex;align-items:center;gap:.5rem;justify-content:center;">
                                <div style="width:60px;height:6px;background:var(--bg-tertiary);border-radius:999px;">
                                    <div style="width:${Math.min(s.pct, 100)}%;height:100%;background:${s.pct >= 80 ? 'var(--success)' : s.pct >= 50 ? 'var(--warning)' : 'var(--error)'};border-radius:999px;"></div>
                                </div>
                                <span class="text-xs font-700 ${s.pct >= 80 ? 'text-success' : s.pct >= 50 ? 'text-warning' : 'text-error'}">${s.pct}%</span>
                            </div>
                        </td>
                    </tr>
                    `).join('')}
                    ${statsData.length === 0 ? '<tr><td colspan="5" class="text-center p-md">No hay instructores registrados.</td></tr>' : ''}
                </tbody>
            </table>
        </div>

        <div class="glass-card p-lg" style="height: 400px; display:flex; flex-direction:column;">
            <h3 class="mb-md">Comparativa: Reservas vs Asistencias por Instructor (Mes actual)</h3>
            <div style="flex:1; position:relative; width: 100%; height: 100%;">
                <canvas id="coachReportChart"></canvas>
            </div>
        </div>
    `;

    setTimeout(() => initCoachChart(statsData), 100);
}

function initCoachChart(statsData) {
    const ctx = document.getElementById('coachReportChart');
    if(!ctx) return;
    
    if(window.coachChartInstance) {
        window.coachChartInstance.destroy();
    }
    
    window.coachChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: statsData.map(s => s.name),
            datasets: [
                {
                    label: 'Reservas Totales',
                    data: statsData.map(s => s.totalReservas),
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderRadius: 4
                },
                {
                    label: 'Asistencias Registradas',
                    data: statsData.map(s => s.asistMes),
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#D4D4D8' } },
                tooltip: { backgroundColor: '#27272A', titleColor: '#FAFAFA', bodyColor: '#D4D4D8' }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#A1A1AA' } },
                x: { grid: { display: false }, ticks: { color: '#A1A1AA' } }
            }
        }
    });
}
window.registrarAsistencia = registrarAsistencia;

/* ============================================================
   NEW MODULE: COMUNICACIÓN
============================================================ */
function renderComunicacion(container) {
    const mensajes = dashboardData.mensajes || [];
    container.innerHTML = `
        <!-- Message Composer -->
        <div class="glass-card p-xl mb-lg">
            <h4 class="mb-lg" style="color:var(--primary);">📣 Enviar Mensaje a Socios</h4>
            <div class="grid grid-cols-2 gap-md mb-md">
                <div>
                    <label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Destinatarios</label>
                    <select id="msg-dest" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                        <option value="todos">Todos los Socios (${dashboardData.members.length})</option>
                        <option value="activos">Solo Activos (${dashboardData.members.filter(m => m.estado === 'Activo').length})</option>
                        <option value="vencidos">Vencidos / Por Renovar (${dashboardData.members.filter(m => m.estado === 'Vencido').length})</option>
                        <option value="leads">Leads Nuevos (${dashboardData.leads.filter(l => l.status === 'Nuevo').length})</option>
                    </select>
                </div>
                <div>
                    <label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Canal</label>
                    <select id="msg-canal" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                        <option>📧 Email</option>
                        <option>📱 WhatsApp (simulado)</option>
                        <option>🔔 Push Notification (App)</option>
                    </select>
                </div>
                <div>
                    <label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Asunto</label>
                    <input id="msg-asunto" placeholder="ej: Renovación pendiente, Clase especial..." style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                </div>
                <div>
                    <label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Plantilla rápida</label>
                    <select id="msg-template" onchange="aplicarTemplate(this.value)" style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:10px;color:white;">
                        <option value="">Escribe tu propio mensaje...</option>
                        <option value="renovacion">🔄 Recordatorio de Renovación</option>
                        <option value="bienvenida">👋 Bienvenida</option>
                        <option value="clase_especial">🏋️ Clase Especial (Evento)</option>
                        <option value="cumple">🎂 Feliz Cumpleaños</option>
                    </select>
                </div>
            </div>
            <div class="mb-md">
                <label style="display:block;font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">Mensaje</label>
                <textarea id="msg-body" rows="5" placeholder="Escribe tu mensaje aquí..." style="width:100%;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:12px;color:white;font-family:Inter,sans-serif;resize:vertical;"></textarea>
            </div>
            <div class="flex gap-md">
                <button class="btn btn-primary" onclick="enviarMensaje()">📤 Enviar Mensaje</button>
                <button class="btn btn-secondary" onclick="document.getElementById('msg-body').value='';">Limpiar</button>
            </div>
        </div>

        <!-- Quick Alerts -->
        <h3 class="mb-md">⚡ Alertas Automáticas Sugeridas</h3>
        <div class="grid grid-cols-3 gap-lg mb-lg">
            <div class="card p-lg" style="border-left:3px solid var(--warning);">
                <h4 style="color:var(--warning);margin-bottom:.5rem;">⏰ Por Vencer (7 días)</h4>
                <p class="text-muted text-xs mb-md">Socios con membresía próxima a vencer</p>
                <p class="font-700 text-xl mb-md">${dashboardData.members.filter(m => { const d = m.fecha_vencimiento ? (new Date(m.fecha_vencimiento + 'T12:00') - new Date()) / 86400000 : 999; return d >= 0 && d <= 7; }).length} socios</p>
                <button class="btn btn-sm btn-secondary" onclick="alertaRenovacion()">Enviar Recordatorio</button>
            </div>
            <div class="card p-lg" style="border-left:3px solid var(--error);">
                <h4 style="color:var(--error);margin-bottom:.5rem;">❌ Vencidos</h4>
                <p class="text-muted text-xs mb-md">Membresías ya vencidas sin renovar</p>
                <p class="font-700 text-xl mb-md">${dashboardData.members.filter(m => m.estado === 'Vencido').length} socios</p>
                <button class="btn btn-sm btn-secondary" onclick="alertaVencidos()">Contactar</button>
            </div>
            <div class="card p-lg" style="border-left:3px solid var(--info);">
                <h4 style="color:var(--info);margin-bottom:.5rem;">🆕 Leads Sin Contactar</h4>
                <p class="text-muted text-xs mb-md">Leads nuevos esperando seguimiento</p>
                <p class="font-700 text-xl mb-md">${dashboardData.leads.filter(l => l.status === 'Nuevo').length} leads</p>
                <button class="btn btn-sm btn-secondary" onclick="alertaLeads()">Enviar Bienvenida</button>
            </div>
        </div>

        <!-- Message History -->
        <div class="glass-card">
            <div class="p-md border-b border-white-05"><h3>Historial de Mensajes Enviados</h3></div>
            <div id="msg-history" style="padding:1rem;">
                ${mensajes.length === 0
            ? '<p class="text-muted text-center p-lg">Sin mensajes enviados aún</p>'
            : mensajes.map(m => `
                    <div style="background:var(--bg-secondary);border-radius:8px;padding:.75rem;margin-bottom:.5rem;display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <p class="font-600">${m.asunto || '(sin asunto)'}</p>
                            <p class="text-xs text-muted">${m.canal} → ${m.destinatario} • ${new Date(m.fecha).toLocaleString('es-CL')}</p>
                        </div>
                        <span class="badge badge-success">Enviado</span>
                    </div>`).join('')}
            </div>
        </div>`;
}

const TEMPLATES = {
    renovacion: { asunto: 'Tu membresía está por vencer 🔔', body: 'Hola! Te recordamos que tu membresía en Aura Flow Fit vence próximamente.\n\nRenueva ahora y mantén tu rutina sin interrupciones. Contáctanos para más información.\n\n¡Te esperamos! 💪' },
    bienvenida: { asunto: '¡Bienvenida/o a Aura Flow Fit! 🌟', body: 'Hola! Nos alegra tenerte con nosotros en Aura Flow Fit.\n\nTu bienestar es nuestra prioridad. Cualquier duda, estamos aquí.\n\n¡Mucho ánimo en tu entrenamiento! 🏋️‍♀️' },
    clase_especial: { asunto: '¡Clase Especial este Sábado! 🏋️', body: 'Hola! Te invitamos a nuestra clase especial este sábado a las 10:00h.\n\nPlazas limitadas — reserva tu lugar respondiendo este mensaje.\n\n¡No te lo pierdas! 🔥' },
    cumple: { asunto: '¡Feliz Cumpleaños! 🎂', body: 'Hola! Hoy es un día especial y queremos felicitarte.\n\n¡Que cumplas muchos años más y sigas alcanzando tus metas! 🎉\n\nCon cariño, el equipo de Aura Flow Fit.' }
};

function aplicarTemplate(key) {
    if (!key) return;
    const t = TEMPLATES[key];
    document.getElementById('msg-asunto').value = t.asunto;
    document.getElementById('msg-body').value = t.body;
}

async function enviarMensaje() {
    const asunto = document.getElementById('msg-asunto').value;
    const cuerpo = document.getElementById('msg-body').value;
    const canal = document.getElementById('msg-canal').value;
    const destinatario = document.getElementById('msg-dest').value;
    if (!cuerpo) { alert('Por favor escribe un mensaje'); return; }

    const { error } = await supabase.from('mensajes_comunicacion').insert([{
        asunto, cuerpo, canal, destinatario
    }]);

    if (error) {
        showToast('Error al enviar mensaje: ' + error.message, 'error');
    } else {
        await fetchDashboardData();
        showSection('comunicacion');
        showToast(`✅ Mensaje registrado para: ${destinatario}`, 'success');
    }
}

function alertaRenovacion() {
    document.getElementById('msg-dest') && (document.getElementById('msg-dest').value = 'vencidos');
    aplicarTemplate('renovacion');
    window.scrollTo(0, 0);
}
function alertaVencidos() { document.getElementById('msg-dest') && (document.getElementById('msg-dest').value = 'vencidos'); aplicarTemplate('renovacion'); window.scrollTo(0, 0); }
function alertaLeads() { document.getElementById('msg-dest') && (document.getElementById('msg-dest').value = 'leads'); aplicarTemplate('bienvenida'); window.scrollTo(0, 0); }

window.aplicarTemplate = aplicarTemplate;
window.enviarMensaje = enviarMensaje;
window.alertaRenovacion = alertaRenovacion;
window.alertaVencidos = alertaVencidos;
window.alertaLeads = alertaLeads;

/* ============================================================
   NEW MODULE: CONFIGURACIÓN COMPLETA
============================================================ */
function renderSettings(container) {
    const config = (dashboardData.gym_config && dashboardData.gym_config[0]) || {};
    container.innerHTML = `
    <div class="grid grid-cols-2 gap-lg">

        <!-- Datos del Gym -->
        <div class="glass-card p-xl">
            <h4 class="mb-lg" style="color:var(--primary);">🏢 Datos del Gimnasio</h4>
            <div class="flex flex-col gap-md">
                ${cfgInput('cfg-nombre', 'Nombre del Gimnasio', config.nombre || 'Aura Flow Fit')}
                ${cfgInput('cfg-direccion', 'Dirección', config.direccion || 'Santiago, Chile')}
                ${cfgInput('cfg-telefono', 'Teléfono', config.telefono || '+56 9 1234 5678')}
                ${cfgInput('cfg-email', 'Email de contacto', config.email || 'hola@auraflowfit.cl')}
                ${cfgInput('cfg-web', 'Sitio Web', config.web || 'https://auraflowfit.cl')}
                <button class="btn btn-primary mt-md" onclick="guardarConfigGym()">Guardar Cambios</button>
            </div>
        </div>

        <!-- Horarios -->
        <div class="glass-card p-xl">
            <h4 class="mb-lg" style="color:var(--primary);">🕐 Horarios de Atención</h4>
            <div class="flex flex-col gap-sm">
                ${['Lunes-Viernes', 'Sábado', 'Domingo'].map((d, i) => `
                <div class="flex justify-between items-center p-sm" style="background:var(--bg-secondary);border-radius:8px;">
                    <span style="font-weight:600;min-width:120px;">${d}</span>
                    <input type="time" id="hora-inicio-${i}" value="${['07:00', '09:00', ''][i]}" style="background:var(--bg-tertiary);border:none;color:white;padding:4px 8px;border-radius:4px;">
                    <span class="text-muted">—</span>
                    <input type="time" id="hora-fin-${i}" value="${['22:00', '18:00', ''][i]}" style="background:var(--bg-tertiary);border:none;color:white;padding:4px 8px;border-radius:4px;">
                    <label style="display:flex;align-items:center;gap:.5rem;font-size:.8rem;color:var(--text-muted);">
                        <input type="checkbox" ${i < 2 ? 'checked' : ''} id="horario-activo-${i}"> Abierto
                    </label>
                </div>`).join('')}
                <button class="btn btn-primary mt-md" onclick="alert('Horarios guardados ✅')">Guardar Horarios</button>
            </div>
        </div>

        <!-- Notificaciones -->
        <div class="glass-card p-xl">
            <h4 class="mb-lg" style="color:var(--primary);">🔔 Notificaciones Automáticas</h4>
            <div class="flex flex-col gap-sm">
                ${[
            ['notif-venc', 'Alerta de membresía por vencer (7 días)', true],
            ['notif-cumple', 'Mensaje de cumpleaños automático', true],
            ['notif-clase', 'Recordatorio de clase 2h antes', true],
            ['notif-inasistencia', 'Alerta por 2 semanas sin asistencia', false],
            ['notif-pago', 'Confirmación de pago al socio', true],
            ['notif-bienvenida', 'Email de bienvenida a nuevos socios', true]
        ].map(([id, label, def]) => `
                <div class="flex justify-between items-center p-sm" style="background:var(--bg-secondary);border-radius:8px;">
                    <span style="font-size:.875rem;">${label}</span>
                    <label style="position:relative;display:inline-block;width:44px;height:24px;cursor:pointer;">
                        <input type="checkbox" id="${id}" ${def ? 'checked' : ''} style="opacity:0;width:0;height:0;" onchange="guardarNotifConfig()">
                        <span style="position:absolute;top:0;left:0;right:0;bottom:0;background:${def ? 'var(--primary)' : 'var(--bg-tertiary)'};border-radius:24px;transition:.3s;"></span>
                        <span style="position:absolute;content:'';height:18px;width:18px;left:3px;bottom:3px;background:white;border-radius:50%;transition:.3s;${def ? 'transform:translateX(20px)' : ''}"></span>
                    </label>
                </div>`).join('')}
            </div>
        </div>

        <!-- Staff Management -->
        <div class="glass-card p-xl">
            <h4 class="mb-lg" style="color:var(--primary);">👥 Gestión de Staff</h4>
            <table>
                <thead><tr><th>Nombre</th><th>Rol</th><th>Email</th><th>Acceso</th></tr></thead>
                <tbody>
                    ${[
            { nombre: 'Admin Principal', rol: 'Super Admin', email: 'admin@auraflow.cl', activo: true },
            { nombre: 'Instructora Pilates', rol: 'Instructor', email: 'pilates@auraflow.cl', activo: true },
            { nombre: 'Recepción', rol: 'Staff', email: 'recepcion@auraflow.cl', activo: true }
        ].map(s => `
                    <tr>
                        <td><strong>${s.nombre}</strong></td>
                        <td><span style="background:var(--primary)22;color:var(--primary);padding:2px 8px;border-radius:4px;font-size:.7rem;">${s.rol}</span></td>
                        <td class="text-muted text-xs">${s.email}</td>
                        <td><span class="badge badge-success">Activo</span></td>
                    </tr>`).join('')}
                </tbody>
            </table>
            <button class="btn btn-secondary btn-sm mt-md" onclick="alert('Función disponible con Supabase configurado')">+ Agregar Miembro Staff</button>
        </div>

        <!-- Integrations -->
        <div class="glass-card p-xl" style="grid-column:span 2;">
            <h4 class="mb-lg" style="color:var(--primary);">🔗 Integraciones</h4>
            <div class="grid grid-cols-4 gap-md">
                ${[
            { name: 'Supabase DB', status: 'connected', icon: '🗄️' },
            { name: 'n8n Automation', status: 'connected', icon: '⚙️' },
            { name: 'Flow.cl Pagos', status: 'pending', icon: '💳' },
            { name: 'WhatsApp API', status: 'pending', icon: '📱' },
            { name: 'Instagram DM', status: 'connected', icon: '📸' },
            { name: 'Google Calendar', status: 'pending', icon: '📅' },
            { name: 'Mailchimp', status: 'pending', icon: '📧' },
            { name: 'Analytics', status: 'pending', icon: '📊' }
        ].map(i => `
                <div style="background:var(--bg-secondary);border-radius:8px;padding:.75rem;text-align:center;border:1px solid ${i.status === 'connected' ? 'rgba(34,197,94,.3)' : 'var(--glass-border)'};">
                    <div style="font-size:1.5rem;margin-bottom:.5rem;">${i.icon}</div>
                    <p style="font-size:.8rem;font-weight:600;margin-bottom:.25rem;">${i.name}</p>
                    <span class="badge badge-${i.status === 'connected' ? 'success' : 'warning'}">${i.status === 'connected' ? 'Conectado' : 'Pendiente'}</span>
                </div>`).join('')}
            </div>
        </div>
    </div>`;
}


window.guardarConfigGym = async function() {
    showToast('Configuración del gimnasio guardada correctamente ✅', 'success');
};

window.guardarNotifConfig = function() {
    showToast('Preferencias de notificación actualizadas', 'info');
};

// ==========================================
// MEMBERSHIP PLANS LOGIC
// ==========================================
window.mostrarModalPlan = function(category) {
    const modal = document.getElementById('modal-plan');
    const title = document.getElementById('plan-modal-title');
    const form = document.getElementById('plan-form');
    
    form.reset();
    document.getElementById('p-id').value = '';
    document.getElementById('p-categoria').value = category;
    title.textContent = `Crear Nuevo Plan (${category.toUpperCase()})`;
    modal.style.display = 'flex';
};

window.editarPlan = function(id) {
    const plan = dashboardData.plans.find(p => p.id === id);
    if (!plan) return;

    const modal = document.getElementById('modal-plan');
    const title = document.getElementById('plan-modal-title');
    
    document.getElementById('p-id').value = plan.id;
    document.getElementById('p-nombre').value = plan.nombre;
    document.getElementById('p-precio').value = plan.precio;
    document.getElementById('p-categoria').value = plan.categoria || 'pilates';
    document.getElementById('p-creditos').value = plan.creditos_mes || 8;
    
    // Set duration
    const dur = plan.duracion_dias || 30;
    const select = document.getElementById('p-duracion-preset');
    if (['30', '90', '180', '365'].includes(dur.toString())) {
        select.value = dur.toString();
        document.getElementById('p-duracion-custom').style.display = 'none';
    } else {
        select.value = 'custom';
        const custom = document.getElementById('p-duracion-custom');
        custom.value = dur;
        custom.style.display = 'block';
    }

    title.textContent = 'Editar Plan de Membresía';
    modal.style.display = 'flex';
};

window.eliminarPlan = async function(id) {
    if (!confirm('¿Estás seguro de eliminar este plan? Esta acción no se puede deshacer.')) return;

    const { error } = await supabase.from('membership_plans').delete().eq('id', id);
    if (error) {
        showToast('Error al eliminar plan: ' + error.message, 'error');
    } else {
        await fetchDashboardData();
        showSection('plans');
        showToast('Plan eliminado correctamente ✅', 'info');
    }
};

window.guardarPlan = async function(e) {
    e.preventDefault();
    const id = document.getElementById('p-id').value;
    const presetDur = document.getElementById('p-duracion-preset').value;
    const duration = presetDur === 'custom' ? parseInt(document.getElementById('p-duracion-custom').value) : parseInt(presetDur);

    const planData = {
        nombre: document.getElementById('p-nombre').value,
        precio: parseInt(document.getElementById('p-precio').value),
        categoria: document.getElementById('p-categoria').value,
        creditos_mes: parseInt(document.getElementById('p-creditos').value),
        duracion_dias: duration
    };

    let query;
    if (id) {
        query = supabase.from('membership_plans').update(planData).eq('id', id);
    } else {
        query = supabase.from('membership_plans').insert([planData]);
    }

    const { error } = await query;
    if (error) {
        showToast('Error al guardar plan: ' + error.message, 'error');
    } else {
        await fetchDashboardData();
        document.getElementById('modal-plan').style.display = 'none';
        showSection('plans');
        showToast(id ? 'Plan actualizado ✅' : 'Nuevo plan creado ✅', 'success');
    }
};

// ==========================================
// FREE TRIAL LOGIC
// ==========================================
window.guardarPrueba = async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('trial-nombre').value;
    const apellido = document.getElementById('trial-apellido').value;
    const email = document.getElementById('trial-email').value;
    const phone = document.getElementById('trial-phone').value;
    const nombreCompleto = `${nombre} ${apellido}`;

    try {
        // 1. Create Lead
        const { error: leadErr } = await supabase.from('leads').insert([{
            nombre: nombreCompleto,
            email: email,
            telefono: phone,
            source: 'Clase de Prueba',
            status: 'Contactado'
        }]);
        if (leadErr) throw leadErr;

        // 2. Create Temporary Socio (1 credit)
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 7); // 7 days validity for trial

        const { error: socioErr } = await supabase.from('socios').insert([{
            nombre: nombreCompleto,
            email: email,
            plan: 'Clase de Prueba (Gratis)',
            estado: 'Activo',
            clases_restantes: 1,
            fecha_vencimiento: expiry.toISOString().split('T')[0]
        }]);
        if (socioErr) throw socioErr;

        showToast(`¡Prueba registrada para ${nombre}! Se ha creado su Lead y Socio temporal.`, 'success');
        document.getElementById('free-trial-form').reset();
        await fetchDashboardData();
        renderTrialList();
    } catch (err) {
        showToast('Error en el registro: ' + err.message, 'error');
    }
};

function renderFreeTrial(container) {
    container.innerHTML = `
        <div class="grid grid-cols-2 gap-lg">
            <div class="glass-card p-xl">
                <h3 class="mb-lg">Captación: Nueva Clase de Prueba</h3>
                <form id="free-trial-form" onsubmit="window.guardarPrueba(event)">
                    <div class="grid grid-cols-2 gap-md mb-md">
                        <div class="flex flex-col gap-xs">
                            <label class="text-xs uppercase text-muted font-700">Nombre</label>
                            <input type="text" id="trial-nombre" class="input" style="background:var(--bg-accent);" required placeholder="Ej: Juan">
                        </div>
                        <div class="flex flex-col gap-xs">
                            <label class="text-xs uppercase text-muted font-700">Apellido</label>
                            <input type="text" id="trial-apellido" class="input" style="background:var(--bg-accent);" required placeholder="Ej: Pérez">
                        </div>
                    </div>
                    <div class="flex flex-col gap-xs mb-md">
                        <label class="text-xs uppercase text-muted font-700">Email</label>
                        <input type="email" id="trial-email" class="input" style="background:var(--bg-accent);" required placeholder="juan@gmail.com">
                    </div>
                    <div class="flex flex-col gap-xs mb-lg">
                        <label class="text-xs uppercase text-muted font-700">WhatsApp / Teléfono</label>
                        <input type="tel" id="trial-phone" class="input" style="background:var(--bg-accent);" required placeholder="+569...">
                    </div>
                    <button type="submit" class="btn btn-primary w-full">Registrar y Crear Socio Temporal</button>
                    <p class="text-xs text-muted mt-md text-center">Esto creará un Lead y un Socio con 1 crédito de prueba (7 días).</p>
                </form>
            </div>
            <div class="glass-card">
                <div class="p-md border-b border-white-05 flex items-center justify-between">
                    <h3>Pruebas Recientes</h3>
                    <span class="badge badge-info">${(dashboardData.leads || []).filter(l => l.source === 'Clase de Prueba').length} Registros</span>
                </div>
                <div id="trial-list-container" class="p-md">
                    <!-- Loaded by renderTrialList -->
                </div>
            </div>
        </div>
    `;
    renderTrialList();
}

function renderEvaluations(container) {
    container.innerHTML = `
        <div class="glass-card">
            <div class="p-md border-b border-white-05 flex items-center justify-between">
                <h3>Historial de Evaluaciones Físicas</h3>
                <button class="btn btn-primary btn-sm" onclick="window.showEvalForm()">+ Nueva Evaluación</button>
            </div>
            <div class="p-xl text-center">
                <p class="text-muted">Módulo de seguimiento biométrico (Peso, % Grasa, Músculo).</p>
                <button class="btn btn-secondary mt-md" onclick="window.showSection('members')">Seleccionar socio para evaluar</button>
            </div>
        </div>
    `;
}

function verEvaluacion(id) {
    showToast('Visualización de evaluación ID: ' + id + ' (En desarrollo)', 'info');
}

function eliminarEvaluacion(id) {
    if(confirm('¿Seguro que deseas eliminar esta evaluación?')) {
        showToast('Evaluación eliminada localmente (Demo)', 'warning');
    }
}


// ==========================================
// FINAL EXPOSURES & INIT
// ==========================================
window.showSection = showSection;
window.renderMembers = renderMembers;
window.renderLeads = renderLeads;
window.renderFinances = renderFinances;
window.renderCalendar = renderCalendar;
window.renderPlans = renderPlans;
window.renderWaitlist = renderWaitlist;
window.renderEvaluations = renderEvaluations;
window.renderAttendance = renderAttendance;
window.renderFreeTrial = renderFreeTrial;
window.renderTrialList = renderTrialList;
window.verEvaluacion = verEvaluacion;
window.eliminarEvaluacion = eliminarEvaluacion;

document.addEventListener('DOMContentLoaded', () => {
    console.info('%c Aura Dashboard: Initializing System Listeners... ', 'background: #06B6D4; color: white;');
    setupAuraSystem();
    fetchDashboardData();
    
    const initial = window.location.hash.substring(1) || 'dashboard';
    document.querySelectorAll('.nav-item').forEach(nav => {
        if (nav.getAttribute('href') === `#${initial}`) nav.classList.add('active');
        else nav.classList.remove('active');
    });
});


