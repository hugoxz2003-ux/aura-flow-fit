// Dashboard JavaScript

// Data state
let dashboardData = {
    members: [],
    leads: [], // Still using dummy for now
    finances: [],
    classes: []
};

// Fetch real data from Supabase
async function fetchDashboardData() {
    try {
        const { data: members, error } = await supabase
            .from('socios')
            .select('*');

        if (error) throw error;
        dashboardData.members = members;

        // Fetch classes
        const { data: classes, error: errorClasses } = await supabase
            .from('clases')
            .select('*');

        if (errorClasses) throw errorClasses;
        dashboardData.classes = classes;

        // Fetch leads
        const { data: leads } = await supabase.from('leads').select('*');
        if (leads) dashboardData.leads = leads;

        // Fetch ALL Bookings
        const { data: bookings } = await supabase
            .from('reservas')
            .select('*, socio:socios(*), clase:clases(*)')
            .order('created_at', { ascending: false });

        if (bookings) dashboardData.bookings = bookings;

        // Fetch Waitlist (NEW)
        const { data: waitlist } = await supabase
            .from('lista_espera')
            .select('*, socio:socios(*), clase:clases(*)')
            .order('created_at', { ascending: true });

        dashboardData.waitlist = waitlist || [];

        console.log('Real data fetched from Supabase:', dashboardData);

        // Refresh active section
        const activeSection = document.querySelector('.nav-item.active');
        if (activeSection) {
            const sectionTarget = activeSection.getAttribute('href').substring(1);
            showSection(sectionTarget);
        }

        renderRecentBookings();
        updateKPIs();
    } catch (err) {
        console.error('Error fetching data from Supabase:', err);
    }
}

function renderRecentBookings() {
    const list = document.getElementById('recent-bookings-list');
    if (!list || !dashboardData.bookings) return;

    if (dashboardData.bookings.length === 0) {
        list.innerHTML = '<p class="p-lg text-muted text-center">No hay reservas registradas aún.</p>';
        return;
    }

    // Take last 5
    const recent = dashboardData.bookings.slice(0, 5);

    list.innerHTML = recent.map(b => `
        <div class="booking-item">
            <div class="booking-info">
                <div class="booking-avatar">${b.socio.nombre.charAt(0)}</div>
                <div class="booking-details">
                    <h4>${b.socio.nombre}</h4>
                    <p>${b.clase.nombre} • ${b.clase.horario.substring(0, 5)}</p>
                </div>
            </div>
            <div class="flex flex-col items-end">
                <span class="plan-badge plan-${b.socio.plan.toLowerCase().replace(' ', '-')}">${b.socio.plan}</span>
                <span class="text-xs text-muted mt-xs">${new Date(b.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    `).join('');
}

// Keep DUMMY for modules not yet connected
const DUMMY_DATA = {
    leads: [
        { id: 1, name: 'Juan Pérez', email: 'juan@prospecto.cl', phone: '+56912345678', source: 'Instagram', status: 'Nuevo' },
        { id: 2, name: 'Clara Soto', email: 'clara@prospecto.cl', phone: '+56987654321', source: 'Web', status: 'Contactado' },
        { id: 3, name: 'Diego Ríos', email: 'diego@prospecto.cl', phone: '+56955566677', source: 'Recomendación', status: 'Interesado' }
    ],
    finances: [
        { id: 1, concept: 'Membresía María G.', amount: 65000, type: 'Ingreso', date: '2024-02-15' },
        { id: 2, concept: 'Pago Instructor Carlos', amount: -400000, type: 'Egreso', date: '2024-02-14' },
        { id: 3, concept: 'Venta Agua Mineral', amount: 1500, type: 'Ingreso', date: '2024-02-14' }
    ]
};

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeCharts();
    setupEventListeners();
    fetchDashboardData();
    // Start at Home
    showSection('dashboard');
});

let revenueChartInstance = null;
let occupancyChartInstance = null;

