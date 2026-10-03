# NAS-102 · [HU] Temporizador: elegir el expediente cuando hay tareas con el mismo nombre

| Campo | Valor |
| --- | --- |
| Tipo | Historia de usuario |
| Prioridad | P3 |
| Fase | F6 · Análisis y definición con el cliente |
| Estado para Claude Code | Listo para desarrollo |
| Repos | frontend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [kPzCaBVq](https://trello.com/c/kPzCaBVq) |
| Relacionado con | NAS-101 |

## Contexto

Al detener el temporizador, el usuario elige la tarea en un desplegable. Si hay tareas con el mismo nombre en varios expedientes, no sabe a cuál corresponde.

## Criterios de aceptación

- [ ] Documento `docs/analisis/NAS-102.md` con: situación actual en el código, opciones de solución, recomendación y estimación.
- [ ] Las preguntas abiertas de esta tarjeta quedan respondidas o listadas para el cliente.
- [ ] Propuesta de UI. La opción más simple es mostrar "Nombre de tarea · Expediente" en el desplegable.
- [ ] No se modifica código de producción hasta que el cliente apruebe la propuesta.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Frontend (`nasbu-webapps`)

- `components/dialogs/dialog-add-hours/dialog-add-hours.component.html` muestra solo `{{task.name}}`. El backend ya devuelve `case_file` anidado.
- Mostrar "código · nombre — expediente" y agrupar con `mat-optgroup` por expediente. Aplicar igual en `dialog-charged-hours` y en el dashboard.

### Pruebas

- FE spec que valide las etiquetas de las opciones.

### Riesgos y dependencias

`getTasks` trae todas las tareas abiertas; con listas grandes conviene un autocomplete.

## Preguntas abiertas

- ¿Se elige primero el expediente y luego la tarea, o se muestra "Tarea – Expediente" en una sola lista?

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-102:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
