# NAS-109 · [BUG] Reporte de casos: la columna "# No. Fact." debe ser "Num. de Caso"

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P2 |
| Fase | F3 · Facturación y reportes |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [GQOsPV30](https://trello.com/c/GQOsPV30) |
| Relacionado con | NAS-048 |

## Contexto

En el reporte de casos, la segunda columna se titula "# No. Fact.". Debe llamarse "Num. de Caso" y mostrar el número de caso de cada expediente.

## Criterios de aceptación

- [ ] La segunda columna se titula "Num. de Caso".
- [ ] La columna muestra el número de caso del expediente.
- [ ] La exportación del reporte usa el mismo encabezado y valores.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- `reports/templates/case_files_report.html`: el encabezado dice `#No. Fact.` y la celda imprime un `1` fijo. Cambiar a `Num. de Caso` y `{{cf.case_no}}`.

### Pruebas

- BE `reports/tests.py` (junto con NAS-048).

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-109:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