function initializeCharts() {
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
                        data: [6.5, 7.2, 7.8, 8.1, 8.5, 8.9, 9.2, 8.7, 9.0, 9.5, 9.8, 9.2],
                        backgroundColor: 'rgba(6, 182, 212, 0.8)',
                        borderColor: '#06B6D4',
                        borderWidth: 2,
                        borderRadius: 8,
                    },
                    {
                        label: 'Objetivo',
                        data: [8, 8, 8.5, 8.5, 9, 9, 9.5, 9.5, 10, 10, 10.5, 10.5],
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
    }

    // Occupancy Donut Chart
    const occupancyCtx = document.getElementById('occupancyChart');
    if (occupancyCtx) {
        if (occupancyChartInstance) occupancyChartInstance.destroy();
        occupancyChartInstance = new Chart(occupancyCtx, {
            type: 'doughnut',
            data: {
                labels: ['Reformer', 'Personal', 'Grupal'],
                datasets: [{
                    data: [65, 25, 10],
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
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionTarget = this.getAttribute('href').substring(1);
            showSection(sectionTarget);

            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();
            console.log('Searching for:', searchTerm);
        });
    }

    // Mobile sidebar toggle
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('mobile-menu-toggle');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar on navigation (mobile)
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

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
            const nombre = prompt('Nombre del nuevo socio:');
            const email = prompt('Email del nuevo socio:');

            if (nombre && email) {
                try {
                    const { error } = await supabase
                        .from('socios')
                        .insert([{ nombre, email, plan: 'Plan Premium', estado: 'Activo', clases_restantes: 8 }]);

                    if (error) throw error;
                    alert('Socio registrado con éxito');
                    fetchDashboardData(); // Refresh list
                } catch (err) {
                    alert('Error al registrar socio: ' + err.message);
                }
            }
        }
    });
}

function showSection(sectionId) {
    const mainContent = document.querySelector('.main-content');
    const pageTitle = document.querySelector('.page-title');
    const kpiGrid = document.querySelector('.kpi-grid');
    const chartsRow = document.querySelector('.charts-row');
    const alertsSection = document.querySelector('.alerts-section');
    const todayClasses = document.querySelector('.today-classes-section');

    // Remove any existing dynamic content
    const existingDynamic = document.getElementById('dynamic-content');
    if (existingDynamic) existingDynamic.remove();

    if (sectionId === 'dashboard') {
        kpiGrid.style.display = 'grid';
        chartsRow.style.display = 'grid';
        alertsSection.style.display = 'block';
        todayClasses.style.display = 'block';
        pageTitle.textContent = 'Dashboard';
        renderTodayClasses();
        updateKPIs();

        // Re-initialize charts to fix "shifted" or zero-size issues when switching views
        setTimeout(initializeCharts, 100);
        return;
    }

    // ... other functions ...

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
        // Update Active Members KPI
        const activeMembers = dashboardData.members.filter(m => m.estado === 'Activo').length;
        const membersKpi = document.querySelector('.kpi-card:nth-child(2) .kpi-value');
        if (membersKpi) membersKpi.textContent = activeMembers;
    }

    // Hide dashboard elements
    kpiGrid.style.display = 'none';
    chartsRow.style.display = 'none';
    alertsSection.style.display = 'none';
    todayClasses.style.display = 'none';

    // Create dynamic content area
    const dynamicContent = document.createElement('div');
    dynamicContent.id = 'dynamic-content';
    mainContent.appendChild(dynamicContent);

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
        case 'waitlist':
            pageTitle.textContent = 'Lista de Espera';
            renderWaitlist(dynamicContent);
            break;
        default:
            pageTitle.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
            dynamicContent.innerHTML = `<div class="card p-xl flex flex-col items-center justify-center">
                <p class="text-xl mb-md">Módulo ${sectionId} en construcción</p>
                <div class="spinner"></div>
            </div>`;
    }
}

