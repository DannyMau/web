# Guardar los resultados en Google Sheets (gratis)

1. Entra a https://sheets.google.com y crea una hoja nueva (ej. "Reporte Aprende +").
2. Menú **Extensiones > Apps Script**. Borra lo que haya y pega todo el contenido de `apps-script/Code.gs`. Guarda.
3. Botón **Implementar > Nueva implementación** > engranaje > **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
   - Implementar y **autorizar** los permisos (Avanzado > Ir a proyecto).
4. Copia la **URL de la aplicación web** (termina en `/exec`).
5. Abre `js/cloud.js` y pégala en `const CLOUD_URL = '...';`
6. Vuelve a subir/desplegar la carpeta a Wasmer.

Listo: cada evaluación rendida aparece como una fila en tu Google Sheet, desde cualquier dispositivo.
El reporte del administrador también lee de esa hoja.

**Importante (versión con "ver mis respuestas"):** si ya tenías Code.gs publicado, pega el nuevo `apps-script/Code.gs`,
guárdalo y haz **Implementar > Administrar implementaciones > editar (lápiz) > Versión: Nueva versión > Implementar**.
La URL `/exec` se mantiene igual. Sin este paso, los asesores solo verán sus respuestas en el mismo navegador donde rindieron.

Si cambias el código de Code.gs después: Implementar > Administrar implementaciones > editar > Nueva versión.
