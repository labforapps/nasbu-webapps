# NAS-104 · [QA] Probar factura manual, eliminación y demás acciones

| Campo | Valor |
| --- | --- |
| Tipo | Pruebas |
| Prioridad | P2 |
| Fase | F3 · Facturación y reportes |
| Estado para Claude Code | QA – pruebas automatizadas |
| Repos | backend + frontend |
| Lista en Trello | Pendiente de probar por usuario |
| Tarjeta(s) Trello | [bTDiGcoQ](https://trello.com/c/bTDiGcoQ) |
| Relacionado con | NAS-105, NAS-027 |

## Contexto

La factura manual y sus acciones (eliminar y demás) están pendientes de validación por el cliente.

## Escenarios a cubrir

- Crear una factura manual con varios ítems: los totales cuadran.
- Editar y eliminar ítems.
- Eliminar una factura: comportamiento según permisos (NAS-027) y estado de pago.
- Agregar un ítem manual después de un reembolso (NAS-105).

## Criterios de aceptación

- [ ] Pruebas automatizadas (API y/o e2e) que cubren los escenarios listados y pasan en CI.
- [ ] Los defectos encontrados se reportan como tarjetas BUG nuevas, con pasos y causa.
- [ ] Lista de verificación manual para que el cliente valide en su ambiente.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- `accounting/models.py` (`__save_or_update_details__`): borra ítems sin desactivar el débito de retainer vinculado (`related_wallet_transaction_detail`); el saldo del cliente queda debitado.
- `save_invoice_detail`: para ítems manuales solo calcula subtotal en `F` y `H`; un ítem `T` queda en 0.
- `InvoiceDetail.subtotal_amt`: error tipográfico `self.self`.
- `accounting/templates/invoice.html`: `{{loop.index1}}` no es sintaxis Django; usar `forloop.counter`.
- Cada guardado reenvía el correo al cliente; enviarlo solo al crear (confirmar con el cliente).

### Frontend (`nasbu-webapps`)

- `pages/invoicing/new-invoice/new-invoice.component.ts` (`onChangeInvoiceDetail`): manejar el tipo `T` o bloquearlo en ítems manuales.

### Pruebas

- BE `accounting/tests.py`: quitar un ítem con retainer restaura el saldo; eliminar factura con pagos da error; sin pagos libera los cargos.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-104:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
