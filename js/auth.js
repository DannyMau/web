// Login de asesor y acceso de administrador
// --- 1. LÓGICA DE LOGIN ---
// Si el DNI ya rindió la evaluación, devuelve ese registro (para ingresar solo con el DNI)
function findRecordByDni(dni) {
    return getRecords().find(r => r.dni === dni && r.curso === COURSE_NAME) || null;
}

// Sincroniza con la nube el registro de un DNI (así ve sus respuestas desde cualquier dispositivo).
// Sin internet se usa lo guardado en este navegador.
const cloudSyncCache = {};
function syncRecordFromCloud(dni) {
    if (!cloudEnabled()) return Promise.resolve();
    if (!cloudSyncCache[dni]) {
        cloudSyncCache[dni] = (async () => {
            try {
                const remote = await cloudGetMine(dni);
                const mine = r => r.dni === dni && r.curso === COURSE_NAME;
                const localRec = getRecords().find(mine);
                let records = getRecords().filter(r => !mine(r));
                if (remote) {
                    if (!remote.respuestas && localRec && localRec.respuestas) remote.respuestas = localRec.respuestas;
                    records.push(remote);
                } else if (localRec && getPending().some(mine)) {
                    records.push(localRec); // aún no se subió a la nube: se conserva
                }
                localStorage.setItem('reporteEvaluaciones', JSON.stringify(records));
            } catch (e) { /* sin conexión */ }
        })();
    }
    return cloudSyncCache[dni];
}

// Muestra u oculta nombre y supervisor según el DNI escrito
function onDniInput() {
    const dni = document.getElementById('input-dni').value.trim();
    const rec = dni.length === 8 ? findRecordByDni(dni) : null;
    const name = document.getElementById('input-name');
    const sup = document.getElementById('input-supervisor');
    const msg = document.getElementById('login-returning');
    document.getElementById('field-name').classList.toggle('hidden', !!rec);
    document.getElementById('field-supervisor').classList.toggle('hidden', !!rec);
    name.required = !rec;
    sup.required = !rec;
    msg.classList.toggle('hidden', !rec);
    if (rec) msg.textContent = 'Hola, ' + rec.asesor + '. Ya tienes una evaluación registrada: ingresa solo con tu DNI para ver tus resultados.';
}
document.getElementById('input-dni').addEventListener('input', () => {
    onDniInput();
    const dni = document.getElementById('input-dni').value.trim();
    if (dni.length === 8) {
        syncRecordFromCloud(dni).then(() => {
            if (document.getElementById('input-dni').value.trim() === dni) onDniInput();
        });
    }
});

async function handleLogin(event) {
    event.preventDefault();
    const dni = document.getElementById('input-dni').value.trim();
    const btn = event.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    // Espera (máx. 8 s) a confirmar en la nube si este DNI ya rindió la evaluación
    await Promise.race([syncRecordFromCloud(dni), new Promise(r => setTimeout(r, 8000))]);
    btn.disabled = false;
    const rec = findRecordByDni(dni);
    const name = rec ? rec.asesor : document.getElementById('input-name').value.trim();
    const supervisor = rec ? rec.supervisor : document.getElementById('input-supervisor').value;

    sessionStorage.setItem('asesor_nombre', name);
    sessionStorage.setItem('asesor_dni', dni);
    sessionStorage.setItem('asesor_supervisor', supervisor);

    updateUIWithUserData();
    restoreProgress();
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-platform').classList.remove('hidden');
    saveView('main');
}

function updateUIWithUserData() {
    const name = sessionStorage.getItem('asesor_nombre') || 'PEDRO DANIEL';
    const dni = sessionStorage.getItem('asesor_dni') || '73894390';

    document.getElementById('display-name').innerText = name;
    document.getElementById('display-dni').innerText = `DNI: ${dni}`;

    const nameParts = name.split(' ');
    const banner = document.getElementById('banner-greeting');
    banner.textContent = '¡Hola ' + nameParts[0];
    if (nameParts.length > 1) {
        banner.appendChild(document.createElement('br'));
        banner.appendChild(document.createTextNode(nameParts[1]));
    }
    banner.appendChild(document.createTextNode('!'));
}

function logout() {
    sessionStorage.clear();
    window.location.reload();
}

// --- ACCESO ADMINISTRADOR ---
// La clave no se guarda en texto plano: solo su huella (SHA-256).
const ADMIN_HASH = "1306ab07386c72b974e1b1e1b2e253030a251aa0e9bef2c2bdd9434626e0bd4e";
let isAdmin = false;

async function sha256(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function toggleAdminLogin() {
    document.getElementById('admin-form').classList.toggle('hidden');
}

async function adminLogin(event) {
    event.preventDefault();
    const email = document.getElementById('admin-email').value.trim().toLowerCase();
    const pass = document.getElementById('admin-pass').value;
    let hash;
    try {
        hash = await sha256(email + ':' + pass);
    } catch (e) {
        alert('Tu navegador no permite validar el acceso en este modo. Abre la página con Chrome o desde un enlace https.');
        return;
    }
    if (hash !== ADMIN_HASH) {
        alert('Correo o contraseña incorrectos.');
        return;
    }
    isAdmin = true;
    sessionStorage.setItem('es_admin', '1');
    sessionStorage.setItem('admin_email', email);
    sessionStorage.setItem('admin_pass', pass); // para leer el reporte de la nube
    sessionStorage.setItem('asesor_nombre', 'Administrador');
    sessionStorage.setItem('asesor_dni', '--');
    sessionStorage.setItem('asesor_supervisor', '--');
    updateUIWithUserData();
    document.getElementById('btn-admin-report').classList.remove('hidden');
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-platform').classList.remove('hidden');
    saveView('main');
}

function adminLogout() {
    sessionStorage.clear();
    window.location.reload();
}
