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

    // Protection: Redirect to login if not authenticated (except on login page itself)
    const path = window.location.pathname;
    // Handle both Vercel clean URLs (/dashboard/login) and .html paths (login.html)
    const isLoginPage = path.includes('login.html') || path.endsWith('/login') || path === '/login';

    if (!isLoginPage) {
        checkAuth();
    } else {
        // Clear redirect counter whenever we successfully land on the login page
        localStorage.removeItem(REDIRECT_COUNT_KEY);
    }
});

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    const user = USERS.find(u => u.email === email && u.pass === pass);

    if (user) {
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

        // Use absolute path so it always works (Vercel clean URLs)
        safeRedirect('/dashboard');
    } else {
        if (errorMsg) errorMsg.style.display = 'block';
    }
}

function checkAuth() {
    try {
        const sessionStr = localStorage.getItem(AUTH_KEY);
        if (!sessionStr) {
            console.warn('Aura Auth: No hay sesión activa. Redirigiendo a portal de acceso.');
            // Absolute path — works with Vercel clean URLs
            safeRedirect('/dashboard/login');
            return;
        }

        const session = JSON.parse(sessionStr);
        const now = new Date().getTime();

        // Auto-logout after 24 hours
        if (now - session.timestamp > 86400000) {
            logout();
            return;
        }

        // Apply role-based access control
        if (window.applyRoleAccess) {
            window.applyRoleAccess(session.user.role);
        }
    } catch (err) {
        console.error('Aura Auth: Error leyendo sesión:', err);
        localStorage.removeItem(AUTH_KEY);
        safeRedirect('/dashboard/login');
    }
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(REDIRECT_COUNT_KEY);
    safeRedirect('/dashboard/login');
}

function getCurrentUser() {
    const session = localStorage.getItem(AUTH_KEY);
    return session ? JSON.parse(session).user : null;
}

window.logout = logout;
window.getCurrentUser = getCurrentUser;
