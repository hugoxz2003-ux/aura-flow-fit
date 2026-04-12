/**
 * Aura Functional Guardian v2.5 (The Functional Agent)
 * Responsible for UI stability, routing integrity, and data consistency.
 * Runs 24/7 within the CRM context.
 */
class AuraFunctionalGuardian {
    constructor() {
        this.version = "2.5.FUNCT";
        this.status = "INITIALIZING";
        this.lastVerification = Date.now();
        this.errorsResolved = 0;
        
        console.log(`%c Aura Functional Guardian v${this.version} Activated `, 'background: #06B6D4; color: white; font-weight: bold;');
        
        this.init();
    }

    init() {
        // 1. Monitor Hash Changes (Routing Guard)
        window.addEventListener('hashchange', () => this.verifyRouting());
        
        // 2. Continuous Verification Loop (Heartbeat)
        setInterval(() => this.heartbeat(), 30000); // Every 30 seconds
        
        // 3. Immediate Verification
        setTimeout(() => this.verifyAll(), 2000);

        this.status = "OPERATIONAL";
        this.updatePulse();
    }

    heartbeat() {
        console.log('Nexus Heartbeat: Verifying Aura Integrity...');
        this.verifyRouting();
        this.verifyDataConsistency();
        this.lastVerification = Date.now();
        this.updatePulse();
    }

    verifyRouting() {
        const hash = window.location.hash.substring(1) || 'dashboard';
        const currentTitle = document.querySelector('.page-title')?.textContent?.toLowerCase();
        
        // If hash is 'attendance' but title is 'dashboard', routing failed
        if (hash !== 'dashboard' && currentTitle === 'dashboard') {
            console.warn(`Aura Guardian: Routing mismatch detected (#${hash} vs ${currentTitle}). Forcing sync...`);
            if (window.showSection) {
                window.showSection(hash);
                this.errorsResolved++;
            }
        }

        // Ensure active class matches hash
        document.querySelectorAll('.nav-item').forEach(nav => {
            const navHash = nav.getAttribute('href')?.substring(1);
            if (navHash === hash) {
                if (!nav.classList.contains('active')) nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });
    }

    verifyDataConsistency() {
        // Cross-check KPI vs visible charts if possible
        const kpiValue = document.querySelector('.kpi-value')?.textContent;
        if (kpiValue === '$0' && window.dashboardData?.finances?.length > 0) {
            console.warn('Aura Guardian: Data mismatch detected ($0 KPI with data present). Re-calculating...');
            if (window.updateKPIs) window.updateKPIs();
        }
    }

    updatePulse() {
        const pulse = document.getElementById('nexus-pulse');
        if (pulse) {
            pulse.title = `Nexus Pulse: ${this.status}\nGuardian v${this.version}\nLast Check: ${new Date(this.lastVerification).toLocaleTimeString()}\nErrors Resolved: ${this.errorsResolved}`;
            pulse.style.background = this.status === 'OPERATIONAL' ? '#06B6D4' : '#F43F5E';
        }
    }
}

// Global initialization
window.AuraFunctionalGuardian = new AuraFunctionalGuardian();
