# NAS-044 · [SPIKE] Revisar el caso del cliente que no pudo crear una tarea

| Campo | Valor |
| --- | --- |
| Tipo | Análisis (spike) |
| Prioridad | P2 |
| Fase | F6 · Análisis y definición con el cliente |
| Estado para Claude Code | Requiere definición (análisis) |
| Repos | backend + frontend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [M3TPD7Xr](https://trello.com/c/M3TPD7Xr) |

## Contexto

Un cliente intentó crear una tarea y no pudo. La evidencia es un video compartido por WhatsApp que no está en la tarjeta.

## Criterios de aceptación

- [ ] Documento `docs/analisis/NAS-044.md` con: situación actual en el código, opciones de solución, recomendación y estimación.
- [ ] Las preguntas abiertas de esta tarjeta quedan respondidas o listadas para el cliente.
- [ ] Reproducción documentada del caso y, si es un defecto, una tarjeta BUG nueva con causa raíz.
- [ ] No se modifica código de producción hasta que el cliente apruebe la propuesta.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- Revisar primero: `mixins/viewsets/viewsets.py` (`create`) lee `request.data['subscription']` (KeyError si falta) y tiene un `print('Test')` olvidado.
- `helpers/validations/validations.py`: si la suscripción no tiene fila `SubscriptionFeature` o `SubscriptionUssage` de TASKS, nunca puede crear tareas (`SubscriptionReachLimitException`).
- Flujo: `TaskViewSet` (`practice/views.py`) → `TaskWriteSerializer` (`practice/serializers.py`) → `Task.create_task` (`practice/models.py`).

### Frontend (`nasbu-webapps`)

- `components/dialogs/dialog-new-task/dialog-new-task.component.ts`: campos requeridos y validaciones de `submitForm`; en error muestra `error.error.error`, que puede ser `undefined`.

### Riesgos y dependencias

Se necesita el id de suscripción del cliente y el mensaje exacto.

## Preguntas abiertas

- Se necesita el video o los pasos exactos, la cuenta y la fecha del intento.

## Definición de terminado

- [ ] Documento de análisis entregado y revisado.
- [ ] Si se aprueba el desarrollo, se actualiza este archivo con criterios implementables.
