// Auth Guard for Aura Flow Fit Member App
(function() {
    const AUTH_KEY = 'aura_client_auth';
    const path = window.location.pathname;
    
    const isLoginPage = 
        path.includes('login.html') || 
        path.endsWith('/login') || 
        document.getElementById('loginForm') !== null;

    if (!isLoginPage) {
        const sessionStr = localStorage.getItem(AUTH_KEY);
        if (!sessionStr) {
            console.warn('Aura Client Auth: No hay sesión activa. Redirigiendo a login.');
            window.location.href = '/client-app/login';
            return;
        }

        try {
            const session = JSON.parse(sessionStr);
            const now = Date.now();
            // 30 days session
            if (now - session.timestamp > 30 * 86400000) {
                localStorage.removeItem(AUTH_KEY);
                window.location.href = '/client-app/login';
            }
        } catch (e) {
            localStorage.removeItem(AUTH_KEY);
            window.location.href = '/client-app/login';
        }
    }
})();
