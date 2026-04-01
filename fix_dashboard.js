const fs = require('fs');
const file = 'dashboard/index.html';
let content = fs.readFileSync(file, 'utf8');

const marker = '        // Poll until dashboardData is available then update KPIs';
const idx = content.indexOf(marker);

if (idx >= 0) {
    const mobileToggleJS = `
        // MOBILE MENU TOGGLE
        (function() {
            var t = document.getElementById('mobile-menu-toggle');
            var s = document.getElementById('main-sidebar');
            var o = document.getElementById('sidebar-overlay');
            function openS() { if(s) s.classList.add('open'); if(o) o.classList.add('active'); document.body.style.overflow='hidden'; }
            function closeS() { if(s) s.classList.remove('open'); if(o) o.classList.remove('active'); document.body.style.overflow=''; }
            if(t) t.addEventListener('click', openS);
            if(o) o.addEventListener('click', closeS);
            document.querySelectorAll('.nav-item').forEach(function(i){
                i.addEventListener('click', function(){ if(window.innerWidth<=768) closeS(); });
            });
        })();`;

    const fixedEnd = [
        marker,
        '        let kpiPoll = setInterval(() => {',
        '            if (window.dashboardData && (window.dashboardData.leads.length > 0 || window.dashboardData.members.length > 0)) {',
        '                updateLeadsKPI();',
        '                updateChartPeriod(12);',
        '                clearInterval(kpiPoll);',
        '            }',
        '        }, 500);',
        mobileToggleJS,
        '    </script>',
        '',
        '</html>'
    ].join('\n');

    content = content.substring(0, idx) + fixedEnd;
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed! Total lines: ' + content.split('\n').length);
} else {
    console.log('Marker not found in file');
}
