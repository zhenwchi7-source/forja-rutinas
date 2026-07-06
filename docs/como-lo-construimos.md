# Cómo construimos FORJA — bitácora paso a paso

Este documento explica **todo lo que se hizo**, en orden, para que cualquier integrante del grupo entienda el proyecto y pueda defenderlo en el Q&A. Está en lenguaje simple.

La idea del sistema en una frase: **un formulario web guarda datos en Google Sheets → n8n detecta el dato nuevo → una IA (Gemini) genera/ajusta la rutina → el resultado llega por correo, con una hoja para registrar pesos que la IA luego usa para mejorar la rutina.**

---

## Parte 1 · La landing page (el "front")

1. Se creó `index.html`: una landing de alto contraste (fondo oscuro, acentos verde lima/naranja) enfocada en principiantes de gimnasio.
2. Incluye **2 formularios**:
   - **Inicial:** nombre, email, edad, peso, altura, nivel, días, tiempo por sesión, meta y lesiones.
   - **Seguimiento:** email, cómo le fue, peso actual, sensaciones, nueva lesión y cambio de meta.
3. Se añadió un **modelo freemium** (plan gratis con 1 seguimiento; plan Pro $4.990/mes con seguimientos ilimitados) y una sección que explica el valor del seguimiento.
4. El formulario de seguimiento envía un campo oculto `Formulario=seguimiento` para poder separarlo del inicial.

## Parte 2 · Guardar los datos (la "BBDD")

5. Se creó un **Google Sheet** con las pestañas `general`, `seguimiento` y `hojas_clientes` (ver `/src/bbdd/estructura.md`).
6. Se escribió un **Google Apps Script** (`/src/apps-script/doPost.gs`) publicado como "aplicación web". Recibe los envíos de los formularios y los escribe en la pestaña correcta según el campo `Formulario`.
7. Los `name` de los campos del formulario se hicieron coincidir **exactamente** con los encabezados del Sheet.

## Parte 3 · Publicar la página (GitHub Pages)

8. Se creó un repositorio en GitHub y se subió `index.html`.
9. Se activó **GitHub Pages**, que publica la web en una URL pública: https://zhenwchi7-source.github.io/forja-rutinas/

## Parte 4 · La automatización con IA (n8n) — rutina inicial

10. En **n8n** se montó el flujo `1-rutina-inicial.json`:
    - **Google Sheets Trigger:** se dispara con cada fila nueva de la pestaña `general`.
    - **Gemini (LLM):** genera la rutina. Clave: se le pide devolver **JSON estructurado** (no texto suelto), lo que permite reutilizar los datos y además es un "guardrail".
    - **Nodo Code (validación):** hace `JSON.parse` y verifica que el JSON tenga días válidos (si no, lanza error). Esto es el **guardrail** (Capa 2 de IA).
    - **Crear planilla + Escribir ejercicios:** con nodos nativos de Google Sheets, crea una **hoja de seguimiento por cliente** con sus ejercicios y columnas vacías (Peso usado, Reps hechas, Dificultad).
    - **Compartir hoja (Google Drive):** la deja editable por link.
    - **Gmail:** envía la rutina + el link a la hoja.
    - **Registrar cliente:** guarda en `hojas_clientes` el mapa `email → ID de la planilla`.

## Parte 5 · Cerrar el loop — el seguimiento

11. Se montó el flujo `2-seguimiento.json`:
    - **Trigger** en la pestaña `seguimiento`.
    - **Leer libreta + buscar por email:** encuentra la planilla del cliente en `hojas_clientes`.
    - **Leer registros del cliente:** abre su planilla y lee los pesos/reps/dificultad que anotó.
    - **Preparar contexto (Code):** arma un resumen de texto con esos datos.
    - **Gemini:** ajusta las cargas (sube si fue fácil, baja/mantiene si costó) y genera la rutina ajustada.
    - **Dar formato (Code) + Gmail:** envuelve el contenido en una plantilla fija y lo envía.

## Parte 6 · Robustez (manejo de errores)

12. Se añadieron los **3 mecanismos** que pide la rúbrica:
    - **Retries:** el nodo de Gemini reintenta si la API falla.
    - **Continue on Fail:** los nodos clave están en "On Error → Continue", así un caso con error no detiene a los demás.
    - **Error Trigger:** un flujo aparte (`3-error-trigger.json`) que, si algún flujo falla, envía un correo de alerta.

## Parte 7 · Detalles y decisiones técnicas (para el Q&A)

- **¿Por qué JSON de la IA?** Para separar **contenido** (lo que dice la IA) de **presentación** (el correo y la hoja los arma el código). Así el resultado es consistente y reutilizable.
- **¿Por qué nodos nativos y no HTTP?** n8n cloud bloquea el nodo HTTP genérico con las credenciales de Google gestionadas por n8n; los nodos nativos (Sheets/Drive) sí las aceptan.
- **¿Por qué una hoja por cliente?** Para que cada persona registre su progreso de forma privada y la IA lo lea de vuelta.
- **¿Por qué Gemini?** Tiene capa gratuita (ideal para un MVP universitario sin costos).

---

## Resumen de artefactos del repo

| Carpeta | Qué contiene |
|---|---|
| `index.html` | La landing page (front) |
| `src/flujo/` | Los 3 workflows de n8n (JSON para importar) |
| `src/prompts/` | Los prompts de la IA, uno por archivo |
| `src/apps-script/` | El código que conecta los formularios con el Sheet |
| `src/bbdd/` | La estructura de las pestañas del Google Sheet |
| `evidencia/` | Screenshots, video de demo y las 5 conversaciones |
