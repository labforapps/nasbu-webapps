# NAS-004 · [BUG] El SMS de confirmación de compra muestra $0.00 en lugar del monto cobrado

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P2 |
| Fase | F5 · Notificaciones y SMS |
| Estado para Claude Code | Requiere definición (análisis) |
| Repos | backend |
| Lista en Trello | Flujo inexistente o no hay solución inmediata |
| Tarjeta(s) Trello | [BWTJTI7C](https://trello.com/c/BWTJTI7C) |
| Relacionado con | NAS-106, NAS-068 |

## Contexto

Con la cuenta de prueba mirelesmateo@mailinator.com se compró con "Comprar ahora" un plan Starter de 3 usuarios, configurado para cobrar $0.10. El pago fue correcto y el correo indicó $0.10, pero el SMS con el código de confirmación dijo $0.00.

## Pasos para reproducir

1. Comprar un plan con un monto con decimales menor a 1 (ej.: $0.10).
2. Revisar el correo y el SMS recibidos.

## Comportamiento actual

El SMS muestra $0.00.

## Comportamiento esperado

El SMS muestra el mismo monto que el correo: $0.10.

## Criterios de aceptación

- [ ] El SMS y el correo usan la misma función de formato de monto.
- [ ] Prueba unitaria del formato con 0.10, 1.00 y 1,234.56.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- El backend no envía SMS de confirmación de compra; los únicos `send_dynamic_sms` son de enlaces. Ese SMS lo envía PlaceToPay/Evertec.
- Sospecha (sin confirmar): `CoreBillingAttempt.__get_pg_payload_from_billing_charge__` (`core/models.py`) y el payload análogo en `subscription/models.py` envían `taxes[].amount = round(0.10*0.01, 2) = 0.00` con `base: 0`. El SMS de la pasarela podría mostrar ese campo.
- Comparar el `request_payload` guardado en QA con la plantilla de SMS de la pasarela; enviar `base` correcta o no enviar impuestos en 0. Confirmar con soporte de Evertec.

### Pruebas

- BE `core/tests.py`: el payload de una factura de 0.10 tiene `total = 0.10` y no lleva líneas de impuesto en 0.

## Definición de terminado

- [ ] Documento de análisis entregado y revisado.
- [ ] Si se aprueba el desarrollo, se actualiza este archivo con criterios implementables.
