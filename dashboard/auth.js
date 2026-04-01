// Auth Logic for Aura Flow Fit CRM
const AUTH_KEY = 'aura_flow_auth';

// User roles and credentials simulation (Normally this would be in Supabase Auth,
// but we use a secure list to match the user request for "accounts and keys")
const USERS = [
    { email: 'superadmin@auraflow.cl', pass: 'aura2026super', role: 'superadmin', name: 'Hugo Boss' },
    { email: 'admin@auraflow.cl', pass: 'aura2026admin', role: 'admin', name: 'Admin Aura' },
    { email: 'staff@auraflow.cl', pass: 'aura2026staff', role: 'staff', name: 'Staff Equipo' },
    { email: 'coach@auraflow.cl', pass: 'aura2026coach', role: 'instructor', name: 'Instructora Aura' }
];


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Protection: Redirect to login if not authenticated (except on login page)
    if (!window.location.pathname.includes('login.html')) {
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

        // Redirect to dashboard
        window.location.href = 'index.html';
    } else {
        errorMsg.style.display = 'block';
    }
}

function checkAuth() {
    const sessionStr = localStorage.getItem(AUTH_KEY);
    if (!sessionStr) {
        window.location.href = 'login.html';
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
    // If we are in the dashboard folder, just redirect to login.html
    // If we are in the client-app folder, redirect to its own login or main login
    if (window.location.pathname.includes('client-app')) {
        window.location.href = 'login.html';
    } else {
        window.location.href = 'login.html';
    }
}

function getCurrentUser() {
    const session = localStorage.getItem(AUTH_KEY);
    return session ? JSON.parse(session).user : null;
}

window.logout = logout;
window.getCurrentUser = getCurrentUser;
