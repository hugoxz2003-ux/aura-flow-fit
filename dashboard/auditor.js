/**
 * Aura Guardian v1.0 - Dashboard Auditor Agent
 * Autonomous Monitoring & Self-Healing for Aura Flow Fit
 */

(function() {
    const GUARDIAN_NAME = 'Aura Guardian';
    const HEALTH_CHECK_INTERVAL = 5000;
    
    console.info(`%c ${GUARDIAN_NAME} Activated `, 'background: #10B981; color: white; font-weight: bold; border-radius: 4px; padding: 2px 5px;');

    const healthStatus = {
        supabase: 'pending',
        data: 'pending',
        ui: 'pending',
        errors: []
    };

    // 1. Monitor Global Errors
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        const errorDetail = { msg, url, line: lineNo, col: columnNo, time: new Date().toISOString() };
        healthStatus.errors.push(errorDetail);
        console.error(`🛡️ ${GUARDIAN_NAME} Detected Crash:`, msg);
        
        // Self-Healing Attempt: If it's a ReferenceError for a core function, try to stub it
        if (msg.includes('ReferenceError') && msg.includes('render')) {
            const funcName = msg.split("'")[1];
            if (funcName && !window[funcName]) {
                console.warn(`🛡️ ${GUARDIAN_NAME} Self-Repair: Stubbing missing function ${funcName}`);
                window[funcName] = () => console.warn(`${funcName} is unavailable, please reload.`);
            }
        }
        
        showGuardianOverlay(msg);
        return false;
    };

    // 2. Continuous Health Pulse
    function runPulse() {
        // Check Supabase
        if (window.supabase) {
            healthStatus.supabase = 'OK';
        } else {
            healthStatus.supabase = 'ERROR';
            console.error(`🛡️ ${GUARDIAN_NAME}: Supabase connection lost!`);
        }

        // Check Logic Presence
        if (typeof window.showSection === 'function' && typeof window.renderMembers === 'function') {
            healthStatus.ui = 'OK';
        } else {
            healthStatus.ui = 'DEGRADED';
        }

        // Check Data
        if (window.dashboardData && (window.dashboardData.members?.length > 0 || window.dashboardData.leads?.length > 0)) {
            healthStatus.data = 'OK';
        } else {
            healthStatus.data = 'WAITING';
        }

        updateHealthIndicator();
    }

    // 3. UI Health Indicator (The Heartbeat)
    function injectUI() {
        const style = document.createElement('style');
        style.textContent = `
            #aura-guardian-pulse {
                position: fixed;
                bottom: 15px;
                right: 15px;
                background: rgba(15, 23, 42, 0.8);
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255,255,255,0.1);
                padding: 6px 12px;
                border-radius: 20px;
                color: white;
                font-size: 10px;
                font-family: sans-serif;
                z-index: 9999;
                display: flex;
                items-center;
                gap: 8px;
                cursor: help;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            }
            .pulse-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #10B981;
                box-shadow: 0 0 10px #10B981;
                animation: aura-glow 2s infinite;
            }
            @keyframes aura-glow {
                0% { opacity: 0.5; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.1); }
                100% { opacity: 0.5; transform: scale(0.8); }
            }
        `;
        document.head.appendChild(style);

        const pulse = document.createElement('div');
        pulse.id = 'aura-guardian-pulse';
        pulse.title = 'Aura Guardian: Sistema Protegido';
        pulse.innerHTML = `
            <div class="pulse-dot"></div>
            <span>AURA PULSE: ACTIVE</span>
        `;
        document.body.appendChild(pulse);
    }

    function updateHealthIndicator() {
        const pulse = document.getElementById('aura-guardian-pulse');
        if (!pulse) return;
        
        const dot = pulse.querySelector('.pulse-dot');
        if (healthStatus.supabase === 'ERROR' || healthStatus.ui === 'DEGRADED') {
            dot.style.background = '#EF4444';
            dot.style.boxShadow = '0 0 10px #EF4444';
            pulse.querySelector('span').textContent = 'AURA PULSE: CRITICAL';
        } else if (healthStatus.data === 'WAITING' || healthStatus.supabase === 'pending') {
            dot.style.background = '#F59E0B';
            dot.style.boxShadow = '0 0 10px #F59E0B';
            pulse.querySelector('span').textContent = 'AURA PULSE: IDLE';
        } else {
            dot.style.background = '#10B981';
            dot.style.boxShadow = '0 0 10px #10B981';
            pulse.querySelector('span').textContent = 'AURA PULSE: ACTIVE';
        }
    }

    function showGuardianOverlay(errorMsg) {
        if (document.getElementById('guardian-crash-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.id = 'guardian-crash-overlay';
        overlay.style = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:10000; color:white; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; text-align:center; font-family:sans-serif;';
        overlay.innerHTML = `
            <h1 style="color:#EF4444; margin-bottom:10px;">🛡️ Aura Guardian Intercept</h1>
            <p style="margin-bottom:20px;">Se ha detectado un error crítico que podría afectar la estabilidad.</p>
            <div style="background:#1E293B; padding:15px; border-radius:8px; font-family:monospace; font-size:12px; margin-bottom:25px; max-width:600px; text-align:left; border-left:4px solid #EF4444;">
                ${errorMsg}
            </div>
            <div style="display:flex; gap:10px;">
                <button onclick="location.reload()" style="padding:10px 20px; background:#06B6D4; color:white; border:none; border-radius:5px; cursor:pointer;">Reiniciar Aplicación</button>
                <button onclick="this.parentElement.parentElement.remove()" style="padding:10px 20px; background:#475569; color:white; border:none; border-radius:5px; cursor:pointer;">Continuar de todos modos</button>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    // Launch
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        injectUI();
    } else {
        window.addEventListener('load', injectUI);
    }
    
    setInterval(runPulse, HEALTH_CHECK_INTERVAL);
    setTimeout(runPulse, 1000); // Initial check
    
})();
