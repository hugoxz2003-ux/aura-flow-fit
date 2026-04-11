// Auth Logic for Aura Flow Fit CRM - v2.3 (Ultra-Fortress HOTFIX)
const AUTH_KEY = 'aura_flow_auth';
const USERS = [
    { email: 'superadmin@auraflow.cl', pass: 'aura2026super', role: 'superadmin', name: 'Hugo Boss' },
    { email: 'admin@auraflow.cl', pass: 'aura2026admin', role: 'admin', name: 'Admin Aura' },
    { email: 'staff@auraflow.cl', pass: 'aura2026staff', role: 'staff', name: 'Staff Equipo' },
    { email: 'coach@auraflow.cl', pass: 'aura2026coach', role: 'instructor', name: 'Instructora Aura' }
];

const REDIRECT_COUNT_KEY = 'aura_redirect_count';
const REDIRECT_TIME_KEY = 'aura_redirect_last_time';

function safeRedirect(targetUrl) {
    const now = Date.now();
    let count = parseInt(localStorage.getItem(REDIRECT_COUNT_KEY) || '0');
    let lastTime = parseInt(localStorage.getItem(REDIRECT_TIME_KEY) || '0');

    if (now - lastTime > 10000) count = 0;
    count++;
    localStorage.setItem(REDIRECT_COUNT_KEY, count.toString());
    localStorage.setItem(REDIRECT_TIME_KEY, now.toString());

    if (count > 5) { // Increased threshold slightly for slow networks
        console.warn('Aura Fortress: Redirect loop safety triggered.', targetUrl);
        return;
    }

    console.info('Aura Redirecting:', targetUrl);
    window.location.replace(targetUrl);
}

// CRITICAL: Self-Recognition Logic
function isLoginPage() {
    const fullUrl = (window.location.pathname + window.location.search).toLowerCase();
    const hasLoginForm = document.getElementById('loginForm') !== null;
    
    // If the URL contains "login" anywhere, it IS a login page. Period.
    const detected = fullUrl.includes('login') || hasLoginForm;
    
    console.log('--- AURA AUTH CHECK (v2.3) ---');
    console.log('Normalized Path:', fullUrl);
    console.log('Is Login Page?', detected);
    
    return detected;
}

document.addEventListener('DOMContentLoaded', () => {
    if (isLoginPage()) {
        localStorage.removeItem(REDIRECT_COUNT_KEY);
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
            console.log('Aura: Login form handler active.');
        }
    } else {
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
        const session = { authenticated: true, user: { email: user.email, role: user.role, name: user.name }, timestamp: Date.now() };
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
        localStorage.removeItem(REDIRECT_COUNT_KEY);
        safeRedirect('/dashboard');
    } else {
        if (errorMsg) errorMsg.style.display = 'block';
    }
}

function checkAuth() {
    try {
        const sessionStr = localStorage.getItem(AUTH_KEY);
        if (!sessionStr) {
            console.warn('Aura Auth: No session. Redirecting to login.');
            safeRedirect('/dashboard/login');
            return;
        }
        const session = JSON.parse(sessionStr);
        if (Date.now() - session.timestamp > 86400000) {
            logout();
        } else if (window.applyRoleAccess) {
            window.applyRoleAccess(session.user.role);
        }
    } catch (err) {
        localStorage.removeItem(AUTH_KEY);
        safeRedirect('/dashboard/login');
    }
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(REDIRECT_COUNT_KEY);
    safeRedirect('/dashboard/login');
}

window.logout = logout;
window.getCurrentUser = () => {
    const session = localStorage.getItem(AUTH_KEY);
    return session ? JSON.parse(session).user : null;
};
