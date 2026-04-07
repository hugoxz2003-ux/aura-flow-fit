// Auth Logic for Aura Flow Fit CRM
const AUTH_KEY = 'aura_flow_auth';

// User roles and credentials simulation
const USERS = [
    { email: 'superadmin@auraflow.cl', pass: 'aura2026super', role: 'superadmin', name: 'Hugo Boss' },
    { email: 'admin@auraflow.cl', pass: 'aura2026admin', role: 'admin', name: 'Admin Aura' },
    { email: 'staff@auraflow.cl', pass: 'aura2026staff', role: 'staff', name: 'Staff Equipo' },
    { email: 'coach@auraflow.cl', pass: 'aura2026coach', role: 'instructor', name: 'Instructora Aura' }
];

// Failsafe: Prevent Redirect Loops
const REDIRECT_COUNT_KEY = 'aura_redirect_count';
const REDIRECT_TIME_KEY = 'aura_redirect_last_time';

function safeRedirect(targetUrl) {
    const now = Date.now();
    let count = parseInt(localStorage.getItem(REDIRECT_COUNT_KEY) || '0');
    let lastTime = parseInt(localStorage.getItem(REDIRECT_TIME_KEY) || '0');

    // Reset count if more than 10 seconds passed
    if (now - lastTime > 10000) {
        count = 0;
    }

    count++;
    localStorage.setItem(REDIRECT_COUNT_KEY, count.toString());
    localStorage.setItem(REDIRECT_TIME_KEY, now.toString());

    if (count > 3) {
        console.error('AURA_CRITICAL: Detectado bucle de redirección. Deteniendo navegación automática.');
        alert('Se detectó un problema técnico en la navegación. Por favor, limpia la caché de tu navegador o contacta a soporte.');
        localStorage.removeItem(REDIRECT_COUNT_KEY);
        return;
    }

    console.info('Aura Safe Redirect:', targetUrl);
    window.location.href = targetUrl;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Protection: Redirect to login if not authenticated (except on login page)
    const isLoginPage = window.location.pathname.includes('login.html');
    if (!isLoginPage) {
        checkAuth();
    }
});

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    const user = USERS.find(u => u.email === email && u.pass === pass);

    if (user) {
        // Save session
        const session = {
            authenticated: true,
            user: {
                email: user.email,
                role: user.role,
                name: user.name
            },
            timestamp: new Date().getTime()
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
        localStorage.removeItem(REDIRECT_COUNT_KEY); // Reset on successful login

        // Redirect to dashboard (relative to current folder)
        safeRedirect('index.html');
    } else {
        errorMsg.style.display = 'block';
    }
}

function checkAuth() {
    const sessionStr = localStorage.getItem(AUTH_KEY);
    if (!sessionStr) {
        console.warn('Aura Auth: No hay sesión activa. Redirigiendo a portal de acceso.');
        // If in dashboard or client-app, redirect to root login or local login
        const depth = window.location.pathname.split('/').length;
        const target = depth > 2 ? '../login.html' : 'login.html';
        safeRedirect(target);
        return;
    }

    const session = JSON.parse(sessionStr);
    const now = new Date().getTime();

    // Auto-logout after 24h
    if (now - session.timestamp > 86400000) {
        logout();
        return;
    }

    // Apply role-based filtering if allowed
    if (window.applyRoleAccess) {
        window.applyRoleAccess(session.user.role);
    }
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(REDIRECT_COUNT_KEY);
    safeRedirect('login.html');
}

function getCurrentUser() {
    const session = localStorage.getItem(AUTH_KEY);
    return session ? JSON.parse(session).user : null;
}

window.logout = logout;
window.getCurrentUser = getCurrentUser;

