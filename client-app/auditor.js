/**
 * Aura Guardian v1.0 - Member App Auditor Agent
 * Autonomous Monitoring & Path Protection for Aura Flow Fit PWA
 */

(function() {
    const GUARDIAN_NAME = 'Aura Guardian PWA';
    const HEALTH_CHECK_INTERVAL = 10000;
    
    console.info(`%c ${GUARDIAN_NAME} Active `, 'background: #7C3AED; color: white; font-weight: bold; padding: 2px 5px; border-radius: 4px;');

    const healthStatus = {
        connection: 'pending',
        scripts: 'pending',
        errors: []
    };

    // 1. Monitor Global Errors
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        healthStatus.errors.push({ msg, time: new Date().toISOString() });
        console.warn(`🛡️ ${GUARDIAN_NAME} Alert:`, msg);
        
        // Handle MIME type failures or script load fail
        if (msg.includes('MIME type') || msg.includes('Script error')) {
            showRecoveryBtn();
        }
        return false;
    };

    function showRecoveryBtn() {
        if (document.getElementById('guardian-recovery')) return;
        const btn = document.createElement('div');
        btn.id = 'guardian-recovery';
        btn.style = 'position:fixed; top:10px; left:10px; right:10px; background:#EF4444; color:white; padding:12px; border-radius:8px; z-index:10000; font-family:sans-serif; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.5); font-size:14px;';
        btn.innerHTML = `
            <span>⚠️ Problema de conexión detectado.</span>
            <button onclick="location.reload()" style="margin-left:10px; background:white; color:#EF4444; border:none; padding:4px 12px; border-radius:4px; font-weight:bold; cursor:pointer;">REINTENTAR</button>
        `;
        document.body.appendChild(btn);
    }

    function checkPulse() {
        // Check if client.js initialized
        if (typeof window.auraInitialized !== 'undefined' || typeof window.renderUserBookings === 'function') {
            healthStatus.scripts = 'OK';
        } else {
            healthStatus.scripts = 'FAILING';
        }
        
        // Update Indicator
        updateIndicator();
    }

    function updateIndicator() {
        // Transparent indicator for PWA to avoid blocking design
        let pulseDot = document.getElementById('pwa-health-pulse');
        if (!pulseDot) {
            pulseDot = document.createElement('div');
            pulseDot.id = 'pwa-health-pulse';
            pulseDot.style = 'position:fixed; top:5px; right:5px; width:4px; height:4px; border-radius:50%; z-index:9999; opacity:0.3;';
            document.body.appendChild(pulseDot);
        }
        
        pulseDot.style.background = healthStatus.scripts === 'OK' ? '#10B981' : '#EF4444';
    }

    setInterval(checkPulse, HEALTH_CHECK_INTERVAL);
    setTimeout(checkPulse, 2000);
})();
