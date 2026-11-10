// Reporte de evaluaciones (ventana independiente)
// --- REPORTE: PÁGINA INDEPENDIENTE (solo lectura, solo eliminar) ---
function getRecords() {
    return JSON.parse(localStorage.getItem('reporteEvaluaciones')) || [];
}

// Registros que se muestran en el reporte (de la nube si está activada, si no, locales)
let reportRecords = [];

async function loadReportRecords() {
    if (!cloudEnabled()) {
        reportRecords = getRecords();
        return;
    }
    try {
        reportRecords = await cloudList();
    } catch (e) {
        reportRecords = [];
        alert('No se pudo leer el reporte de la nube: ' + e.message);
    }
}

async function refreshReport() {
    await loadReportRecords();
    renderReportTable();
}

function openReportWindow() {
    document.getElementById('profile-menu').classList.add('hidden');
    renderReportTable();
    refreshReport();
    document.getElementById('main-platform').classList.add('hidden');
    document.getElementById('report-view').classList.remove('hidden');
    saveView('report');
    window.scrollTo(0, 0);
}

function closeReportView() {
    document.getElementById('report-view').classList.add('hidden');
    document.getElementById('main-platform').classList.remove('hidden');
    saveView('main');
}

function makeCell(className, text) {
    const td = document.createElement('td');
    td.className = className;
    td.textContent = text;
    return td;
}

function renderReportTable() {
    const records = reportRecords;
    const tbody = document.getElementById('report-table-body');
    tbody.innerHTML = '';

    if (records.length === 0) {
        const tr = document.createElement('tr');
        const td = makeCell('text-center py-8 text-gray-500 font-medium', 'No hay registros guardados aún.');
        td.colSpan = 7;
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    records.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.className = 'bg-white border-b hover:bg-gray-50 transition';
        tr.appendChild(makeCell('px-4 py-3 whitespace-nowrap text-sm text-gray-500', row.fecha));
        tr.appendChild(makeCell('px-4 py-3 text-base font-medium text-gray-800', row.asesor));
        tr.appendChild(makeCell('px-4 py-3 text-base text-gray-600', row.dni));
        tr.appendChild(makeCell('px-4 py-3 text-base text-gray-600', row.supervisor));
        tr.appendChild(makeCell('px-4 py-3 text-sm text-gray-600', row.curso));
        tr.appendChild(makeCell('px-4 py-3 text-center text-base font-bold text-green-700', row.nota));

        const btn = document.createElement('button');
        btn.className = 'text-red-500 hover:text-red-700 transition p-2';
        btn.title = 'Eliminar';
        btn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        btn.addEventListener('click', () => deleteRow(index));
        const td = document.createElement('td');
        td.className = 'px-4 py-3 text-center';
        td.appendChild(btn);
        tr.appendChild(td);

        const labels = ['Fecha', 'Asesor', 'DNI', 'Supervisor', 'Curso', 'Nota', 'Acciones'];
        Array.from(tr.children).forEach((cell, k) => cell.setAttribute('data-label', labels[k] || ''));

        tbody.appendChild(tr);
    });
}

async function deleteRow(index) {
    if (!confirm('¿Seguro que deseas eliminar este registro? El asesor podrá volver a rendir la evaluación.')) return;
    const rec = reportRecords[index];
    try {
        if (cloudEnabled()) await cloudDelete(rec);
        // También se quita del navegador local para que el asesor pueda volver a rendir
        const local = getRecords().filter(r => !(r.dni === rec.dni && r.curso === rec.curso));
        localStorage.setItem('reporteEvaluaciones', JSON.stringify(local));
    } catch (e) {
        alert('No se pudo eliminar: ' + e.message);
        return;
    }
    refreshReport();
}

async function deleteAllRows() {
    const total = reportRecords.length;
    if (total === 0) {
        alert('No hay registros para borrar.');
        return;
    }
    if (confirm('¿Seguro que deseas borrar TODOS los registros (' + total + ')? Esta acción no se puede deshacer y los asesores podrán volver a rendir la evaluación.')) {
        try {
            if (cloudEnabled()) await cloudDeleteAll();
            localStorage.removeItem('reporteEvaluaciones');
        } catch (e) {
            alert('No se pudo borrar: ' + e.message);
            return;
        }
        refreshReport();
    }
}

function exportTableToExcel() {
    const records = reportRecords;
    if (records.length === 0) {
        alert('Aún no hay registros para exportar.');
        return;
    }
    const q = v => '"' + String(v).replace(/"/g, '""') + '"';
    let csvContent = '\uFEFF'; // BOM
    csvContent += 'Fecha,Asesor,DNI,Supervisor,Curso,Calificación\n';
    records.forEach(row => {
        csvContent += [row.fecha, row.asesor, row.dni, row.supervisor, row.curso, row.nota].map(q).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Reporte_Capacitaciones.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
