# NAS-029 · [HU] Desglosar en el PDF de factura los cobros por incremento de tiempo

| Campo | Valor |
| --- | --- |
| Tipo | Historia de usuario |
| Prioridad | P1 |
| Fase | F3 · Facturación y reportes |
| Estado para Claude Code | Requiere decisión del cliente |
| Repos | backend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [ZWkaga2u](https://trello.com/c/ZWkaga2u) |
| Relacionado con | NAS-046, NAS-101 |

## Contexto

Cuando se factura una tarea con modalidad de cobro "Incremento de tiempo", el PDF no deja claro de dónde sale el monto. El cliente pide cambiar los valores sin alterar el diseño. La tarjeta adjunta dos PDF: "Factura referencia Incremento.pdf" (modelo a aplicar) y "Versión actual a modificar de la factura.pdf".

## Historia de usuario

**Como** cliente de la firma que recibe la factura, **quiero** ver cuántos incrementos se cobraron y a qué costo, **para** entender el monto facturado sin tener que preguntar.

## Criterios de aceptación

- [ ] Solo aplica a tareas con modalidad "Incremento de tiempo"; las demás líneas no cambian.
- [ ] La columna Cantidad muestra el número de incrementos, redondeado hacia arriba: ceil(minutos consumidos / minutos por incremento). Ejemplo: 13 min con incremento de 12 min → 2.
- [ ] Debajo de la descripción de la tarea aparece: "Costo de incremento o fracción de minutos: $<costo>. Total de minutos consumidos: <min> equivalente a <n> incrementos".
- [ ] Total de la línea = Cantidad × costo del incremento, y cuadra con el total de la factura.
- [ ] El diseño del PDF no cambia y coincide con el PDF de referencia de la tarjeta.
- [ ] Prueba unitaria del cálculo con casos borde: 0 min, múltiplo exacto y 1 minuto por encima.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- `accounting/templates/invoice.html`: la columna Cantidad imprime `item.detail_total_hours` (horas decimales).
- `accounting/models.py` (`InvoiceDetail`): agregar `is_time_increment`, `consumed_minutes` (sumando `TaskTimeDetail.total_time` de la tarea), `increments_count` y `increment_cost_amt`. Calcular desde minutos, no desde `total_hours` (2 decimales: 10 min → 0.17 h → 10.2 min da 3 incrementos de 5 en vez de 2).
- En `invoice.html`, dentro de `{% if item.is_time_increment %}`, mostrar los incrementos en Cantidad y la línea de desglose bajo la descripción.

### Pruebas

- BE `accounting/tests.py`: 13 min / 12 → 2; 10 min / 5 → 2; otros tipos sin cambios.

### Riesgos y dependencias

El cobro real no usa la fórmula de la historia: cobra horas completas a precio por hora y aplica incrementos solo a los minutos sobrantes, por registro de tiempo (`practice/models.py`, cálculo por `TaskTimeDetail`). Cantidad × costo no cuadraría con el total facturado. El cliente debe elegir: cambiar la regla de cobro o mostrar un desglose que refleje la regla actual.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-029:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
