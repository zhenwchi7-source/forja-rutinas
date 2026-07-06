# Prompt de usuario — Ajuste de rutina (seguimiento)

El campo `{{ $json.contexto }}` se construye en el nodo Code "Preparar contexto", que lee la hoja de seguimiento del cliente (peso usado, reps hechas y dificultad por ejercicio). El resto de variables vienen del formulario de seguimiento.

---

Este es un SEGUIMIENTO de {{ $json.nombre }}, que ya entrenó con una rutina nuestra y quiere ajustarla.

REGISTRO de sus últimos entrenamientos (lo que anotó en su hoja):
{{ $json.contexto }}

Feedback general del formulario:
- Cómo le fue con la rutina: {{ $json.Como_Fue }}
- Peso corporal actual: {{ $json.Peso }} kg
- Sensaciones: {{ $json.Sensaciones }}
- Nueva molestia o lesión: {{ $json.Nueva_Lesion }}
- Cambio de meta solicitado: {{ $json.Cambio_Meta }}

Genera la rutina AJUSTADA usando estos datos reales.
