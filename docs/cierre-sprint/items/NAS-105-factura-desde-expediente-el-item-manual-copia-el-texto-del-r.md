# NAS-105 · [BUG] Factura desde expediente: el ítem manual copia el texto del reembolso

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P3 |
| Fase | F2 · Defectos funcionales del front |
| Estado para Claude Code | Listo para desarrollo |
| Repos | frontend |
| Lista en Trello | Backlog defectos |
| Tarjeta(s) Trello | [7zIVpnIh](https://trello.com/c/7zIVpnIh) |

## Contexto

Al facturar desde un expediente con tareas completadas pendientes de facturación y agregar un reembolso, el reembolso se aplica bien. Pero al agregar después un ítem manual en Detalle de factura, el nuevo ítem trae el texto del desembolso en lugar de venir vacío.

## Pasos para reproducir

1. Abrir un expediente con tareas completadas pendientes de facturar y crear una factura.
2. Agregar un reembolso.
3. En Detalle de factura, agregar un ítem manual.

## Comportamiento actual

El ítem manual aparece con el texto del desembolso.

## Comportamiento esperado

El ítem manual aparece vacío.

## Criterios de aceptación

- [ ] Cada ítem nuevo se crea con un objeto nuevo y vacío.
- [ ] Editar el ítem manual no modifica el reembolso, y al revés.
- [ ] Prueba del flujo: reembolso → ítem manual vacío.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Frontend (`nasbu-webapps`)

- `pages/invoicing/new-invoice/new-invoice.component.html`: las filas de ítems normales iteran `filterFormArray('details','is_legal_charge',false)` pero enlazan `[formGroupName]="i"`, que es el índice en la lista filtrada. Con el reembolso en la posición n, el ítem manual nuevo queda enlazado a los datos del reembolso.
- Enlazar cada fila a su índice real (`detailsArray.controls.indexOf(ctrl)`) en las dos tablas.
- `services/form.service.ts` (`returnIndexFormArrayInvoiceDetail`) busca filas comparando valores; dos filas vacías colisionan. `removeItemFormArray` y `onChangeInvoiceDetail` deben trabajar con el control, no con el valor.

### Pruebas

- FE `new-invoice.component.spec.ts`: tarea + reembolso + ítem manual → el manual queda vacío y el reembolso intacto.

### Riesgos y dependencias

Cambio de binding en toda la plantilla de factura: probar ambas tablas.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-105:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
