/**
 * Aura Flow Fit - Professional System Auditor
 * Final verification for production readiness.
 */
async function runSystemAudit() {
    console.group('%c 🕵️ AURA SYSTEM AUDITOR ', 'background: #18181B; color: #06B6D4; font-size: 1.2rem; padding: 4px; border-radius: 4px;');
    console.log('Iniciando escaneo de integridad de datos y conectividad...');

    const auditReport = {
        connectivity: { status: 'PENDING', message: '' },
        database: { status: 'PENDING', tables: {} },
        consistency: { status: 'PENDING', issues: [] },
        environment: { status: 'OK', host: window.location.hostname }
    };

    try {
        // 1. Connectivity Check
        const startTime = performance.now();
        const { data: ping, error: pingErr } = await supabase.from('socios').select('id').limit(1);
        const endTime = performance.now();
        
        if (pingErr) throw pingErr;
        auditReport.connectivity = { 
            status: 'SUCCESS', 
            message: `Latencia: ${(endTime - startTime).toFixed(0)}ms`,
            timestamp: new Date().toISOString()
        };

        // 2. Table Inventory & Integrity
        const tables = ['socios', 'clases', 'reservas', 'leads', 'pagos', 'membership_plans'];
        for (const table of tables) {
            const { data, error, count } = await supabase.from(table).select('*', { count: 'exact', head: false }).limit(5);
            if (error) {
                auditReport.database.tables[table] = { status: 'ERROR', detail: error.message };
            } else {
                auditReport.database.tables[table] = { status: 'OK', count: count, sample: data.length };
            }
        }
        auditReport.database.status = 'SUCCESS';

        // 3. Logic & Consistency Checks
        // Check 3.1: Socio Credits vs Plans
        const { data: members } = await supabase.from('socios').select('nombre, plan, clases_restantes');
        members.forEach(m => {
            if (m.clases_restantes === null || m.clases_restantes === undefined) {
                auditReport.consistency.issues.push(`Socio "${m.nombre}" no tiene créditos definidos.`);
            }
            if (!m.plan) {
                auditReport.consistency.issues.push(`Socio "${m.nombre}" no tiene plan asignado.`);
            }
        });

        // Check 3.2: Class Schedule Consistency
        const { data: classes } = await supabase.from('clases').select('name, dia, schedule');
        const validDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
        classes.forEach(c => {
            if (!validDays.includes(c.dia)) {
                auditReport.consistency.issues.push(`Clase "${c.name}" tiene un día inválido: "${c.dia}".`);
            }
        });

        if (auditReport.consistency.issues.length === 0) {
            auditReport.consistency.status = 'SUCCESS';
        } else {
            auditReport.consistency.status = 'WARNING';
        }

        // Final Verdict
        const hasErrors = auditReport.connectivity.status === 'ERROR' || 
                          Object.values(auditReport.database.tables).some(t => t.status === 'ERROR');
        
        console.log('%c RESULTADOS DE CONECTIVIDAD: ', 'font-weight: bold;', auditReport.connectivity);
        console.table(auditReport.database.tables);
        
        if (auditReport.consistency.issues.length > 0) {
            console.warn('⚠️ PROBLEMAS DE CONSISTENCIA ENCONTRADOS:', auditReport.consistency.issues);
        }

        if (!hasErrors && auditReport.consistency.status === 'SUCCESS') {
            console.log('%c 🚀 SISTEMA LISTO PARA PRODUCCIÓN Y VENTA ', 'background: #22C55E; color: white; padding: 10px; border-radius: 8px; font-weight: bold; width: 100%; text-align: center;');
        } else {
            console.error('%c ❌ EL SISTEMA REQUIERE ATENCIÓN ANTES DE PRODUCIR ', 'background: #EF4444; color: white; padding: 10px; border-radius: 8px; font-weight: bold; width: 100%; text-align: center;');
        }

    } catch (err) {
        auditReport.connectivity = { status: 'CRITICAL_FAILURE', message: err.message };
        console.error('FALLO CRÍTICO EN AUDITORÍA:', err);
    }

    console.groupEnd();
    return auditReport;
}

// Global exposure
window.runSystemAudit = runSystemAudit;

// Auto-run if requested via URL or after initial load
if (window.location.search.includes('audit=true')) {
    window.addEventListener('load', () => setTimeout(runSystemAudit, 3000));
}
