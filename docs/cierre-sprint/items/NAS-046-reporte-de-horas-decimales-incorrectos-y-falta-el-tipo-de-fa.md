# NAS-046 · [BUG] Reporte de horas: decimales incorrectos y falta el tipo de facturación

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P2 |
| Fase | F3 · Facturación y reportes |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [dUkhBKi5](https://trello.com/c/dUkhBKi5) |
| Relacionado con | NAS-029, NAS-101 |

## Contexto

En el reporte de horas invertidas hay que corregir los decimales e indicar el tipo de facturación de cada tarea (Incremento de tiempo, etc.).

## Criterios de aceptación

- [ ] Las horas se muestran con 2 decimales y redondeo consistente; el total cuadra con la suma de las filas.
- [ ] Se agrega la columna "Tipo de facturación" con la modalidad de cada tarea.
- [ ] Para tareas por incremento, la columna muestra también el número de incrementos (cálculo de NAS-029).
- [ ] La exportación del reporte refleja los mismos valores.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- Corresponde al reporte de Estado de cuenta (columna "Hrs. invertidas"): `reports/templates/wallet_detail_statement.html` imprime `task.task_total_hours` sin redondear.
- Aplicar `|floatformat:2` (o hh:mm) y mostrar el tipo de facturación con `get_billing_type_desc` (`reports/generators/generators.py`) en lugar del código `H/F/T`.
- Eliminar la copia obsoleta `catalog/templates/wallet_detail_statement.html` (Django usa la de `reports/templates`).

### Pruebas

- BE `reports/tests.py`: tarea de 13 min → "0.22" y el tipo en texto.

### Riesgos y dependencias

Confirmar con QA que "reporte de horas invertidas" es este reporte.

## Preguntas abiertas

- ¿Prefieren horas decimales (1.25 h) o formato hh:mm (1:15)?

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-046:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
