# NAS-089 · [BUG] El PDF de la factura no muestra el teléfono de la firma

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P3 |
| Fase | F3 · Facturación y reportes |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend |
| Lista en Trello | Backlog defectos |
| Tarjeta(s) Trello | [eUR5B6pH](https://trello.com/c/eUR5B6pH) |
| Relacionado con | NAS-096 |

## Contexto

En el PDF de las facturas que la firma emite a su cliente, aparecen todos los datos de la firma excepto el teléfono. La tarjeta tiene una captura adjunta.

## Criterios de aceptación

- [ ] El PDF muestra el teléfono registrado en Perfil de la firma.
- [ ] Si no hay teléfono, la línea se omite sin dejar etiqueta vacía.
- [ ] Prueba que genera el PDF con y sin teléfono.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- `accounting/templates/invoice.html` usa `subscription.first_contact_phonenumber` (contacto tipo `P`). Al alta el teléfono queda en `None` y `update_subscription` no lo actualiza.
- Nueva propiedad `Subscription.display_phone` (primer contacto `P`, luego `phone_number`, luego `contact_phone_number`) y usarla en `invoice.html`, `payment.html` y `wallet_detail_statement.html`.
- Los PDF se generan al guardar la factura; las facturas anteriores no cambian salvo que se regenere al descargar (`accounting/views.py`, acción `download`).

### Pruebas

- BE `accounting/tests.py`: el teléfono aparece con solo contacto `P` y con solo `phone_number`.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-089:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
