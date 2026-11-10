// Google Apps Script: recibe los resultados de "Aprende +" y los guarda en una hoja de Google Sheets.
// Ver INSTRUCCIONES-GUARDADO.md para pegarlo y publicarlo.

const ADMIN_HASH = '1306ab07386c72b974e1b1e1b2e253030a251aa0e9bef2c2bdd9434626e0bd4e'; // igual que en js/auth.js
const SHEET_NAME = 'Reporte';
const HEADERS = ['Fecha', 'Asesor', 'DNI', 'Supervisor', 'Curso', 'Nota', 'Respuestas'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  // Hojas creadas antes de esta versión: agrega la columna de respuestas
  if (sh.getRange(1, HEADERS.length).getValue() === '') {
    sh.getRange(1, HEADERS.length).setValue(HEADERS[HEADERS.length - 1]).setFontWeight('bold');
  }
  // DNI y fecha como texto para que no pierdan ceros ni formato
  sh.getRange('A:A').setNumberFormat('@');
  sh.getRange('C:C').setNumberFormat('@');
  return sh;
}

function sha256_(text) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8);
  return bytes.map(b => ('0' + (b < 0 ? b + 256 : b).toString(16)).slice(-2)).join('');
}

function isAdmin_(auth) {
  if (!auth) return false;
  return sha256_(String(auth.email || '').trim().toLowerCase() + ':' + String(auth.pass || '')) === ADMIN_HASH;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function readRows_(sh) {
  const last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, HEADERS.length).getValues().map((r, i) => ({
    row: i + 2, fecha: String(r[0]), asesor: r[1], dni: String(r[2]), supervisor: r[3],
    curso: r[4], nota: r[5], respuestas: parseRespuestas_(r[6])
  }));
}

function parseRespuestas_(v) {
  if (!v) return null;
  try { return JSON.parse(String(v)); } catch (e) { return null; }
}

function doGet() {
  return json_({ ok: true, mensaje: 'Aprende + : servicio activo' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const req = JSON.parse(e.postData.contents);
    const sh = getSheet_();

    if (req.action === 'save') {
      const r = req.record;
      // Un solo intento por DNI y curso: si ya existe, no se duplica
      const exists = readRows_(sh).some(x => x.dni === String(r.dni) && x.curso === r.curso);
      if (!exists) {
        sh.appendRow([r.fecha, r.asesor, r.dni, r.supervisor, r.curso, r.nota, r.respuestas ? JSON.stringify(r.respuestas) : '']);
      }
      return json_({ ok: true });
    }

    // El asesor consulta SOLO su propia evaluación (por DNI) para ver sus respuestas
    if (req.action === 'get') {
      const mine = readRows_(sh).find(x => x.dni === String(req.dni) && x.curso === req.curso);
      return json_({ ok: true, record: mine ? {
        fecha: mine.fecha, asesor: mine.asesor, dni: mine.dni, supervisor: mine.supervisor,
        curso: mine.curso, nota: mine.nota, respuestas: mine.respuestas
      } : null });
    }

    // Todo lo demás es solo para el administrador
    if (!isAdmin_(req.auth)) return json_({ ok: false, error: 'No autorizado' });

    if (req.action === 'list') {
      // El reporte no necesita las respuestas: se quitan para aligerar la lista
      return json_({ ok: true, records: readRows_(sh).map(x => ({ row: x.row, fecha: x.fecha, asesor: x.asesor, dni: x.dni, supervisor: x.supervisor, curso: x.curso, nota: x.nota })) });
    }
    if (req.action === 'delete') {
      const row = readRows_(sh).find(x => x.dni === String(req.dni) && x.curso === req.curso && x.fecha === String(req.fecha));
      if (row) sh.deleteRow(row.row);
      return json_({ ok: true });
    }
    if (req.action === 'deleteAll') {
      if (sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1);
      return json_({ ok: true });
    }
    return json_({ ok: false, error: 'Acción no válida' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
