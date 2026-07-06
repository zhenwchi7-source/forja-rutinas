# Estructura de la base de datos (Google Sheets)

Todo el proyecto usa **un único Google Sheet** con varias pestañas. Es la BBDD del MVP (guarda datos de negocio + sirve de gatillo para n8n).

## Pestaña `general` — formulario inicial
Recibe cada rutina solicitada. Encabezados (fila 1):
```
Nombre | Email | Edad | Peso | Altura | Nivel | Dias_Entrenamiento | Tiempo_Entrenamiento | Meta | Lesiones | Marca temporal
```

## Pestaña `seguimiento` — formulario de seguimiento
Recibe cada solicitud de ajuste. Encabezados (fila 1):
```
Nombre | Email | Como_Fue | Peso | Sensaciones | Nueva_Lesion | Cambio_Meta | Marca temporal
```

## Pestaña `hojas_clientes` — "libreta" (mapa email → planilla)
El flujo inicial registra aquí, por cada cliente, el ID de la hoja de seguimiento que se le creó. El flujo de seguimiento la usa para encontrar la planilla del cliente por su email. Encabezados:
```
Email | Nombre | ID_Hoja | Link | Fecha
```

## Hoja por cliente (se crea automáticamente)
El flujo inicial crea **una planilla nueva por cliente** con una pestaña donde registra sus entrenamientos. Columnas:
```
Día | Ejercicio | Series | Reps objetivo | Peso usado (kg) | Reps hechas | Dificultad
```
Las 3 últimas columnas las rellena el cliente; el flujo de seguimiento las lee para ajustar las cargas.

> **Nota sobre nombres de columna:** son "simples" (sin espacios/paréntesis en los del formulario) para que las expresiones de n8n `{{ $json.Campo }}` funcionen directamente.
