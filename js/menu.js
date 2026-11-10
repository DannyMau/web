// Menú de perfil
// --- 2. LÓGICA DEL MENÚ Y VENTANA INDEPENDIENTE ---
function toggleProfileMenu() {
    const menu = document.getElementById('profile-menu');
    menu.classList.toggle('hidden');
}

document.addEventListener('click', function(event) {
    const menu = document.getElementById('profile-menu');
    const button = event.target.closest('button');
    if (!menu.classList.contains('hidden') && !button) {
        menu.classList.add('hidden');
    }
});
