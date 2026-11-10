// Acordeón, modales, pasos del quiz y vistas
// --- 3. LÓGICA DEL ACORDEÓN Y MODALES ---
function toggleAccordion() {
    const content = document.getElementById('accordion-content');
    const chevron = document.getElementById('main-chevron');
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        chevron.classList.remove('fa-chevron-down');
        chevron.classList.add('fa-chevron-up');
    } else {
        content.classList.add('hidden');
        chevron.classList.remove('fa-chevron-up');
        chevron.classList.add('fa-chevron-down');
    }
}

// El material se abre como página propia (reemplaza a la plataforma)
function updateMaterialButton() {
    const btn = document.getElementById('btn-mark-complete');
    const rec = isAdmin ? null : getMyRecord();
    if (rec) btn.innerHTML = '<i class="fa-solid fa-eye"></i> <span>Ver mis respuestas</span>';
    else if (sessionStorage.getItem('material_visto') === '1') btn.innerHTML = '<span>Ir a la evaluación</span>';
    else btn.innerHTML = '<span>Marcar como completado</span>';
}
function openPptModal() {
    updateMaterialButton();
    document.getElementById('main-platform').classList.add('hidden');
    document.getElementById('results-view').classList.add('hidden');
    document.getElementById('quiz-modal').classList.add('hidden');
    document.getElementById('material-view').classList.remove('hidden');
    saveView('material');
    window.scrollTo(0, 0);
}
function closePptModal() {
    document.getElementById('material-view').classList.add('hidden');
    document.getElementById('main-platform').classList.remove('hidden');
    saveView('main');
}

function openQuizModal() {
    document.getElementById('quiz-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.getElementById('quiz-form').reset();
    currentStep = 0;
    updateQuizStep();
    document.getElementById('quiz-form-container').classList.remove('hidden');
    saveView('quiz');
}
function closeQuizModal() {
    saveView('main');
    document.getElementById('quiz-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}
// Evaluación paso a paso: una pregunta a la vez
let currentStep = 0;
function updateQuizStep() {
    const steps = document.querySelectorAll('#quiz-form .quiz-step');
    const total = steps.length;
    steps.forEach((el, i) => el.classList.toggle('hidden', i !== currentStep));
    const last = currentStep === total - 1;
    const answered = !!document.querySelector('#quiz-form input[name="q' + (currentStep + 1) + '"]:checked');
    const next = document.getElementById('quiz-next');
    const submit = document.getElementById('quiz-submit');
    next.classList.toggle('hidden', last);
    next.disabled = !answered;
    submit.classList.toggle('hidden', !last);
    submit.disabled = !answered;
    document.getElementById('quiz-progress').textContent = 'Pregunta ' + (currentStep + 1) + ' de ' + total;
}
function nextQuestion() {
    const total = document.querySelectorAll('#quiz-form .quiz-step').length;
    if (currentStep < total - 1) {
        currentStep++;
        updateQuizStep();
        document.getElementById('quiz-modal').scrollTo(0, 0);
    }
}
document.getElementById('quiz-form').addEventListener('change', updateQuizStep);

// Clic en el logo: volver a la ventana principal
function goHome() {
    ['material-view', 'report-view', 'results-view', 'quiz-modal'].forEach(id => document.getElementById(id).classList.add('hidden'));
    document.body.style.overflow = 'auto';
    document.getElementById('main-platform').classList.remove('hidden');
    saveView('main');
    window.scrollTo(0, 0);
}

// Los resultados se muestran en una página propia (reemplaza a la plataforma)
function showResultsView(answers, score, reviewMode, hasAnswers) {
    renderResults(answers, score, reviewMode, hasAnswers);
    document.getElementById('quiz-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.getElementById('main-platform').classList.add('hidden');
    document.getElementById('material-view').classList.add('hidden');
    document.getElementById('results-view').classList.remove('hidden');
    saveView('results', { answers, score, reviewMode, hasAnswers });
    window.scrollTo(0, 0);
}
function closeResultsView() {
    document.getElementById('results-view').classList.add('hidden');
    document.getElementById('main-platform').classList.remove('hidden');
    saveView('main');
    window.scrollTo(0, 0);
}
