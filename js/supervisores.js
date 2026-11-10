// Lista de supervisores que aparece en el login (para agregar o quitar, edita esta lista)
const SUPERVISORES = [
    'CORREA BRICEÑO YSELLA MARGOT',
    'RAMOS ESCOBAR PATRICIA GISSELA',
    'ALIAGA CARRILLO MARIBEL',
    'LOZANO VALVERDE KARINA VIVIANA',
    'ORDINOLA CUEVA JAVIER IVAN',
    'GARCIA FLORES MERCEDES',
    'GUARDAMINO ORIONDO JACQUELINE JEANETTE',
    'ROJAS ESPINOZA LIBERTAD SHALOM VICTORIA',
    'BALVIN MORENO JULIO CESAR',
    'IBARRA ANGULO EDUARDO ALBERTO',
    'SOLORZANO HUAMANI KARIN LAHAZMI',
    'HUAMAN OSCCO RONALDO CECILIO',
    'ROBLES CISNEROS CLARA MARIA PAMELA',
    'LOAYZA SALVATIERRA ELIDA VALERIA',
    'TENORIO BARBA ROSALYNN CRISTINA'
];

(function llenarSupervisores() {
    const select = document.getElementById('input-supervisor');
    const placeholder = new Option('Selecciona tu supervisor', '', true, true);
    placeholder.disabled = true;
    select.appendChild(placeholder);
    SUPERVISORES.forEach(nombre => select.appendChild(new Option(nombre, nombre)));
})();
