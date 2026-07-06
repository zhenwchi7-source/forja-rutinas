# Prompt de usuario — Generación de rutina inicial

Las variables `{{ $json.Campo }}` se rellenan desde la fila del Google Sheet (pestaña `general`) que envía el formulario de la landing.

---

Crea una rutina de gimnasio para {{ $json.Nombre }}.
Datos:
Edad: {{ $json.Edad }} años
Peso: {{ $json.Peso }} kg | Altura: {{ $json.Altura }} cm
Nivel: {{ $json.Nivel }}
Disponibilidad: {{ $json.Dias_Entrenamiento }} a la semana, {{ $json.Tiempo_Entrenamiento }} por sesión.
Meta principal: {{ $json.Meta }}.
Lesiones o limitaciones: {{ $json.Lesiones }}.
