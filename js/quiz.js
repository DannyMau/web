// Calificación y guardado de la evaluación
// --- 4. LÓGICA DE CALIFICACIÓN Y GUARDADO ---
function submitQuiz(event) {
    event.preventDefault();
    if (getMyRecord()) {
        openExam();
        return;
    }
    const formData = new FormData(event.target);
    const answers = {};
    let score = 0;
    QUESTIONS.forEach(q => {
        answers[q.id] = formData.get(q.id);
        if (answers[q.id] === q.correct) score += MAX_SCORE / QUESTIONS.length;
    });
    score = Math.round(score * 10) / 10;

    const nuevoRegistro = {
        fecha: new Date().toLocaleString(),
        asesor: sessionStorage.getItem('asesor_nombre') || 'Desconocido',
        dni: sessionStorage.getItem('asesor_dni') || '--',
        supervisor: sessionStorage.getItem('asesor_supervisor') || '--',
        curso: COURSE_NAME,
        nota: score,
        respuestas: answers
    };

    // Las pruebas del administrador no se guardan en el reporte
    if (!isAdmin) {
        let records = JSON.parse(localStorage.getItem('reporteEvaluaciones')) || [];
        records.push(nuevoRegistro);
        localStorage.setItem('reporteEvaluaciones', JSON.stringify(records));
        cloudSave(nuevoRegistro); // copia en Google Sheets
    }

    // El examen pasa a "Completado" recién cuando el asesor lo rinde
    applyExamCompleted(score);
    showResultsView(answers, score, false, true);
}

// Genera el formulario de la evaluación a partir de QUESTIONS (js/course.js)
function buildQuizForm() {
    const container = document.getElementById('quiz-steps');
    container.innerHTML = '';
    QUESTIONS.forEach((q, i) => {
        const step = document.createElement('div');
        step.className = 'quiz-step hidden bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden';
        step.dataset.step = i;

        const head = document.createElement('div');
        head.className = 'bg-slate-50 px-6 py-4 border-b border-gray-100';
        const title = document.createElement('h4');
        title.className = 'text-brandBlue font-semibold text-base';
        title.textContent = q.text;
        head.appendChild(title);
        step.appendChild(head);

        const body = document.createElement('div');
        body.className = 'p-4 sm:p-6 space-y-2';
        Object.keys(q.options).forEach((key, k) => {
            const label = document.createElement('label');
            label.className = 'flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-colors';
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = q.id;
            input.value = key;
            if (k === 0) input.required = true;
            input.className = 'w-4 h-4 text-brandBlue focus:ring-brandBlue';
            const span = document.createElement('span');
            span.className = 'text-base text-gray-700';
            span.textContent = q.options[key];
            label.appendChild(input);
            label.appendChild(span);
            body.appendChild(label);
        });
        step.appendChild(body);
        container.appendChild(step);
    });
}
buildQuizForm();
