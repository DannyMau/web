// Datos del curso, preguntas, progreso y resultados
const COURSE_NAME = "PROTOCOLO ATENCIÓN VAS";

// Preguntas y respuestas correctas (se usan para mostrar los resultados)
// Nota máxima de la evaluación: se reparte en partes iguales entre todas las preguntas.
const MAX_SCORE = 20;

const QUESTIONS = [
    {
        id: 'q1',
        text: '1. ¿Cuál es el primer paso cuando un cliente consulta por un cobro VAS?',
        options: { a: 'Bloquear el servicio inmediatamente', b: 'Identificar y explicar el cobro al cliente', c: 'Generar devolución automática', d: 'escalar el caso al supervisor' },
        correct: 'b'
    },
    {
        id: 'q2',
        text: '2. ¿En cuántas líneas debe aplicarse el bloqueo del servicio VAS?',
        options: { a: 'En todas las líneas del cliente', b: 'Solo en la línea que reclama', c: 'Solo en líneas activas', d: 'En la línea principal' },
        correct: 'a'
    },
    {
        id: 'q3',
        text: '3. ¿Qué debe explicar el asesor al cliente sobre los servicios VAS?',
        options: { a: 'Solo el precio del servicio', b: 'Qué son las suscripciones, cómo se activan y cómo se cobran', c: 'Solo la empresa que brinda el servicio', d: 'Solo el tiempo de activación' },
        correct: 'b'
    },
    {
        id: 'q4',
        text: '4. ¿Por qué es importante bloquear los servicios VAS en todas las líneas del cliente?',
        options: { a: 'Para evitar futuras suscripciones VAS', b: 'Para generar un nuevo cobro', c: 'Para incrementar futuras suscripciones VAS', d: 'N.A' },
        correct: 'a'
    },
    {
        id: 'q5',
        text: '5. Durante la validación antes de realizar un ajuste en Siebel, el asesor detecta que el cliente ya recibió una Nota de Crédito previa por la misma suscripción de entretenimiento hace un mes. El cliente solicita nuevamente la devolución del mismo monto. ¿Qué directriz del protocolo debe seguir el asesor?',
        options: { a: 'No duplicar el ajuste, ya que se debe verificar en Siebel si el cliente ya recibió previamente una OCC o NC por el mismo concepto.', b: 'Registrar el caso como un reclamo formal ante OSISEL sin revisar el historial de transacciones en Siebel.', c: 'Proceder con un nuevo ajuste inmediato para mantener la satisfacción del cliente sin importar los registros pasados.', d: 'Derivar el caso al supervisor de turno para que autorice una compensación económica adicional.' },
        correct: 'a'
    },
    {
        id: 'q6',
        text: '6. Un cliente se comunica por el canal de voz reconociendo que contrató voluntariamente un servicio VAS y que está de acuerdo con el cargo reflejado en su sistema, sin presentar ninguna disconformidad. Según la tabla de tipificación del protocolo, ¿cómo debe registrar el asesor la atención?',
        options: { a: 'Tipificar la atención bajo la categoría de Problema, ya que implicó una revisión en el sistema One Touch.', b: 'Tipificar la atención bajo la categoría de Reclamo por haber consultado sobre servicios de terceros', c: 'Tipificar la atención bajo la categoría de Consulta, debido a que el cliente reconoce la suscripción y no presenta disconformidad.', d: 'Cerrar la interacción sin realizar ninguna tipificación en el sistema de gestión.' },
        correct: 'c'
    },
    {
        id: 'q7',
        text: '7. Un cliente llama manifestando su total disconformidad porque le han facturado una suscripción de entretenimiento VAS que asegura no haber aceptado, y solicita enérgica y explícitamente la devolución de su dinero. Tras validar que procede la atención, ¿qué elemento clave debe incluir obligatoriamente el asesor al momento de aplicar el protocolo?',
        options: { a: 'Utilizar el Speech SAR para empatizar con la situación, ofrecerle la solución de devolución del monto detallando cómo quedará su nuevo recibo, y brindarle el número de la solicitud de servicio (SS) ingresada.', b: 'Explicar que los servicios VAS se activan al hacer clic en anuncios y que la política de la empresa prohíbe realizar devoluciones en el primer contacto.', c: 'Informar al cliente que la única forma de recuperar su dinero es ingresando un reclamo a través de la página web de Osiptel.', d: 'Aplicar únicamente el bloqueo general de líneas sin mencionar montos ni entregar códigos de solicitud de servicio para agilizar la llamada.' },
        correct: 'a'
    },
    {
        id: 'q8',
        text: '8. Un cliente se comunica muy mortificado porque observa un cargo por servicios VAS en su recibo y exige que le devuelvan su dinero al instante. Según el protocolo de atención ¿qué acción debe priorizar el asesor antes de gestionar cualquier Nota de Crédito u OCC?',
        options: { a: 'Realizar el ajuste de inmediato en Siebel para evitar que el cliente se moleste y cortar la llamada con rapidez.', b: 'Identificar el cargo en la sección Servicios VAS, detallar al cliente el nombre del servicio contratado y explicarle el motivo del cobro.', c: 'Derivar la llamada al área de back-office sin explicar nada, ya que los temas de VAS no los maneja el canal de voz.', d: 'Bloquear todas las líneas del cliente de forma permanente sin verificar el origen del recibo ni brindarle ninguna explicación.' },
        correct: 'b'
    }
];

// Devuelve el registro del asesor actual si ya rindió la evaluación
function getMyRecord() {
    const dni = sessionStorage.getItem('asesor_dni');
    return getRecords().find(r => r.dni === dni && r.curso === COURSE_NAME) || null;
}

