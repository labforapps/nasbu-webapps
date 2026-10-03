# NAS-064 · [SPIKE] Reutilizar la cuenta de un usuario que sale de la firma sin consumir otra licencia

| Campo | Valor |
| --- | --- |
| Tipo | Análisis (spike) |
| Prioridad | P3 |
| Fase | F6 · Análisis y definición con el cliente |
| Estado para Claude Code | Requiere definición (análisis) |
| Repos | backend + frontend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [y6jhrCYu](https://trello.com/c/y6jhrCYu) |
| Relacionado con | NAS-020 |

## Contexto

Cuando un usuario deja la firma, ¿cómo se reutiliza su cuenta sin eliminarla, para no pagar otra licencia?

## Criterios de aceptación

- [ ] Documento `docs/analisis/NAS-064.md` con: situación actual en el código, opciones de solución, recomendación y estimación.
- [ ] Las preguntas abiertas de esta tarjeta quedan respondidas o listadas para el cliente.
- [ ] No se modifica código de producción hasta que el cliente apruebe la propuesta.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- El PR #118 (ya en `master`) agrega borrado completo o soft delete con `DELETED_MARKER`, libera el asiento y permite reutilizar el correo; `destroy` devuelve `{'deleted': outcome}`.
- Falta decidir si basta con eliminar + crear o si se agrega "reasignar asiento" (`SubscriptionUser.replace_user`) que traspase expedientes y tareas.

### Frontend (`nasbu-webapps`)

- `pages/collaborator/collaborator.component.ts` (`deleteCollaborator`): manejar la nueva forma de respuesta y agregar manejo de error.

### Riesgos y dependencias

Definir si los registros del usuario que sale pasan al reemplazo.

## Preguntas abiertas

- ¿Se reasigna la cuenta a otra persona (cambio de correo) o se desactiva y libera la licencia?
- ¿Qué pasa con las tareas, expedientes y tiempos del usuario anterior?

## Definición de terminado

- [ ] Documento de análisis entregado y revisado.
- [ ] Si se aprueba el desarrollo, se actualiza este archivo con criterios implementables.
