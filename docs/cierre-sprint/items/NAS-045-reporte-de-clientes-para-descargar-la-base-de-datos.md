# NAS-045 · [HU] Reporte de clientes para descargar la base de datos

| Campo | Valor |
| --- | --- |
| Tipo | Historia de usuario |
| Prioridad | P3 |
| Fase | F6 · Análisis y definición con el cliente |
| Estado para Claude Code | Requiere definición (análisis) |
| Repos | backend + frontend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [A2AizFjo](https://trello.com/c/A2AizFjo) |

## Contexto

La firma quiere descargar su base de datos de clientes como reporte. Es un feature sin desarrollar; primero hay que aprobar el alcance.

## Historia de usuario

**Como** administrador de la firma, **quiero** descargar la lista de mis clientes, **para** usarla fuera de Nasbu.

## Criterios de aceptación

- [ ] Exportación a Excel/CSV con los campos del cliente y sus contactos.
- [ ] Solo disponible para roles con permiso de exportar.
- [ ] Antes de implementar, hay un documento de alcance aprobado por el cliente.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- `CustomerReportGenerator` (`reports/generators/generators.py`) es un stub. El permiso `view_customers_report` existe pero no hay endpoint.
- Completar el generador sobre `catalog.Customer`, `CustomerReportViewSet` en `/reports/customers/` y salida Excel/CSV (la vista de reportes no tiene rama CSV). Aplicar el filtro de acceso de NAS-038.

### Frontend (`nasbu-webapps`)

- `pages/report/report-client/report-client.component.ts` es una clase vacía con HTML estático. Agregar método en `ReportsService` (`core-services`) y conectar como `report-cases`.

### Pruebas

- BE `reports/tests.py`: permiso, solo clientes de la firma y columnas.

### Riesgos y dependencias

Definir columnas y formato.

## Preguntas abiertas

- ¿Qué campos incluye y en qué formato?

## Definición de terminado

- [ ] Documento de análisis entregado y revisado.
- [ ] Si se aprueba el desarrollo, se actualiza este archivo con criterios implementables.
