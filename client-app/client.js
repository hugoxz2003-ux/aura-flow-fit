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

        console.log('Client data initialized:', clientData);

        updateProfileUI();
        renderBookingClasses();
    } catch (err) {
        console.error('Error initializing client:', err);
    }
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
    const clasesRestantes = document.getElementById('profile-clases-restantes');
    const statusBadge = document.getElementById('profile-status-badge');
    const vencimientoDate = document.getElementById('profile-vencimiento-date');

    if (planName) planName.textContent = clientData.user.plan;
    if (clasesRestantes) clasesRestantes.textContent = `${clientData.user.clases_restantes} Clases disponibles`;
    if (statusBadge) {
        statusBadge.textContent = clientData.user.estado;
        statusBadge.className = `badge badge-${clientData.user.estado === 'Activo' ? 'success' : 'error'}`;
    }
    if (vencimientoDate) {
        const date = new Date(clientData.user.fecha_vencimiento);
        vencimientoDate.textContent = date.toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });
    }

    // Update Home Summary
    const homeVencimiento = document.querySelector('.stats-grid .card:last-child h4');
    if (homeVencimiento) {
        const days = Math.ceil((new Date(clientData.user.fecha_vencimiento) - new Date()) / (1000 * 60 * 60 * 24));
        homeVencimiento.textContent = `${days} días`;
    }
}

function renderBookingClasses() {
    const container = document.getElementById('booking-classes-container');
    if (!container) return;

    if (clientData.classes.length === 0) {
        container.innerHTML = '<p class="text-center p-lg">No hay clases disponibles en este momento.</p>';
        return;
    }

    container.innerHTML = clientData.classes.map(c => {
        const isFull = c.cupos_ocupados >= c.cupos_max;
        return `
            <div class="class-card-item card flex justify-between items-center ${isFull ? 'opacity-50' : ''}">
                <div>
                    <p class="time">${c.horario.substring(0, 5)}</p>
                    <p class="type">${c.nombre}</p>
                    <p class="instructor text-muted text-sm">Prof. ${c.instructor}</p>
                </div>
                ${isFull
                ? '<button class="btn btn-secondary btn-sm" disabled>Completo</button>'
                : `<button class="btn btn-primary btn-sm" onclick="handleBooking('${c.id}', '${c.nombre}', '${c.horario}')">Reservar</button>`
            }
            </div>
        `;
    }).join('');
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

    if (confirm(`¿Confirmas tu reserva para ${className} a las ${classTime.substring(0, 5)}?`)) {
        try {
            // 1. Create reservation
            const { error: resError } = await supabase
                .from('reservas')
                .insert([{
                    socio_id: clientData.user.id,
                    clase_id: classId,
                    fecha: new Date().toISOString().split('T')[0]
                }]);

            if (resError) throw resError;

            // 2. Update user's remaining classes
            const { error: userUpdateError } = await supabase
                .from('socios')
                .update({ clases_restantes: clientData.user.clases_restantes - 1 })
                .eq('id', clientData.user.id);

            if (userUpdateError) throw userUpdateError;

            // 3. Update class occupancy
            const classObj = clientData.classes.find(c => c.id === classId);
            const { error: classUpdateError } = await supabase
                .from('clases')
                .update({ cupos_ocupados: classObj.cupos_ocupados + 1 })
                .eq('id', classId);

            if (classUpdateError) throw classUpdateError;

            // Refresh data
            showNotification('¡Reserva realizada con éxito! ✅');
            initClient(); // Refresh UI

        } catch (err) {
            console.error('Error in handling booking:', err);
            showNotification('Error al realizar la reserva', 'error');
        }
    }
}

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

function simulateLoading() {
    console.log("Client PWA Initialized with Supabase integration");
}

window.handleBooking = handleBooking; // Expose to global scope
