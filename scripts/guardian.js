/**
 * Aura Guardian v2.4 - The Master Administrator Agent
 * --------------------------------------------------
 * Role: Autonomous project administrator for Aura Flow Fit.
 * Pillars: Monitors GitHub (Sync), Vercel (Deployment), Supabase (Data).
 */

const NID_BUILD = '2026.04.11.NEXUS';
const HEALTH_CHECK_INTERVAL = 30000; // 30s probes

class AuraNexusAgent {
    constructor() {
        this.status = { github: 'pending', vercel: 'pending', supabase: 'pending' };
        this.init();
    }

    async init() {
        console.info(`%c 🛡️ AURA NEXUS AGENT v2.4 ACTIVE [Build ${NID_BUILD}] `, 'background: #06B6D4; color: #fff; font-weight: bold;');
        
        // Auto-fix for stale cache
        this.checkVersionCompatibility();
        
        // Start monitoring pulse
        this.injectUI();
        this.runPillarAudit();
        setInterval(() => this.runPillarAudit(), HEALTH_CHECK_INTERVAL);

        // Administrator "Double-Tap" shortcut (Shift + Shift)
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Shift') {
                if (this.lastShift && Date.now() - this.lastShift < 300) {
                    this.showAdminReport();
                }
                this.lastShift = Date.now();
            }
        });
    }

    checkVersionCompatibility() {
        const storedBuild = localStorage.getItem('aura_nexus_build');
        if (storedBuild && storedBuild !== NID_BUILD) {
            console.warn('Aura Nexus: Detected version mismatch. Purging stale caches...');
            localStorage.clear();
            sessionStorage.clear();
            localStorage.setItem('aura_nexus_build', NID_BUILD);
            window.location.reload();
        } else {
            localStorage.setItem('aura_nexus_build', NID_BUILD);
        }
    }

    async runPillarAudit() {
        // Pillar 1: Supabase (Data Integrity)
        try {
            if (window.supabase) {
                const { data, error } = await window.supabase.from('socios').select('count', { count: 'exact', head: true });
                this.status.supabase = error ? 'error' : 'online';
            } else {
                this.status.supabase = 'missing_sdk';
            }
        } catch (e) {
            this.status.supabase = 'error';
        }

        // Pillar 2: Vercel (Deployment Sync)
        this.status.vercel = (window.location.hostname.includes('vercel.app')) ? 'live' : 'local';

        // Pillar 3: GitHub (Code Integrity)
        // Verified by version tag presence in DOM
        const scriptTags = Array.from(document.querySelectorAll('script[src*="v23"]'));
        this.status.github = scriptTags.length > 0 ? 'synced' : 'stale';

        this.updatePulseUI();
    }

    injectUI() {
        if (document.getElementById('aura-pulse')) return;
        const pulse = document.createElement('div');
        pulse.id = 'aura-pulse';
        Object.assign(pulse.style, {
            position: 'fixed',
            bottom: '15px',
            right: '15px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#06B6D4',
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)',
            zIndex: '99999',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        });
        pulse.title = 'Aura Nexus Agent Active';
        pulse.onclick = () => this.showAdminReport();
        document.body.appendChild(pulse);
    }

    updatePulseUI() {
        const pulse = document.getElementById('aura-pulse');
        if (!pulse) return;

        const allOk = Object.values(this.status).every(s => ['online', 'live', 'synced'].includes(s));
        
        if (allOk) {
            pulse.style.backgroundColor = '#06B6D4'; // Aura Cyan
            pulse.style.boxShadow = '0 0 10px rgba(6, 182, 212, 0.8)';
        } else {
            pulse.style.backgroundColor = '#F59E0B'; // Warning Orange
            pulse.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.8)';
        }
    }

    showAdminReport() {
        const report = `
--- AURA NEXUS MASTER REPORT ---
Build: ${NID_BUILD}
Status:
- SUPABASE: ${this.status.supabase.toUpperCase()}
- VERCEL: ${this.status.vercel.toUpperCase()}
- GITHUB: ${this.status.github.toUpperCase()}
--------------------------------
        `;
        alert(report);
    }
}

// Auto-boot
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { window.AuraNexus = new AuraNexusAgent(); });
} else {
    window.AuraNexus = new AuraNexusAgent();
}
