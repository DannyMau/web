// Guardado en la nube (Google Sheets mediante Google Apps Script)
// Pega aquí la URL de la "aplicación web" que te da Apps Script (termina en /exec).
// Si la dejas vacía, la página funciona como antes (solo guarda en este navegador).
const CLOUD_URL = 'https://script.google.com/macros/s/AKfycbz4tz_wVPGL09zJl-M9gDAeGa6G6HWw3OD0kcwph24UFMapVCQlp_7FS0aw9rSpKAoT/exec';

const PENDING_KEY = 'pendientesNube';

function cloudEnabled() {
    return CLOUD_URL.trim() !== '';
}

async function cloudPost(payload) {
    // text/plain evita el "preflight" CORS, que Apps Script no soporta
    const res = await fetch(CLOUD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'Error desconocido');
    return json;
}

// Credenciales del administrador (solo viven mientras la pestaña esté abierta)
function adminAuth() {
    return {
        email: sessionStorage.getItem('admin_email') || '',
        pass: sessionStorage.getItem('admin_pass') || ''
    };
}

// --- Envío de resultados de asesores (con reintento si falla el internet) ---
function getPending() {
    try { return JSON.parse(localStorage.getItem(PENDING_KEY)) || []; } catch (e) { return []; }
}

function cloudSave(record) {
    if (!cloudEnabled()) return;
    const pending = getPending();
    pending.push(record);
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    flushPending();
}

async function flushPending() {
    if (!cloudEnabled()) return;
    let pending = getPending();
    while (pending.length) {
        try {
            const { fecha, asesor, dni, supervisor, curso, nota, respuestas } = pending[0];
            await cloudPost({ action: 'save', record: { fecha, asesor, dni, supervisor, curso, nota, respuestas } });
        } catch (e) {
            return; // se reintenta la próxima vez que se abra la página
        }
        pending = getPending();
        pending.shift();
        localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    }
}

// Busca en la nube la evaluación (con sus respuestas) de un DNI, para verla desde cualquier dispositivo
async function cloudGetMine(dni) {
    const r = await cloudPost({ action: 'get', dni: dni, curso: COURSE_NAME });
    return r.record || null;
}

// --- Operaciones del administrador ---
async function cloudList() {
    const r = await cloudPost({ action: 'list', auth: adminAuth() });
    return r.records;
}

function cloudDelete(rec) {
    return cloudPost({ action: 'delete', auth: adminAuth(), dni: rec.dni, curso: rec.curso, fecha: rec.fecha });
}

function cloudDeleteAll() {
    return cloudPost({ action: 'deleteAll', auth: adminAuth() });
}

flushPending(); // al abrir la página, reenvía lo que haya quedado pendiente
