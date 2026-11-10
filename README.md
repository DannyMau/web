# Aprende +

Plataforma de capacitación (HTML + Tailwind CSS por CDN + JavaScript puro). No requiere compilación.

## Estructura

```
aprende-plus/
├── index.html              # Estructura de pantallas (login, plataforma, material, quiz, resultados, reporte)
├── css/
│   └── styles.css          # Estilos propios (responsive, tabla de reporte en móvil, banner)
├── js/
│   ├── tailwind-config.js  # Colores y tipografía de marca
│   ├── supervisores.js     # Lista de supervisores del login
│   ├── auth.js             # Login de asesor y acceso de administrador
│   ├── menu.js             # Menú de perfil
│   ├── report.js           # Reporte: tabla, eliminar, exportar CSV
│   ├── navigation.js       # Acordeón, modales, pasos del quiz, vistas
│   ├── course.js           # Curso, preguntas (QUESTIONS), progreso y resultados
│   ├── quiz.js             # Calificación y guardado de la evaluación
│   └── session.js          # Recuerda la ventana actual al actualizar (F5)
├── assets/images/          # login-hero.png, banner-person.png, exam-banner.png
└── .vscode/                # Extensiones y ajustes recomendados
```

> Los scripts se cargan como scripts clásicos (no módulos) y **el orden en `index.html` importa**.

## Cómo ejecutar en Visual Studio Code

1. Abre la carpeta con **File > Open Folder**.
2. Instala la extensión recomendada **Live Server**.
3. Clic derecho en `index.html` > **Open with Live Server**.

(También funciona abriendo `index.html` directamente en el navegador.)

## Dónde editar

- **Preguntas y respuestas correctas:** solo `QUESTIONS` en `js/course.js`. El formulario de la evaluación y la pantalla de resultados se generan solos desde ahí. Para agregar una pregunta, copia un bloque `{ id, text, options, correct }` con el siguiente id (`q9`, ...).
- **Nota máxima:** `MAX_SCORE` en `js/course.js` (20). Se reparte en partes iguales entre las preguntas (8 preguntas = 2.5 puntos c/u).
- Supervisores del login: lista `SUPERVISORES` en `js/supervisores.js`.
- Nombre del curso: `COURSE_NAME` en `js/course.js`.
- Colores: `js/tailwind-config.js` (paleta azul marino) y `css/styles.css` (`.exam-banner`). Las imágenes de `assets/images/` ya están en azul marino.
- Fechas del curso: en `index.html`, buscar "Inicio:" y "Fin:".
- Datos guardados: `localStorage` (`reporteEvaluaciones`) y `sessionStorage` (datos del asesor).
