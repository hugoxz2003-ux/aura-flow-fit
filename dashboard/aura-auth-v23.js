/**
 * AURA AUTH v23 - Multi-tenant Magic Link Layer
 * Handles authentication and company separation.
 */

window.handleLogin = async function(e) {
    if(e) e.preventDefault();
    const email = document.getElementById('email').value;
    const errorMsg = document.getElementById('errorMsg');
    const statusMsg = document.getElementById('statusMsg');
    const submitBtn = document.getElementById('submitBtn');

    if(!email) return;

    // Detect Company by Email Domain or Hardcoded mapping
    let companyHandle = '';
    if(email.includes('auraflow.cl')) companyHandle = '@auraflowfit';
    else if(email.includes('starfit.cl')) companyHandle = '@starfit_chile';
    else {
        alert('Email no autorizado para acceso corporativo.');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';

    const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
            emailRedirectTo: window.location.origin + '/dashboard/index.html',
            data: { company_handle: companyHandle }
        }
    });

    if (error) {
        errorMsg.textContent = error.message;
        errorMsg.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Reintentar';
    } else {
        statusMsg.style.display = 'block';
        submitBtn.textContent = 'Revisa tu Bandeja';
    }
};

window.checkSession = async function() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = '/dashboard/login.html';
        }
        return null;
    }

    // Identify Company from metadata or domain
    const email = session.user.email;
    let companyHandle = '@auraflowfit'; // Default
    if (email.includes('starfit.cl')) companyHandle = '@starfit_chile';

    // Fetch Full Company Details
    const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('handle', companyHandle)
        .single();

    if (company) {
        session.company = company;
        window.currentCompany = company;
    } else {
        console.warn('Company not found for handle:', companyHandle);
    }

    return session;
};

window.handleLogout = async function() {
    await supabase.auth.signOut();
    window.location.href = '/dashboard/login.html';
};

// Auto-run if form exists
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', window.handleLogin);
    }
});
