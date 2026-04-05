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
    dashboardData.classes = DEMO_CLASSES;
    dashboardData.leads = DEMO_LEADS;
    dashboardData.finances = DEMO_FINANCES;
    dashboardData.plans = DEMO_PLANS;
    dashboardData.bookings = [];
    dashboardData.waitlist = [];
    console.log('Using demo data (Supabase not reachable)');
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
async function fetchDashboardData() {
    const mainContent = document.querySelector('.main-content');
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'global-loading';
    loadingOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(24,24,27,0.7); display:flex; align-items:center; justify-content:center; z-index:9999; backdrop-filter:blur(4px);';
    loadingOverlay.innerHTML = '<div class="flex flex-col items-center gap-md"><div class="spinner"></div><p class="font-700 tracking-widest text-primary animate-pulse">CARGANDO DATOS...</p></div>';
    document.body.appendChild(loadingOverlay);

    try {
        if (!supabase) throw new Error('Supabase not defined');
        const { data: members, error } = await supabase
            .from('socios')
            .select('*');

        if (error) throw error;
        dashboardData.members = members || [];

        // Fetch classes
        const { data: classes, error: errorClasses } = await supabase
            .from('clases')
            .select('*');

        if (errorClasses) throw errorClasses;
        dashboardData.classes = classes || [];

        // Fetch leads
        const { data: leads } = await supabase.from('leads').select('*');
        if (leads) dashboardData.leads = leads;

        // Fetch ALL Bookings
        const { data: bookings } = await supabase
            .from('reservas')
            .select('*, socio:socios(*), clase:clases(*)')
            .order('created_at', { ascending: false });

        if (bookings) dashboardData.bookings = bookings;

        // Fetch Waitlist
        const { data: waitlist } = await supabase
            .from('lista_espera')
            .select('*, socio:socios(*), clase:clases(*)')
            .order('created_at', { ascending: true });

        dashboardData.waitlist = waitlist || [];

        // Fetch Finances (Transactions)
        const { data: finances } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });
        dashboardData.finances = finances || [];

        // Fetch Membership Plans
        const { data: plans } = await supabase
            .from('membership_plans')
            .select('*')
            .order('name', { ascending: true });
        dashboardData.plans = plans || [];

        console.log('Real data fetched from Supabase:', dashboardData);
    } catch (err) {
        console.error('Error fetching data from Supabase:', err);
        console.warn('Loading demo data as fallback...');
        loadDemoData();
    } finally {
        const overlay = document.getElementById('global-loading');
        if (overlay) overlay.remove();

        // Apply Role Access BEFORE rendering sections
        const session = JSON.parse(localStorage.getItem('aura_flow_auth') || '{}');
        if (session.user && session.user.role) {
            applyRoleAccess(session.user.role);
        }

        // Refresh active section
        const activeSection = document.querySelector('.nav-item.active');
        if (activeSection) {
            const sectionTarget = activeSection.getAttribute('href').substring(1);
            showSection(sectionTarget);
        }

        renderRecentBookings();
        updateKPIs();
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

function initializeCharts() {
    // Generate real revenue data simply from current year
    const currentYear = new Date().getFullYear();
    const monthlyData = new Array(12).fill(0);

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
    const targetData = [8, 8, 8.5, 8.5, 9, 9, 9.5, 9.5, 10, 10, 10.5, 10.5]; // Example static target

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        if (revenueChartInstance) revenueChartInstance.destroy();
        revenueChartInstance = new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [
                    {
                        label: 'Ingresos',
                        data: dataInMillions,
                        backgroundColor: 'rgba(6, 182, 212, 0.8)',
                        borderColor: '#06B6D4',
                        borderWidth: 2,
                        borderRadius: 8,
                    },
                    {
                        label: 'Objetivo',
                        data: targetData,
                        type: 'line',
                        borderColor: '#22C55E',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        tension: 0.4,
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
                    },
                    tooltip: {
                        backgroundColor: '#27272A',
                        titleColor: '#FAFAFA',
                        bodyColor: '#D4D4D8',
                        borderColor: 'rgba(6, 182, 212, 0.2)',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function (context) {
                                return context.dataset.label + ': $' + context.parsed.y + 'M';
                            }
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
        window.revenueChartInstance = revenueChartInstance; // expose for chart period filter
    }

    // Occupancy Donut Chart (Real data based on Class types)
    let countReformer = 0;
    let countPersonal = 0;
    let countGrupal = 0;

    if (dashboardData.classes && dashboardData.classes.length > 0) {
        dashboardData.classes.forEach(c => {
            if (c.tipo === 'pilates' || c.nombre.toLowerCase().includes('reformer')) countReformer += c.cupos_ocupados || 0;
            else if (c.tipo === 'personal' || c.nombre.toLowerCase().includes('personal')) countPersonal += c.cupos_ocupados || 0;
            else countGrupal += c.cupos_ocupados || 0; // Default to grupal
        });
    }

    // Fallback if no data
    if (countReformer === 0 && countPersonal === 0 && countGrupal === 0) {
        countReformer = 65; countPersonal = 25; countGrupal = 10;
    }

    const occupancyCtx = document.getElementById('occupancyChart');
    if (occupancyCtx) {
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
}

function setupEventListeners() {
    // Navigation logic is now centralized in initApp() to ensure early registration

    // Initial section load removed from here as it is now centralized in initApp()

    // Sidebar management for mobile (if hamburger exists)
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();
            // Filter members table if it exists
            const membersTableBody = document.querySelector('#members-table-body');
            if (membersTableBody) {
                const rows = membersTableBody.querySelectorAll('tr');
                rows.forEach(row => {
                    const text = row.innerText.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
        });
    }

    // Sidebar management is now centralized in index.html inline script 
    // to avoid event listener conflicts.


    // Check-in Buttons
    document.addEventListener('click', async (e) => {
        if (e.target.matches('.btn-primary.btn-sm') && e.target.textContent === 'Check-in') {
            const row = e.target.closest('tr');
            const classTime = row.cells[0].textContent;
            const className = row.cells[1].textContent;

            // In a real app, we'd need the class ID and socio ID.
            // For now, we'll simulate the update on the first class found in dashboardData.classes
            const classObj = dashboardData.classes.find(c => c.nombre === className && c.horario.startsWith(classTime));

            if (confirm(`¿Registrar asistencia para ${className}?`)) {
                try {
                    e.target.textContent = 'Procesando...';

                    // Here you would typically link this to a 'reservas' record.
                    // For demo, we just show the UI success.
                    setTimeout(() => {
                        e.target.textContent = 'Registrado ✅';
                        e.target.classList.replace('btn-primary', 'btn-success');
                        e.target.style.pointerEvents = 'none';
                    }, 500);
                } catch (err) {
                    console.error('Check-in error:', err);
                    e.target.textContent = 'Error';
                }
            }
        }

        // New Member Button
        if (e.target.matches('.btn-primary.btn-sm') && e.target.textContent === '+ Nuevo Socio') {
            showNewMemberModal();
        }
    });
}

// Global exposure for HTML onclicks
window.showSection = showSection;
window.handleLogout = () => {
    if (typeof logout === 'function') {
        logout();
    } else {
        localStorage.clear();
        window.location.href = 'login.html';
    }
};

function showSection(sectionId) {
    try {
        console.log('--- Switching UI to:', sectionId);
        const mainContent = document.querySelector('.main-content');
        const pageTitle = document.querySelector('.page-title');
        const dashboardWidgets = document.getElementById('dashboard-widgets');

        if (!mainContent || !pageTitle) return;

        // 1. Sidebar Active State
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === `#${sectionId}`);
        });

        // 2. Manage Display Containers
        let dynamicContainer = document.getElementById('dynamic-module-view');
        if (!dynamicContainer) {
            dynamicContainer = document.createElement('div');
            dynamicContainer.id = 'dynamic-module-view';
            dynamicContainer.className = 'animate-fadeIn';
            mainContent.appendChild(dynamicContainer);
        }

        // 3. Reset Views
        if (dashboardWidgets) dashboardWidgets.style.display = 'none';
        dynamicContainer.style.display = 'none';
        dynamicContainer.innerHTML = ''; // Clear previous module

        // 4. Route to Correct View
        if (sectionId === 'dashboard' || !sectionId) {
            if (dashboardWidgets) {
                dashboardWidgets.style.display = 'block';
                pageTitle.textContent = 'Dashboard Overview';
                renderTodayClasses();
                updateKPIs();
                setTimeout(initializeCharts, 200);
            }
        } else {
            dynamicContainer.style.display = 'block';
            
            // Map section IDs to render functions
            const routes = {
                members: { title: 'Gestión de Socios', render: renderMembers },
                leads: { title: 'Pipeline de Leads', render: renderLeads },
                calendar: { title: 'Calendario de Actividades', render: renderCalendar },
                plans: { title: 'Planes y Precios', render: renderPlans },
                waitlist: { title: 'Lista de Espera', render: renderWaitlist },
                finances: { title: 'Finanzas y Pagos', render: renderFinances },
                evaluations: { title: 'Evaluaciones Físicas', render: renderEvaluations },
                attendance: { title: 'Control de Asistencia', render: renderAttendance },
                freetrial: { title: 'Pruebas de Clase', render: renderFreeTrial },
                comunicacion: { title: 'Comunicación', render: renderComunicacion },
                settings: { title: 'Configuración', render: renderSettings }
            };

            const route = routes[sectionId];
            if (route) {
                pageTitle.textContent = route.title;
                route.render(dynamicContainer);
            } else {
                pageTitle.textContent = 'Módulo No Encontrado';
                dynamicContainer.innerHTML = `<div class="card p-xl text-center">
                    <p class="text-muted mb-md">El módulo "${sectionId}" aún no ha sido implementado o es inaccesible.</p>
                    <button class="btn btn-primary" onclick="window.location.hash='dashboard'">Volver al Dashboard</button>
                </div>`;
            }
        }
    } catch (err) {
        console.error('Critical Navigation Error:', err);
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
                <button class="btn btn-primary btn-sm" onclick="showClassCheckIn('${c.id}', '${c.nombre}')">Ver Lista / Check-in</button>
            </td>
        </tr>
    `;
    }).join('');
}



function renderRecentBookings() {
    const list = document.getElementById('recent-bookings-list');
    if (!list) return;
    
    if (!dashboardData.bookings || dashboardData.bookings.length === 0) {
        list.innerHTML = '<p class="p-lg text-muted text-center">No hay reservas recientes.</p>';
        return;
    }
    
    const recent = dashboardData.bookings.slice(0, 5);
    
    let html = '<table style="width:100%; text-align:left;"><thead><tr><th style="padding:.5rem;">Socio</th><th style="padding:.5rem;">Clase</th><th style="padding:.5rem;">Fecha</th><th style="padding:.5rem;">Estado</th></tr></thead><tbody>';
    recent.forEach(b => {
        const socio = b.socio ? b.socio.nombre : 'Socio';
        const clase = b.clase ? b.clase.nombre : 'Clase';
        const estado = b.estado || 'Confirmada';
        let badge = 'badge-primary';
        if (estado === 'Asistió') badge = 'badge-success';
        if (estado === 'Cancelada' || estado === 'Faltó') badge = 'badge-error';

        html += `<tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding:.5rem;"><strong>${socio}</strong></td>
            <td style="padding:.5rem;">${clase}</td>
            <td style="padding:.5rem;" class="text-sm text-muted">${b.fecha.substring(0, 10)}</td>
            <td style="padding:.5rem;"><span class="badge ${badge}">${estado}</span></td>
        </tr>`;
    });
    html += '</tbody></table>';
    list.innerHTML = html;
}

function updateKPIs() {
    const formatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

    // 1. Ingresos del Mes
    const currentMonthStr = new Date().toISOString().slice(0, 7);
    const monthlyIncome = dashboardData.finances
        .filter(f => (f.status === 'success' || f.status === 'Pagado') && f.amount > 0 && f.created_at.startsWith(currentMonthStr))
        .reduce((sum, f) => sum + Number(f.amount), 0);
    const incomeKpi = document.querySelector('.kpi-card:nth-child(1) .kpi-value');
    if (incomeKpi) incomeKpi.textContent = (monthlyIncome / 1000000).toFixed(1) + 'M';

    // 2. Socios Activos
    const activeMembers = dashboardData.members.filter(m => m.estado === 'Activo').length;
    const membersKpi = document.querySelector('.kpi-card:nth-child(2) .kpi-value');
    if (membersKpi) membersKpi.textContent = activeMembers;

    // 3. Ocupación Promedio
    const totalOccupied = dashboardData.classes.reduce((sum, c) => sum + (c.cupos_ocupados || 0), 0);
    const totalMax = dashboardData.classes.reduce((sum, c) => sum + (c.cupos_max || 10), 0);
    const avgOccupancy = totalMax > 0 ? Math.round((totalOccupied / totalMax) * 100) : 0;
    const occKpi = document.querySelector('.kpi-card:nth-child(3) .kpi-value');
    if (occKpi) occKpi.textContent = avgOccupancy + '%';

    // 4. Leads Nuevos
    const newLeads = dashboardData.leads.filter(l => l.status === 'Nuevo').length;
    const leadsKpi = document.querySelector('.kpi-card:nth-child(4) .kpi-value');
    if (leadsKpi) leadsKpi.textContent = newLeads;

    // Resync charts with real data if needed
    setTimeout(initializeCharts, 50);
}

// Global exposure for modal
window.showNewMemberModal = function() {
    const modal = document.getElementById('member-form-wrap');
    if (modal) {
        modal.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Fallback: Navigate to members section where form is defined
        window.location.hash = '#members';
        setTimeout(() => {
            const m = document.getElementById('member-form-wrap');
            if (m) m.style.display = 'block';
        }, 300);
    }
};

function renderMembers(container) {
    const allPlans = dashboardData.plans || [];

    container.innerHTML = `
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
            <table class="w-full">
                <thead>
                    <tr>
                        <th>Socio</th>
                        <th>Plan</th>
                        <th>Clases Rest.</th>
                        <th>Vencimiento</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody id="members-table-body">
                    ${dashboardData.members.length === 0 ? '<tr><td colspan="5" class="text-center p-lg">Sin socios registrados</td></tr>' :
                        dashboardData.members.map(m => `
                        <tr>
                            <td>
                                <div class="flex items-center gap-sm">
                                    <div style="width:32px;height:32px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem;">${(m.nombre || '?').charAt(0).toUpperCase()}</div>
                                    <div><div class="font-600">${m.nombre}</div><div class="text-xs text-muted">${m.email || ''}</div></div>
                                </div>
                            </td>
                            <td><span class="plan-badge">${m.plan || 'S/P'}</span></td>
                            <td><span style="font-weight:700;color:${m.clases_restantes === 0 ? 'var(--error)' : m.clases_restantes < 4 ? 'var(--warning)' : 'var(--success)'}">${m.clases_restantes === 999 ? '∞' : (m.clases_restantes ?? 0)}</span></td>
                            <td>${m.fecha_vencimiento ? new Date(m.fecha_vencimiento + 'T12:00:00').toLocaleDateString('es-CL') : '-'}</td>
                            <td><span class="badge badge-${m.estado === 'Activo' ? 'success' : m.estado === 'Vencido' ? 'error' : 'warning'}">${m.estado}</span></td>
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
    const lead = { id: Date.now(), nombre: document.getElementById('ld-nombre').value, email: document.getElementById('ld-email').value, source: document.getElementById('ld-source').value, status: document.getElementById('ld-status').value, created_at: new Date().toISOString() };
    try { await supabase.from('leads').insert([{ nombre: lead.nombre, email: lead.email, source: lead.source, status: lead.status }]); } catch { /* offline */ }
    dashboardData.leads.push(lead);
    document.getElementById('lead-form-wrap').style.display = 'none';
    document.getElementById('lead-form').reset();
    showSection('leads');
}

function cambiarEstadoLead(id, newStatus) {
    const lead = dashboardData.leads.find(l => l.id == id);
    if (lead) { lead.status = newStatus; showSection('leads'); }
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
    const tx = {
        id: Date.now(), description: document.getElementById('fin-desc').value,
        amount: monto, payment_method: document.getElementById('fin-metodo').value,
        socio_nombre: document.getElementById('fin-socio').value,
        status: 'Pagado', created_at: document.getElementById('fin-fecha').value + 'T12:00:00Z'
    };
    try { await supabase.from('transactions').insert([{ description: tx.description, amount: tx.amount, payment_method: tx.payment_method, status: tx.status }]); } catch { /* offline */ }
    dashboardData.finances.unshift(tx);
    document.getElementById('fin-form-wrap').style.display = 'none';
    document.getElementById('fin-form').reset();
    showSection('finances');
    setTimeout(initializeCharts, 100);
    alert('Transacción registrada ✅');
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
                const max = c.cupos_max || 8;
                const occ = c.cupos_ocupados || 0;
                const pct = Math.min(100, Math.round(occ / max * 100));
                const color = pct >= 100 ? 'var(--error)' : pct >= 75 ? 'var(--warning)' : 'var(--success)';
                return `<tr>
                    <td style="font-weight:700;">${c.horario ? c.horario.substring(0, 5) : '--:--'}</td>
                    <td>${c.nombre}</td>
                    <td><span style="background:var(--primary)22;color:var(--primary);padding:2px 8px;border-radius:4px;font-size:.7rem;font-weight:700;text-transform:uppercase;">${c.tipo}</span></td>
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
    const clase = {
        id: Date.now(), nombre: document.getElementById('cl-nombre').value,
        tipo: document.getElementById('cl-tipo').value,
        instructor: document.getElementById('cl-instructor').value,
        horario: document.getElementById('cl-horario').value + ':00',
        cupos_max: parseInt(document.getElementById('cl-cupos').value),
        cupos_ocupados: 0, dias: diasSel
    };
    try { await supabase.from('clases').insert([{ nombre: clase.nombre, tipo: clase.tipo, instructor: clase.instructor, horario: clase.horario, cupos_max: clase.cupos_max, cupos_ocupados: 0 }]); } catch { /* offline */ }
    dashboardData.classes.push(clase);
    document.getElementById('clase-form-wrap').style.display = 'none';
    document.getElementById('clase-form').reset();
    showSection('calendar');
    alert(`Clase "${clase.nombre}" agregada ✅`);
}

function editarClase(idx) {
    const c = dashboardData.classes[idx];
    const nuevoNombre = prompt('Nombre de la clase:', c.nombre);
    const nuevoHorario = prompt('Horario (HH:MM):', c.horario ? c.horario.substring(0, 5) : '09:00');
    const nuevoCupos = prompt('Cupos máximos:', c.cupos_max);
    if (nuevoNombre) c.nombre = nuevoNombre;
    if (nuevoHorario) c.horario = nuevoHorario + ':00';
    if (nuevoCupos) c.cupos_max = parseInt(nuevoCupos);
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

function renderFreeTrial(container) {
    const trials = dashboardData.leads ? dashboardData.leads.filter(l => l.status === 'Prueba' || (l.notes && l.notes.includes('freetrial'))) : [];
    
    container.innerHTML = `
        <div class="flex justify-between items-center mb-lg">
            <div>
                <h3>Gestión de Clases de Prueba</h3>
                <p class="text-xs text-muted">Prospectos que solicitaron una sesión de cortesía</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="showNewLeadForm()">+ Nuevo Prospecto</button>
        </div>

        <div class="grid grid-cols-1 gap-md">
            ${trials.length === 0 ? `
                <div class="glass-card p-xl text-center">
                    <p class="text-muted mb-md">No hay sesiones de prueba agendadas recientemente.</p>
                    <button class="btn btn-secondary btn-sm" onclick="showSection('leads')">Ir al Pipeline de Leads</button>
                </div>
            ` : trials.map(t => `
                <div class="glass-card p-lg flex justify-between items-center border-l-4 border-warning">
                    <div>
                        <p class="font-700 text-lg">${t.nombre}</p>
                        <p class="text-sm text-muted">${t.email || t.phone || 'Sin contacto'} • Origen: ${t.source || 'Directo'}</p>
                    </div>
                    <div class="flex gap-md">
                        <button class="btn btn-primary btn-sm" onclick="alert('Funcionalidad de Check-in de Prueba en desarrollo')">Confirmar Asistencia</button>
                        <button class="btn btn-secondary btn-sm" onclick="showSection('leads')">Ver Pipeline</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function showClassCheckIn(classId, className) {
    const classObj = dashboardData.classes.find(c => c.id === classId);
    if (!classObj) return;

    // Filter bookings for this class TODAY
    const today = new Date().toISOString().split('T')[0];
    const bookings = (dashboardData.bookings || []).filter(b => b.clase_id === classId && b.fecha === today);

    const modal = document.createElement('div');
    modal.id = 'checkin-modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index:10000; backdrop-filter:blur(8px);';
    
    modal.innerHTML = `
        <div class="glass-card p-xl" style="width:600px; max-width:95%; max-height:90vh; overflow-y:auto;">
            <div class="flex justify-between items-center mb-lg">
                <h2 class="text-primary">${className} - ${classObj.horario.substring(0,5)}</h2>
                <button class="btn btn-secondary btn-sm" onclick="document.getElementById('checkin-modal').remove()">Cerrar</button>
            </div>
            
            <p class="mb-md text-muted">Lista de socios agendados para hoy (${today}):</p>
            
            <table class="w-full">
                <thead>
                    <tr>
                        <th class="text-left py-sm">Socio</th>
                        <th class="text-left py-sm">Estado</th>
                        <th class="text-right py-sm">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    ${bookings.length === 0 ? '<tr><td colspan="3" class="text-center py-lg text-muted">No hay socios agendados para esta clase hoy.</td></tr>' : 
                        bookings.map(b => `
                        <tr class="border-b border-white-05">
                            <td class="py-sm">${b.socio?.nombre || 'Desconocido'}</td>
                            <td class="py-sm"><span class="badge badge-${b.estado === 'Asistió' ? 'success' : b.estado === 'Cancelada' ? 'error' : 'primary'}">${b.estado || 'Confirmada'}</span></td>
                            <td class="py-sm text-right">
                                ${b.estado !== 'Asistió' ? `<button class="btn btn-primary btn-sm" onclick="performCheckIn('${b.id}', this)">Marcar Asistencia</button>` : 'COMPLETO ✅'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    document.body.appendChild(modal);
}

window.performCheckIn = async function(bookingId, btn) {
    try {
        btn.textContent = 'Procesando...';
        btn.disabled = true;

        const { error } = await supabase
            .from('reservas')
            .update({ estado: 'Asistió' })
            .eq('id', bookingId);

        if (error) throw error;

        btn.textContent = 'Asistencia OK ✅';
        btn.classList.replace('btn-primary', 'btn-success');
        
        // Refresh local data
        fetchDashboardData();
    } catch (err) {
        alert('Error al marcar asistencia: ' + err.message);
        btn.textContent = 'Marcar Asistencia';
        btn.disabled = false;
    }
};

window.showClassCheckIn = showClassCheckIn;

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

            // 2. Create Transaction record
            await supabase.from('transactions').insert([{
                socio_id: newSocio[0].id,
                amount: finalPrice,
                status: 'completed',
                description: `Suscripción inicial: ${finalPlanName} (${finalDuration} días)`
            }]);

            alert(`Socio ${nombre} creado con éxito ✅\nVencimiento: ${expiryISO}`);
            modal.remove();
            fetchDashboardData();
        } catch (err) {
            alert('Error al crear socio: ' + err.message);
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


// Membership plans logic consolidated above.


function renderEvaluations(container) {
    container.innerHTML = `
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
        
        alert('Evaluación guardada y sincronizada con el Socio ✅');
        
        // Hide form and refresh
        document.getElementById('eval-form-container').style.display = 'none';
        fetchDashboardData(); 
    } catch (err) {
        alert('Error al guardar evaluación: ' + err.message);
        console.error(err);
    }
}

// ==========================================
// ATTENDANCE & WAITLIST
// ==========================================
/* ============================================================
   MODULE: ASISTENCIA (COACH & GENERAL)
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
    const tabs = ['tab-att-gen', 'tab-att-coach', 'tab-att-rep'];
    tabs.forEach(t => {
        const el = document.getElementById(t);
        if(el) el.className = 'btn ' + (t.includes(tab.substring(0,3)) ? 'btn-primary' : 'btn-secondary');
    });
    
    const content = document.getElementById('attendance-content');
    if (!content) return;

    if (tab === 'general') renderAttendanceGeneral(content);
    else if (tab === 'coach') renderAttendanceCoachView(content);
    else if (tab === 'report') renderAttendanceReport(content);
};

function renderAttendanceGeneral(container) {
    const today = new Date().toISOString().split('T')[0];
    const bookings = (dashboardData.bookings || []).filter(b => b.fecha === today);

    container.innerHTML = `
        <div class="glass-card mb-lg">
            <div class="p-lg border-b">
                <h3>Asistencia de Hoy</h3>
                <p class="text-sm text-muted">${new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <div class="overflow-hidden">
                <table>
                    <thead>
                        <tr>
                            <th>Socio</th><th>Clase</th><th>Hora</th><th>Estado</th><th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bookings.length === 0 ? '<tr><td colspan="5" class="text-center p-lg">No hay reservas para hoy.</td></tr>' : 
                          bookings.map(b => `
                            <tr>
                                <td><strong>${b.socio?.nombre || 'Socio'}</strong></td>
                                <td>${b.clase?.nombre || 'Clase'}</td>
                                <td>${(b.clase?.horario || '').substring(0, 5)}</td>
                                <td><span class="badge ${b.estado === 'Asistió' ? 'badge-success' : 'badge-warning'}">${b.estado || 'Pendiente'}</span></td>
                                <td class="flex gap-sm">
                                    <button class="btn btn-sm btn-primary" onclick="updateAttendance('${b.id}', 'Asistió')">✓</button>
                                    <button class="btn btn-sm btn-secondary" onclick="updateAttendance('${b.id}', 'Faltó')">✕</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

window.updateAttendance = async function(id, status) {
    try {
        const { error } = await supabase.from('reservas').update({ estado: status }).eq('id', id);
        if(error) throw error;
        fetchDashboardData();
    } catch(e) { alert('Error: ' + e.message); }
};


window.updateAttendance = async function(id, status) {
    await supabase.from('reservas').update({ estado: status }).eq('id', id);
    fetchDashboardData();
};

// Consolidated waitlist function used in showSection
function renderWaitlist(container) {
    const list = dashboardData.waitlist || [];
    
    container.innerHTML = `
        <div class="glass-card">
            <div class="p-lg border-b border-white-05">
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
                    ${list.length === 0 ? '<tr><td colspan="5" class="text-center p-xl text-muted">No hay nadie en lista de espera.</td></tr>' : 
                      list.map((w, idx) => `
                        <tr>
                            <td>${new Date(w.created_at).toLocaleDateString('es-CL')}</td>
                            <td><strong>${w.socio?.nombre || 'Socio'}</strong></td>
                            <td>${w.clase?.nombre || 'Clase'} • ${(w.clase?.horario || '').substring(0,5)}</td>
                            <td><span class="badge badge-info">#${idx + 1}</span></td>
                            <td class="flex gap-sm">
                                <button class="btn btn-primary btn-sm" onclick="promoteFromWaitlist('${w.id}')">Promover</button>
                                <button class="btn btn-sm btn-outline text-error" onclick="removeFromWaitlist('${w.id}')">✕</button>
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
    // In real app, this triggers a webhook or internal notification system
};

function verEvaluacion(index) {
    const saved = JSON.parse(localStorage.getItem('aura_evaluations') || '[]');
    const ev = saved[index];
    if (!ev) return;
    alert(`📋 Evaluación de ${ev.socio} (${ev.fecha})

Peso: ${ev.peso} kg | Altura: ${ev.altura} cm | IMC: ${ev.imc}
Grasa: ${ev.grasa}% | Músculo: ${ev.musculo}% | Agua: ${ev.agua}%
──────────────────────
Cintura: ${ev.cintura} | Cadera: ${ev.cadera} | Pecho: ${ev.pecho}
Brazo D: ${ev.brazo_d} | Brazo I: ${ev.brazo_i}
Muslo D: ${ev.muslo_d} | Muslo I: ${ev.muslo_i}
──────────────────────
Nivel: ${ev.nivel} | Objetivo: ${ev.objetivo}
Observaciones: ${ev.obs || 'Ninguna'}`);
}

function eliminarEvaluacion(index) {
    if (!confirm('¿Eliminar esta evaluación?')) return;
    const saved = JSON.parse(localStorage.getItem('aura_evaluations') || '[]');
    saved.splice(index, 1);
    localStorage.setItem('aura_evaluations', JSON.stringify(saved));
    const dyn = document.getElementById('dynamic-content');
    if (dyn) renderEvaluations(dyn);
}

function updatePlanPrice(type, id, newPrice) {
    const plan = DUMMY_DATA.plans[type].find(p => p.id === id);
    if (plan) plan.price = parseInt(newPrice);
}

/* ============================================================
   MODULE: COMUNICACIÓN
============================================================ */
function renderComunicacion(container) {
    container.innerHTML = `
        <div class="glass-card p-xl mb-lg">
            <h4 class="mb-lg" style="color:var(--primary);">📣 Enviar Mensaje a Socios</h4>
            <div class="grid grid-cols-2 gap-md mb-md">
                <div>
                    <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:4px;">Destinatarios</label>
                    <select id="msg-dest" class="w-full bg-zinc-900/50 border border-white-10 rounded-lg p-md text-white">
                        <option value="todos">Todos los Socios</option>
                        <option value="activos">Solo Activos</option>
                        <option value="vencidos">Vencidos / Por Renovar</option>
                    </select>
                </div>
                <div>
                    <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:4px;">Asunto</label>
                    <input id="msg-asunto" placeholder="Asunto..." class="w-full bg-zinc-900/50 border border-white-10 rounded-lg p-md text-white">
                </div>
            </div>
            <textarea id="msg-body" rows="4" placeholder="Mensaje..." class="w-full bg-zinc-900/50 border border-white-10 rounded-lg p-md text-white mb-md"></textarea>
            <div class="flex gap-md">
                <button class="btn btn-primary" onclick="enviarMensaje()">Enviar a Supabase</button>
                <div id="msg-history" class="mt-xl w-full"></div>
            </div>
        </div>
    `;
    renderMessageHistory();
}

window.enviarMensaje = async function() {
    const dest = document.getElementById('msg-dest').value;
    const body = document.getElementById('msg-body').value;
    const asunto = document.getElementById('msg-asunto').value;
    if(!body || !asunto) return alert('Escribe algo');

    try {
        const { error } = await supabase.from('notificaciones').insert([{
            titulo: asunto,
            mensaje: body,
            tipo: dest === 'todos' ? 'global' : 'alerta'
        }]);
        if(error) throw error;
        
        const history = JSON.parse(localStorage.getItem('mensajes') || '[]');
        history.push({ titulo: asunto, date: new Date().toLocaleString() });
        localStorage.setItem('mensajes', JSON.stringify(history));
        
        alert('Enviado ✅');
        renderComunicacion(document.getElementById('dynamic-content'));
    } catch(e) { alert('Error: ' + e.message); }
};

window.aplicarTemplate = function(val) {
    const area = document.getElementById('msg-body');
    const templates = {
        renovacion: "Tu membresía vence pronto.",
        bienvenida: "Bienvenido a Aura Flow Fit."
    };
    if(templates[val]) area.value = templates[val];
};

function renderMessageHistory() {
    const history = JSON.parse(localStorage.getItem('mensajes') || '[]');
    const container = document.getElementById('msg-history');
    if(!container) return;
    container.innerHTML = history.reverse().map(m => `<div class="p-sm border-b border-white-05 text-xs text-muted">${m.date}: ${m.titulo}</div>`).join('');
}

/* ============================================================
   MODULE: CONFIGURACIÓN 
============================================================ */
function renderSettings(container) {
    const config = JSON.parse(localStorage.getItem('gym_config') || '{}');
    container.innerHTML = `
    <div class="grid grid-cols-2 gap-lg">
        <div class="glass-card p-xl">
            <h4 class="mb-lg" style="color:var(--primary);">🏢 Datos del Gimnasio</h4>
            <div class="flex flex-col gap-md">
                ${cfgInput('cfg-nombre', 'Nombre', config.nombre || 'Aura Flow Fit')}
                ${cfgInput('cfg-email', 'Email', config.email || 'hola@auraflowfit.cl')}
                <button class="btn btn-primary mt-md" onclick="guardarConfigGym()">Guardar</button>
            </div>
        </div>
    </div>`;
}

function cfgInput(id, label, value) {
    return `<div><label class="text-xs text-muted">${label}</label><input id="${id}" value="${value}" class="w-full bg-zinc-900/50 border border-white-10 p-md rounded-lg text-white"></div>`;
}

window.guardarConfigGym = function() {
    localStorage.setItem('gym_config', JSON.stringify({
        nombre: document.getElementById('cfg-nombre').value,
        email: document.getElementById('cfg-email').value
    }));
    alert('OK');
};

/* ============================================================
   INITIALIZATION & EXPORTS
============================================================ */
function initApp() {
    console.log('--- Aura Flow CRM: Initializing ---');
    
    // Register Hash Listener IMMEDIATELY
    window.addEventListener('hashchange', () => {
        const section = window.location.hash ? window.location.hash.substring(1) : 'dashboard';
        showSection(section);
    });

    // 1. Initial Data Fetch
    fetchDashboardData().then(() => {
        console.log('--- Aura Flow CRM: Data Synced ---');
        
        // 2. Initial Section Load (from Hash)
        const initialSection = window.location.hash ? window.location.hash.substring(1) : 'dashboard';
        showSection(initialSection);
        
        // 3. Remove Global Loading after data is ready
        setTimeout(() => {
            const loader = document.getElementById('global-loading');
            if (loader) {
                loader.style.transition = 'opacity 0.5s ease';
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            }
        }, 300);
    }).catch(err => {
        console.error('CRITICAL: App Initialization Failed:', err);
        // Fallback to local data if Supabase fails completely
        loadDemoData();
        showSection(window.location.hash ? window.location.hash.substring(1) : 'dashboard');
    });
}

// Execute Entry Point
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupEventListeners();
        initApp();
    });
} else {
    setupEventListeners();
    initApp();
}

// Global Exports
window.showSection = showSection;
window.fetchDashboardData = fetchDashboardData;
window.showEvalForm = showEvalForm;
window.guardarEvaluacion = guardarEvaluacion;
window.calcularIMC = calcularIMC;
window.updateAttendance = updateAttendance;
window.renderFreeTrial = renderFreeTrial;
window.renderWaitlist = renderWaitlist;
window.renderComunicacion = renderComunicacion;
window.renderSettings = renderSettings;
window.renderAttendance = renderAttendance;
window.showNewLeadForm = () => {
    window.location.hash = '#leads';
    setTimeout(() => {
        const wrap = document.getElementById('lead-form-wrap');
        if (wrap) wrap.style.display = 'block';
    }, 200);
};
window.handleLogout = () => {
    localStorage.clear();
    window.location.href = 'login.html';
};




