/**
 * DASHBOARD SaaS - Social CRM Logic
 * Handles multi-tenant views and AI Content Planner
 */

let dashboardData = {
    members: [],
    leads: [],
    socialPosts: [],
    company: null
};

async function initDashboard() {
    console.log('Initializing Dashboard...');
    const session = await window.checkSession();
    if (!session) return;

    dashboardData.company = session.company;
    updateUIHeader();
    await fetchTenantData();
}

async function fetchTenantData() {
    if (!dashboardData.company) return;
    const companyId = dashboardData.company.id;
    
    // Parallel Fetch with separation
    try {
        const [membersRes, leadsRes, socialRes] = await Promise.all([
            supabase.from('socios').select('*').eq('company_id', companyId),
            supabase.from('leads').select('*').eq('company_id', companyId),
            supabase.from('social_posts').select('*').eq('company_id', companyId).order('scheduled_at', { ascending: true })
        ]);

        dashboardData.members = membersRes.data || [];
        dashboardData.leads = leadsRes.data || [];
        dashboardData.socialPosts = socialRes.data || [];

        refreshKPIs();
        
        // Auto-render if on social hash
        if (window.location.hash === '#social') {
            window.renderSocialModule();
        }
    } catch (err) {
        console.error('Error fetching tenant data:', err);
    }
}

function updateUIHeader() {
    const greeting = document.getElementById('greeting');
    const companyEl = document.getElementById('current-company');
    const userDisplay = document.getElementById('user-display');

    if (dashboardData.company) {
        if (greeting) greeting.textContent = `Gestión: ${dashboardData.company.name}`;
        if (companyEl) companyEl.textContent = dashboardData.company.handle;
        if (userDisplay) userDisplay.textContent = dashboardData.company.handle.replace('@', '');
        
        // Apply Brand Color
        const primary = dashboardData.company.brand_style.primary_color || '#06B6D4';
        document.documentElement.style.setProperty('--primary', primary);
    }
}

function refreshKPIs() {
    if (document.getElementById('kpi-members')) document.getElementById('kpi-members').textContent = dashboardData.members.length;
    if (document.getElementById('planned-posts')) document.getElementById('planned-posts').textContent = dashboardData.socialPosts.length;
    if (document.getElementById('db-status')) {
        document.getElementById('db-status').innerHTML = '<span class="badge badge-success">Online</span>';
    }
}

// SOCIAL MEDIA PLANNER RENDERER
window.renderSocialModule = function() {
    const container = document.getElementById('dynamic-content');
    if (!container) return;
    container.style.display = 'block';
    
    container.innerHTML = `
        <div class="glass-card p-xl mb-lg" style="background: rgba(24, 24, 27, 0.4); border-radius: 20px; padding: 2rem; border: 1px solid rgba(255,255,255,0.05);">
            <div class="flex justify-between items-center mb-xl" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div>
                    <h2 style="font-family: Outfit; font-size: 1.8rem; margin: 0;">Calendario Social AI</h2>
                    <p class="text-muted" style="color: rgba(255,255,255,0.5);">Estrategia optimizada para ${dashboardData.company.name}</p>
                </div>
                <button class="btn btn-primary" onclick="generateAISuggestions()" style="background: var(--primary); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer;">
                    ✨ Generar Plan Mensual
                </button>
            </div>

            <div class="grid grid-cols-7 gap-sm mb-lg" id="calendar-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px;">
                <!-- Posts will be injected here -->
            </div>
        </div>
    `;

    renderCalendar();
};

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    if(!grid) return;
    grid.innerHTML = '';

    // Render next 7 days
    for(let i=0; i<7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayPosts = dashboardData.socialPosts.filter(p => p.scheduled_at.startsWith(dateStr));
        
        grid.innerHTML += `
            <div class="glass-card p-md" style="min-height: 150px; background: rgba(255,255,255,0.03); border-radius: 12px; padding: 1rem; border: 1px solid rgba(255,255,255,0.02);">
                <p style="font-size: 0.7rem; font-weight: 700; opacity: 0.6; margin-bottom: 0.5rem; text-transform: uppercase;">
                    ${date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                </p>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    ${dayPosts.length > 0 ? dayPosts.map(p => `
                        <div class="badge badge-info" style="font-size: 9px; cursor:pointer; padding: 4px 8px; background: rgba(6,182,212,0.1); color: #06B6D4; border-radius: 4px;" onclick="viewPost('${p.id}')">
                            [${p.content_type}] ${p.title}
                        </div>
                    `).join('') : '<p style="font-size: 0.6rem; color: rgba(255,255,255,0.2);">Sin programar</p>'}
                </div>
            </div>
        `;
    }
}

window.generateAISuggestions = async function() {
    if(!dashboardData.company) return;
    if(!confirm('¿Generar nueva estrategia de contenido optimizada para ' + dashboardData.company.handle + '?')) return;
    
    // In production, this would call an Edge Function or GPT API
    // For now, we seed a sample post to demonstrate functionality
    const industryVibe = dashboardData.company.brand_style.vibe || 'Moderna';
    
    const newPost = {
        company_id: dashboardData.company.id,
        title: `Tendencias ${industryVibe} 2026`,
        content_type: 'Reel',
        scheduled_at: new Date(Date.now() + 86400000).toISOString(),
        status: 'Draft',
        caption: 'Optimizado para máximo alcance orgánico. #AuraFlowFit #SocialCRM'
    };

    const { error } = await supabase.from('social_posts').insert([newPost]);
    
    if(!error) {
        alert('¡Estrategia generada! Sincronizando calendario...');
        await fetchTenantData();
        renderSocialModule();
    } else {
        console.error('Error inserting post:', error);
        alert('Error al guardar en base de datos. Asegúrate de haber corrido SOCIAL_CRM_SETUP.sql');
    }
};

window.showSection = function(section) {
    if(section === 'social') {
        window.renderSocialModule();
    } else {
        const dynamic = document.getElementById('dynamic-content');
        if (dynamic) dynamic.style.display = 'none';
        // Original dashboard view is static in index.html
    }
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById('nav-' + section)?.classList.add('active');
};

// Initialize
document.addEventListener('DOMContentLoaded', initDashboard);
window.addEventListener('hashchange', () => {
    const section = window.location.hash.substring(1) || 'dashboard';
    showSection(section);
});
