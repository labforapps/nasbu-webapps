# NAS-097 · [SPIKE] Definir las reglas de negocio de los indicadores de ahorro

| Campo | Valor |
| --- | --- |
| Tipo | Análisis (spike) |
| Prioridad | P3 |
| Fase | F6 · Análisis y definición con el cliente |
| Estado para Claude Code | Requiere definición (análisis) |
| Repos | backend + frontend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [7AwSuDxZ](https://trello.com/c/7AwSuDxZ) |

## Contexto

Hay que definir las reglas de negocio de los indicadores de ahorro de Nasbu. La tarjeta está asignada a Kenneth Leonor.

## Criterios de aceptación

- [ ] Documento `docs/analisis/NAS-097.md` con: situación actual en el código, opciones de solución, recomendación y estimación.
- [ ] Las preguntas abiertas de esta tarjeta quedan respondidas o listadas para el cliente.
- [ ] Propuesta de fórmulas por indicador y de los datos que ya existen para calcularlas.
- [ ] No se modifica código de producción hasta que el cliente apruebe la propuesta.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- No hay nada de "ahorro" en el código. Los datos del dashboard salen de la acción `summary` en `security/views.py`; `core/metrics.py` es de administración.

### Frontend (`nasbu-webapps`)

- `pages/dashboard/indicators/indicators.component.{html,ts}` recibe `accountSummary`: ahí iría la sección nueva.

### Riesgos y dependencias

El negocio debe definir fórmulas, costo base por ítem y período.

## Preguntas abiertas

- ¿Qué ahorro se mide (tiempo, dinero, documentos) y contra qué línea base?
- ¿Dónde se muestran los indicadores y con qué frecuencia se calculan?

## Definición de terminado

- [ ] Documento de análisis entregado y revisado.
- [ ] Si se aprueba el desarrollo, se actualiza este archivo con criterios implementables.
