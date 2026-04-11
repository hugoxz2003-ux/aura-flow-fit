/**
 * Aura Guardian v2.5 - Nexus Standard Auditor
 * Autonomous Monitoring & Self-Healing for Aura Flow Fit
 */

(function() {
    const GUARDIAN_NAME = 'Aura Guardian NEXUS';
    const HEALTH_CHECK_INTERVAL = 3000;
    
    console.info(`%c ${GUARDIAN_NAME} v2.5 Online `, 'background: #06B6D4; color: white; font-weight: bold; border-radius: 4px; padding: 2px 5px;');

    const healthStatus = {
        supabase: 'pending',
        data: 'pending',
        ui: 'pending',
        lastPulse: Date.now(),
        errors: []
    };

    // 1. Global Error Interceptor
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        const errorDetail = { msg, url, line: lineNo, col: columnNo, time: new Date().toLocaleTimeString() };
        healthStatus.errors.push(errorDetail);
        console.error(`🛡️ ${GUARDIAN_NAME} Alert:`, msg);
        updateHealthIndicator();
        return false;
    };

    // 2. Self-Healing: Stuck Loader Removal
    function healStuckLoaders() {
        const loaders = ['global-loading', 'preloader', 'loading-overlay'];
        loaders.forEach(id => {
            const el = document.getElementById(id) || document.querySelector(`.${id}`);
            if (el && window.dashboardData && (window.dashboardData.members?.length > 0 || window.dashboardData.leads?.length > 0)) {
                console.warn(`🛡️ ${GUARDIAN_NAME}: Removing stuck loader [${id}]`);
                el.style.opacity = '0';
                setTimeout(() => el.remove(), 600);
            }
        });
    }

    // 3. Continuous Pulse
    function runPulse() {
        healthStatus.lastPulse = Date.now();
        
        // Supabase Check
        healthStatus.supabase = (window.supabase && typeof window.supabase.from === 'function') ? 'OK' : 'ERROR';

        // UI Core Check
        healthStatus.ui = (typeof window.showSection === 'function') ? 'OK' : 'DEGRADED';

        // Data Check
        healthStatus.data = (window.dashboardData && (window.dashboardData.members?.length > 0 || window.dashboardData.leads?.length > 0)) ? 'ONLINE' : 'SYNCING';

        updateHealthIndicator();
        healStuckLoaders();
    }

    // 4. Interactive UI
    function injectUI() {
        if (document.getElementById('aura-guardian-pulse')) return;

        const style = document.createElement('style');
        style.textContent = `
            #aura-guardian-pulse {
                position: fixed; bottom: 20px; right: 20px;
                background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(12px);
                border: 1px solid rgba(6, 182, 212, 0.3); padding: 8px 14px;
                border-radius: 30px; color: white; font-size: 11px;
                font-family: 'Inter', sans-serif; z-index: 10005;
                display: flex; align-items: center; gap: 10px;
                cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                user-select: none;
            }
            #aura-guardian-pulse:hover {
                transform: scale(1.05) translateY(-2px);
                background: rgba(15, 23, 42, 1);
                border-color: #06B6D4;
            }
            .pulse-dot {
                width: 10px; height: 10px; border-radius: 50%;
                background: #10B981; box-shadow: 0 0 12px #10B981;
                animation: nexus-glow 2s infinite;
            }
            @keyframes nexus-glow {
                0% { opacity: 0.4; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.2); }
                100% { opacity: 0.4; transform: scale(0.8); }
            }
            .nexus-report {
                position: fixed; bottom: 70px; right: 20px;
                width: 300px; background: #0F172A; border: 1px solid #1E293B;
                border-radius: 12px; padding: 16px; color: #94A3B8;
                font-size: 12px; z-index: 10004; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);
                display: none; animation: slideUpAura 0.3s ease-out;
            }
            @keyframes slideUpAura { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);

        const pulse = document.createElement('div');
        pulse.id = 'aura-guardian-pulse';
        pulse.innerHTML = `<div class="pulse-dot"></div><span>AURA NEXUS: ACTIVE</span>`;
        pulse.onclick = toggleReport;
        document.body.appendChild(pulse);

        const report = document.createElement('div');
        report.id = 'aura-nexus-report';
        report.className = 'nexus-report';
        document.body.appendChild(report);
    }

    function toggleReport() {
        const report = document.getElementById('aura-nexus-report');
        if (report.style.display === 'block') {
            report.style.display = 'none';
        } else {
            const errList = healthStatus.errors.length > 0 
                ? healthStatus.errors.slice(-3).map(e => `<div style="color:#EF4444; margin-top:5px;">• ${e.msg}</div>`).join('') 
                : '<div style="color:#10B981; margin-top:5px;">• No errors detected</div>';

            report.innerHTML = `
                <div style="font-weight:700; color:white; margin-bottom:12px; display:flex; justify-content:between;">
                    <span>SISTEMA NEXUS v2.5</span>
                    <span style="color:#06B6D4">OK</span>
                </div>
                <div style="margin-bottom:8px;">Cloud Sync: <span style="color:${healthStatus.supabase === 'OK' ? '#10B981' : '#EF4444'}">${healthStatus.supabase}</span></div>
                <div style="margin-bottom:8px;">UI Engine: <span style="color:${healthStatus.ui === 'OK' ? '#10B981' : '#EF4444'}">${healthStatus.ui}</span></div>
                <div style="margin-bottom:12px;">Data Integrity: <span style="color:white">${healthStatus.data}</span></div>
                <div style="border-top:1px solid #1E293B; padding-top:10px;">
                    <div style="font-weight:600; font-size:10px; text-transform:uppercase;">Recent Logs:</div>
                    ${errList}
                </div>
                <button onclick="location.reload()" style="width:100%; margin-top:15px; padding:8px; background:#1E293B; border:1px solid #334155; color:white; border-radius:6px; cursor:pointer;">Resync System</button>
            `;
            report.style.display = 'block';
        }
    }

    function updateHealthIndicator() {
        const pulse = document.getElementById('aura-guardian-pulse');
        if (!pulse) return;
        
        const dot = pulse.querySelector('.pulse-dot');
        const text = pulse.querySelector('span');

        if (healthStatus.supabase === 'ERROR' || healthStatus.ui === 'DEGRADED') {
            dot.style.background = '#EF4444';
            dot.style.boxShadow = '0 0 12px #EF4444';
            text.textContent = 'AURA NEXUS: CRITICAL';
        } else if (healthStatus.data === 'SYNCING') {
            dot.style.background = '#F59E0B';
            dot.style.boxShadow = '0 0 12px #F59E0B';
            text.textContent = 'AURA NEXUS: SYNCING';
        } else {
            dot.style.background = '#10B981';
            dot.style.boxShadow = '0 0 12px #10B981';
            text.textContent = 'AURA NEXUS: ACTIVE';
        }
    }

    // Initialize
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        injectUI();
    } else {
        window.addEventListener('load', injectUI);
    }
    
    setInterval(runPulse, HEALTH_CHECK_INTERVAL);
    setTimeout(runPulse, 1000);
})();
