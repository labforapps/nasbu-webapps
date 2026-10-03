# NAS-048 · [BUG] Reporte de casos: la fecha de creación y la de cierre salen iguales

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P2 |
| Fase | F3 · Facturación y reportes |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [qZE8jkmv](https://trello.com/c/qZE8jkmv) |
| Relacionado con | NAS-109 |

## Contexto

En el reporte de casos, la fecha de creación y la de cierre aparecen iguales, como si el caso se hubiera abierto y cerrado el mismo día.

## Criterios de aceptación

- [ ] La fecha de creación muestra la fecha real de creación del expediente o caso.
- [ ] La fecha de cierre muestra la fecha real de cierre o queda vacía si el caso sigue abierto.
- [ ] Prueba con un caso creado y cerrado en días distintos.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- `practice/models.py` (`CaseFile.change_status`): llama a `self.save()` antes de asignar `self.closed_at = tz_now()` y no vuelve a guardar, así que la fecha de cierre nunca se persiste. Asignar antes de guardar y limpiarla al reabrir.
- Migración de datos para expedientes ya cerrados (mejor aproximación: `updated_at`).
- `reports/templates/case_files_report.html`: formatear ambas fechas con `|date:"d/m/Y"`.
- `reports/generators/generators.py` (`get_base_queryset`): compara datetime con date y pierde registros del último día; usar `created_at__date__range`.

### Pruebas

- BE `practice/tests.py`: `closed_at` se guarda tras `change_status(CLOSED)`.
- BE `reports/tests.py`: las dos columnas difieren.

### Riesgos y dependencias

Reproducir en QA: por el código la fecha de cierre debería salir "-", no igual a la de creación.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-048:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
