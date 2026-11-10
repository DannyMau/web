// Persistencia de sesión: al actualizar la página se vuelve a la misma ventana.
// Se guarda en sessionStorage (dura mientras la pestaña esté abierta; "Cerrar sesión" lo borra).
const VIEW_IDS = {
    main: 'main-platform',
    material: 'material-view',
    report: 'report-view',
    results: 'results-view',
    quiz: 'quiz-modal'
};

function saveView(name, data) {
    try {
        sessionStorage.setItem('vista_actual', name);
        if (data !== undefined) sessionStorage.setItem('vista_datos', JSON.stringify(data));
        else sessionStorage.removeItem('vista_datos');
    } catch (e) { /* almacenamiento no disponible */ }
}

function restoreSession() {
    if (!sessionStorage.getItem('asesor_nombre')) return; // sin sesión: se queda en el login

    isAdmin = sessionStorage.getItem('es_admin') === '1';
    updateUIWithUserData();
    if (isAdmin) {
        document.getElementById('btn-admin-report').classList.remove('hidden');
    } else {
        restoreProgress();
    }
    if (sessionStorage.getItem('material_visto') === '1') applyMaterialCompleted();
    const rec = isAdmin ? null : getMyRecord();
    if (rec) applyExamCompleted(rec.nota);

    document.getElementById('login-screen').classList.add('hidden');
    let view = sessionStorage.getItem('vista_actual') || 'main';
    if (!VIEW_IDS[view]) view = 'main';
    const savedData = sessionStorage.getItem('vista_datos'); // goHome() lo borra, se lee antes

    // Ventanas que reemplazan a la plataforma principal
    goHome();
    if (view === 'material') {
        openPptModal();
    } else if (view === 'report' && isAdmin) {
        openReportWindow();
    } else if (view === 'results') {
        try {
            const d = JSON.parse(savedData);
            showResultsView(d.answers, d.score, d.reviewMode, d.hasAnswers);
        } catch (e) { saveView('main'); }
    } else if (view === 'quiz') {
        if (rec) openExam(); else openQuizModal();
    }
}

restoreSession();
