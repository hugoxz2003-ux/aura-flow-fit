/**
 * Aura Flow Fit - Guardian v1.2 (Fortress Edition)
 * Autonomous monitor with resilient UI injection and self-healing error stubs.
 */
(function() {
    console.info('%c Aura Guardian Fortress: ACTIVE ', 'background: #06B6D4; color: white; border-radius: 4px; padding: 2px 6px;');

    const state = { cloud: 'connecting', latency: 0, lastCheck: Date.now(), retries: 0 };

    function injectUI() {
        if (document.getElementById('aura-pulse-indicator')) return;
        if (!document.body) {
            requestAnimationFrame(injectUI);
            return;
        }

        const styles = document.createElement('style');
        styles.textContent = `
            #aura-pulse-indicator {
                position: fixed; bottom: 20px; right: 20px; width: 12px; height: 12px;
                border-radius: 50%; z-index: 2147483647; cursor: pointer;
                border: 2px solid rgba(255,255,255,0.3); box-shadow: 0 0 10px rgba(0,0,0,0.5);
                transition: transform 0.3s;
            }
            #aura-pulse-indicator:hover { transform: scale(1.3); }
            #aura-pulse-indicator.online { background: #22C55E; box-shadow: 0 0 15px #22C55EAA; }
            #aura-pulse-indicator.offline { background: #F59E0B; }
            #aura-pulse-indicator.error { background: #EF4444; }
            #aura-pulse-indicator.connecting { background: #06B6D4; animation: aura-pulse-anim 1s infinite alternate; }
            @keyframes aura-pulse-anim { from { opacity: 1; } to { opacity: 0.4; } }
        `;
        document.head.appendChild(styles);

        const pulse = document.createElement('div');
        pulse.id = 'aura-pulse-indicator';
        pulse.className = 'connecting';
        pulse.title = 'Aura Flow Fit: Sistema de Resiliencia Activo';
        document.body.appendChild(pulse);
        window.auraPulse = pulse;
    }

    async function checkHealth() {
        const start = Date.now();
        try {
            if (!window.supabase) { setCloudState('connecting'); return; }
            const { error } = await window.supabase.from('socios').select('count', { head: true });
            if (error) throw error;
            state.latency = Date.now() - start;
            setCloudState('online');
        } catch (err) {
            setCloudState('offline');
        }
    }

    function setCloudState(newState) {
        state.cloud = newState;
        if (window.auraPulse) window.auraPulse.className = newState;
    }

    // Self-Healing: Prevent ReferenceErrors
    window.showSection = window.showSection || ((t) => console.warn('Aura Guardian: showSection stubbed for', t));
    window.renderTrialList = window.renderTrialList || (() => {});

    // Boot
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectUI);
    } else {
        injectUI();
    }
    document.addEventListener('load', injectUI); // Double tap

    setInterval(checkHealth, 30000);
    setTimeout(checkHealth, 1000);
})();