function applyMaterialCompleted() {
    sessionStorage.setItem('material_visto', '1');
    const chapterRow = document.getElementById('chapter-row');
    const chapterBadge = document.getElementById('chapter-badge');
    const chapterIcon = document.getElementById('chapter-icon');
    chapterBadge.innerHTML = '<i class="fa-solid fa-check mr-1"></i> Completado · Ver de nuevo';
    chapterBadge.classList.remove('bg-brandGreen', 'group-hover:bg-green-600');
    chapterBadge.classList.add('bg-green-500');
    chapterIcon.classList.remove('text-gray-400');
    chapterIcon.classList.add('text-brandGreen');
    // El material siempre se puede volver a abrir (aunque ya se haya rendido la evaluación)
    chapterRow.onclick = openPptModal;
    document.getElementById('progress-text').innerText = "1 / 1 capítulos completados";

    const examRow = document.getElementById('exam-row');
    const examIcon = document.getElementById('exam-icon');
    const examTitle = document.getElementById('exam-title');
    const examSubtitle = document.getElementById('exam-subtitle');
    const examBadge = document.getElementById('exam-badge');

    examRow.classList.remove('bg-gray-100', 'border-gray-200', 'opacity-60', 'cursor-not-allowed');
    examRow.classList.add('bg-slate-100', 'border-slate-300', 'cursor-pointer', 'hover:bg-slate-200');
    examRow.onclick = openExam;
    examIcon.className = 'fa-solid fa-unlock text-brandBlue text-xl';
    examTitle.classList.replace('text-gray-600', 'text-gray-800');
    examSubtitle.innerText = 'Evaluación Final de Categoría (un solo intento)';
    examBadge.className = 'bg-brandBlue text-white text-[13px] font-bold px-3 py-1 rounded-full block mb-0.5 whitespace-nowrap';
    examBadge.innerText = 'Disponible';
}

function applyExamCompleted(nota) {
    document.getElementById('exam-icon').className = 'fa-solid fa-circle-check text-brandGreen text-xl';
    document.getElementById('exam-subtitle').innerText = 'Evaluación rendida · Haz clic para ver tus respuestas';
    const examBadge = document.getElementById('exam-badge');
    examBadge.className = 'bg-brandGreen text-white text-[13px] font-bold px-3 py-1 rounded-full block mb-0.5 whitespace-nowrap';
    examBadge.innerHTML = '<i class="fa-solid fa-eye mr-1"></i> Ver respuestas · Nota ' + nota;
}

// Dibuja el detalle de respuestas (correctas / incorrectas) de una evaluación
function renderResults(answers, score, reviewMode, hasAnswers) {
    document.getElementById('score-display').innerText = score;
    document.getElementById('results-title').innerText = reviewMode ? 'Revisión de tu Evaluación' : 'Resultados de la Evaluación';

    const note = document.getElementById('results-note');
    if (reviewMode && !hasAnswers) {
        note.textContent = 'Esta evaluación se rindió antes de que se guardaran las respuestas, por eso solo se muestran las respuestas correctas.';
        note.classList.remove('hidden');
    } else if (reviewMode) {
        note.textContent = 'Puedes revisar tus respuestas las veces que quieras. La evaluación no se puede volver a rendir.';
        note.classList.remove('hidden');
    } else {
        note.classList.add('hidden');
    }

    const container = document.getElementById('results-details');
    container.innerHTML = '';

    QUESTIONS.forEach(q => {
        const chosen = answers ? answers[q.id] : null;
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4';

        const head = document.createElement('div');
        head.className = 'bg-slate-50 px-6 py-4 border-b border-gray-100';
        const title = document.createElement('h4');
        title.className = 'text-brandBlue font-semibold text-base';
        title.textContent = q.text;
        head.appendChild(title);
        card.appendChild(head);

        const body = document.createElement('div');
        body.className = 'p-4 sm:p-6 space-y-2';

        Object.keys(q.options).forEach(key => {
            const isCorrect = key === q.correct;
            const isChosen = key === chosen;
            const row = document.createElement('div');
            let cls = 'flex items-center space-x-3 p-2 rounded-md ';
            if (isCorrect) cls += 'bg-green-100 border border-green-200';
            else if (isChosen) cls += 'bg-red-100 border border-red-200';
            row.className = cls;

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.disabled = true;
            radio.checked = isChosen || (isCorrect && !hasAnswers);
            row.appendChild(radio);

            const label = document.createElement('span');
            label.className = 'text-base ' + ((isCorrect || isChosen) ? 'font-medium text-gray-800' : 'text-gray-600');
            let text = q.options[key];
            if (isCorrect) text += ' (Correcta)';
            else if (isChosen) text += ' (Tu respuesta)';
            if (isCorrect && isChosen) text += ' · Tu respuesta';
            label.textContent = text;
            row.appendChild(label);

            body.appendChild(row);
        });

        card.appendChild(body);
        container.appendChild(card);
    });
}

// Abre la evaluación: si ya la rindió, muestra sus respuestas (las veces que quiera)
function openExam() {
    const rec = getMyRecord();
    if (rec) {
        showResultsView(rec.respuestas || null, rec.nota, true, !!rec.respuestas);
        return;
    }
    openQuizModal();
}

function markAsCompletedAndStartQuiz() {
    closePptModal();
    applyMaterialCompleted();
    const rec = getMyRecord();
    if (rec) applyExamCompleted(rec.nota);
    openExam();
}

// Si el asesor ya rindió la evaluación, se restaura su avance al ingresar
function restoreProgress() {
    const rec = getMyRecord();
    if (rec) {
        applyMaterialCompleted();
        applyExamCompleted(rec.nota);
    }
}
