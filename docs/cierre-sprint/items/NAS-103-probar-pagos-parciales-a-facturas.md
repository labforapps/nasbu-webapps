# NAS-103 · [QA] Probar pagos parciales a facturas

| Campo | Valor |
| --- | --- |
| Tipo | Pruebas |
| Prioridad | P2 |
| Fase | F3 · Facturación y reportes |
| Estado para Claude Code | QA – pruebas automatizadas |
| Repos | backend + frontend |
| Lista en Trello | Pendiente de probar por usuario |
| Tarjeta(s) Trello | [6t4sQQgx](https://trello.com/c/6t4sQQgx) |
| Relacionado con | NAS-098, NAS-038 |

## Contexto

Los pagos parciales a facturas están pendientes de validación por el cliente.

## Escenarios a cubrir

- Registrar un pago parcial: el saldo pendiente baja y la factura queda en estado parcial.
- Registrar varios pagos hasta saldar: la factura pasa a pagada.
- Un pago mayor al saldo se rechaza con un mensaje claro.
- El estado de cuenta (NAS-038) refleja los pagos parciales.

## Criterios de aceptación

- [ ] Pruebas automatizadas (API y/o e2e) que cubren los escenarios listados y pasan en CI.
- [ ] Los defectos encontrados se reportan como tarjetas BUG nuevas, con pasos y causa.
- [ ] Lista de verificación manual para que el cliente valide en su ambiente.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- `accounting/models.py` (`Payment.create_payment`) ya rechaza sobrepagos y marca pagada la factura al saldarla. Corregir: eliminar un pago no limpia `payed_at`; `get_payment_method_desc` evalúa `CREDIT_CARD` dos veces y nunca muestra "Transferencia"; comparar montos con `Decimal`.

### Frontend (`nasbu-webapps`)

- `components/dialogs/dialog-payment-register/dialog-payment-register.component.ts`: validar monto máximo igual al saldo pendiente.

### Pruebas

- BE `accounting/tests.py`: dos pagos parciales cierran la factura; sobrepago da error; eliminar un pago revierte estado y `payed_at`.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-103:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
