# NAS-011 · [SPIKE] Cancelar una suscripción

| Campo | Valor |
| --- | --- |
| Tipo | Análisis (spike) |
| Prioridad | P3 |
| Fase | F6 · Análisis y definición con el cliente |
| Estado para Claude Code | Requiere definición (análisis) |
| Repos | backend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [lmOXayjK](https://trello.com/c/lmOXayjK) |
| Relacionado con | NAS-092 |

## Contexto

La función de cancelar suscripción no existe y hay que definirla.

## Criterios de aceptación

- [ ] Documento `docs/analisis/NAS-011.md` con: situación actual en el código, opciones de solución, recomendación y estimación.
- [ ] Las preguntas abiertas de esta tarjeta quedan respondidas o listadas para el cliente.
- [ ] Flujo propuesto de pantallas y llamadas a Evertec.
- [ ] No se modifica código de producción hasta que el cliente apruebe la propuesta.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- `Subscription.delete_subscription` (`subscription/models.py`) está declarado bajo `@property` con un argumento, así que `SubscriptionViewSet.destroy` fallaría con TypeError. Solo pone estado `X` y desactiva métodos de pago; no cancela nada en PlaceToPay.
- Propuesta: `Subscription.cancel(at_period_end=True)` con campo `cancel_at` (migración), excluir canceladas en `collect_all_subscriptions_payments`, `@action cancel` y botón en `pages/configuration/profile-sign/subscription/`.

### Pruebas

- BE `subscription/tests.py`: cancelar, sin cobro en la siguiente fecha, acceso hasta `cancel_at`.

## Preguntas abiertas

- ¿La cancelación es inmediata o al final del ciclo pagado?
- ¿Qué pasa con los datos de la firma tras cancelar y por cuánto tiempo se conservan?
- ¿Cómo se cancela el cobro recurrente en Evertec?

## Definición de terminado

- [ ] Documento de análisis entregado y revisado.
- [ ] Si se aprueba el desarrollo, se actualiza este archivo con criterios implementables.
