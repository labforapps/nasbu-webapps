# NAS-098 · [HU] Métrica de porcentaje de facturas pagadas a tiempo

| Campo | Valor |
| --- | --- |
| Tipo | Historia de usuario |
| Prioridad | P3 |
| Fase | F3 · Facturación y reportes |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend + frontend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [Zv0dev7N](https://trello.com/c/Zv0dev7N) |
| Relacionado con | NAS-103 |

## Contexto

Desarrollar la métrica de porcentaje de pago a tiempo de las facturas a clientes. Es un feature sin desarrollar; primero hay que aprobar el alcance.

## Historia de usuario

**Como** socio de la firma, **quiero** ver qué porcentaje de facturas se pagan a tiempo, **para** medir la salud de cobros.

## Criterios de aceptación

- [ ] Fórmula: facturas pagadas en o antes de su vencimiento ÷ facturas con vencimiento en el período × 100.
- [ ] Filtrable por período y por cliente.
- [ ] Las facturas con pagos parciales (NAS-103) se cuentan como pagadas a tiempo solo si se saldaron antes del vencimiento.
- [ ] Antes de implementar, hay un documento de alcance aprobado por el cliente.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- `reports/generators/generators.py` (`GeneralMetricsReportGenerator`): `total_customer_percentage = 100` está fijo. Calcular facturas con vencimiento en el período pagadas en o antes de `inv_exp_date` ÷ facturas con vencimiento en el período; 0 si no hay.
- Corregir de paso `total_tasks`, que usa `created_at__lte=start_date`.

### Frontend (`nasbu-webapps`)

- Sin cambios: `pages/report/general-metrics/general-metrics.component.html` ya muestra el valor.

### Pruebas

- BE `reports/tests.py`: a tiempo, tarde, impaga y sin facturas.

### Riesgos y dependencias

Depende de la corrección de `payed_at` de NAS-103. Confirmar si se mide por factura o por cliente.

## Preguntas abiertas

- ¿Dónde se muestra la métrica (dashboard, reporte)?
- ¿Cómo se tratan los pagos parciales?

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-098:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
