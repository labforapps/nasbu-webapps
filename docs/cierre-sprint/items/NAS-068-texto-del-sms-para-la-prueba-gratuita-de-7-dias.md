# NAS-068 · [SPIKE] Texto del SMS para la prueba gratuita de 7 días

| Campo | Valor |
| --- | --- |
| Tipo | Análisis (spike) |
| Prioridad | P3 |
| Fase | F5 · Notificaciones y SMS |
| Estado para Claude Code | Requiere definición (análisis) |
| Repos | backend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [EUfemVsR](https://trello.com/c/EUfemVsR) |
| Relacionado con | NAS-004, NAS-106 |

## Contexto

Hay que definir el texto del SMS que se envía en la prueba de 7 días.

## Criterios de aceptación

- [ ] Documento `docs/analisis/NAS-068.md` con: situación actual en el código, opciones de solución, recomendación y estimación.
- [ ] Las preguntas abiertas de esta tarjeta quedan respondidas o listadas para el cliente.
- [ ] Borrador de textos para aprobación del cliente, con un máximo de 160 caracteres cada uno.
- [ ] No se modifica código de producción hasta que el cliente apruebe la propuesta.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- No hay SMS ni correo de prueba gratuita. `Plan.trial_total_days` es 14 por defecto, no 7.
- Tarea Django-Q que busque suscripciones con `free_trial=True` y vencimiento en N días y envíe el SMS por el servicio de NAS-106. Texto en `ConfigParam` o i18n.

### Riesgos y dependencias

Depende de NAS-106 y del texto del cliente.

## Preguntas abiertas

- ¿Qué debe decir el SMS y en qué momentos se envía (inicio, recordatorio, fin)?

## Definición de terminado

- [ ] Documento de análisis entregado y revisado.
- [ ] Si se aprueba el desarrollo, se actualiza este archivo con criterios implementables.