function renderMembers(container) {
    container.innerHTML = `
        <div class="glass-card">
            <div class="p-md flex justify-between items-center border-b border-white-05">
                <h3>Lista de Socios</h3>
                <button class="btn btn-primary btn-sm">+ Nuevo Socio</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Socio</th>
                        <th>Plan</th>
                        <th>Vencimiento</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${dashboardData.members.length === 0 ? '<tr><td colspan="4" class="text-center p-lg">Cargando socios...</td></tr>' :
            dashboardData.members.map(m => `
                        <tr>
                            <td>
                                <div class="flex items-center gap-sm">
                                    <img src="https://ui-avatars.com/api/?name=${m.nombre}&background=random" class="user-avatar">
                                    <span>${m.nombre}</span>
                                </div>
                            </td>
                            <td class="text-xs">
                                <span class="plan-badge plan-${m.plan.toLowerCase().replace(' ', '-')}">${m.plan}</span>
                            </td>
                            <td>${new Date(m.fecha_vencimiento).toLocaleDateString('es-CL')}</td>
                            <td><span class="badge badge-${m.estado === 'Activo' ? 'success' : m.estado === 'Vencido' ? 'error' : 'warning'}">${m.estado}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderLeads(container) {
    const statuses = ['Nuevo', 'Contactado', 'Interesado', 'Convertido'];
    container.innerHTML = `
        <div class="grid grid-cols-4 gap-lg">
            ${statuses.map(s => `
                <div class="kanban-col">
                    <h4 class="mb-lg uppercase text-xs text-muted font-700">${s}</h4>
                    ${dashboardData.leads.filter(l => l.status === s || (s === 'Nuevo' && l.status === 'Nuevo')).length === 0
            ? '<p class="text-xs text-muted p-md">Sin leads</p>'
            : dashboardData.leads.filter(l => l.status === s || (s === 'Nuevo' && l.status === 'Nuevo')).map(l => `
                        <div class="card mb-md p-md hover-glow">
                            <p class="font-600">${l.name || l.nombre}</p>
                            <p class="text-xs text-muted mb-sm">${l.source || 'Directo'}</p>
                            <span class="badge badge-info">${l.phone || l.email}</span>
                        </div>
                    `).join('')}
                    <button class="btn btn-secondary btn-sm w-full">+ Añadir</button>
                </div>
            `).join('')}
        </div>
    `;
}

function renderFinances(container) {
    container.innerHTML = `
        <div class="grid grid-cols-3 gap-lg mb-lg">
            <div class="card p-lg text-center"><p class="text-muted text-xs">Ingresos</p><h3 class="text-success">$9,245,000</h3></div>
            <div class="card p-lg text-center"><p class="text-muted text-xs">Egresos</p><h3 class="text-error">$4,120,000</h3></div>
            <div class="card p-lg text-center"><p class="text-muted text-xs">Utilidad</p><h3 class="text-primary">$5,125,000</h3></div>
        </div>
        <div class="glass-card">
            <table>
                <thead><tr><th>Fecha</th><th>Concepto</th><th>Monto</th><th>Estado</th></tr></thead>
                <tbody>
                    ${DUMMY_DATA.finances.map(f => `
                        <tr>
                            <td>${f.date}</td>
                            <td>${f.concept}</td>
                            <td class="${f.type === 'Ingreso' ? 'text-success' : 'text-error'} font-700">${f.amount > 0 ? '+' : ''}${formatCurrency(f.amount)}</td>
                            <td><span class="badge badge-success">Pagado</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderCalendar(container) {
    container.innerHTML = `
        <div class="glass-card p-xl text-center">
            <h3 class="mb-md">📆 Calendario de Clases</h3>
            <p class="text-muted mb-lg">Visualización semanal de disponibilidad y reservas.</p>
            <div class="grid grid-cols-7 gap-sm">
                ${['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map(d => `
                    <div class="card p-sm bg-tertiary">
                        <p class="text-xs font-700">${d}</p>
                        <div class="mt-md flex flex-col gap-xs">
                            <div class="badge badge-success" style="font-size: 8px">9:00 Reformer</div>
                            <div class="badge badge-info" style="font-size: 8px">11:00 Personal</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

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
    if (confirm(`¿Confirmar asistencia para ${className}?`)) {
        // Here we would typically update a 'asistencia' table or decrement 'cupos_ocupados' if needed
        // For simplicity, we just notify and log. In a real app, this would be more complex.
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

window.handleCheckIn = handleCheckIn;
window.promoteFromWaitlist = promoteFromWaitlist;
window.removeFromWaitlist = removeFromWaitlist;
window.showSection = showSection;
