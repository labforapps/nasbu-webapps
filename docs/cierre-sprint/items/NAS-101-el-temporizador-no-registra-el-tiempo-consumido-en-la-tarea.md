# NAS-101 · [BUG] El temporizador no registra el tiempo consumido en la tarea asignada

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P1 |
| Fase | F2 · Defectos funcionales del front |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend + frontend |
| Lista en Trello | En curso |
| Tarjeta(s) Trello | [TNptWo2B](https://trello.com/c/TNptWo2B) |
| Relacionado con | NAS-102, NAS-029, NAS-046 |

## Contexto

Se usó el temporizador y, al detenerlo, se asignó la tarea "Llamar cliente para dar orientación" al usuario mariela@mailinator.com. En el listado de tareas, la tarea no muestra el tiempo consumido.

## Pasos para reproducir

1. Iniciar el temporizador y dejarlo correr unos minutos.
2. Detenerlo y, en el diálogo, asignar una tarea existente y un usuario.
3. Ir al listado de tareas y revisar el tiempo de esa tarea.

## Comportamiento actual

La tarea no tiene registrado el tiempo medido.

## Comportamiento esperado

El tiempo medido se suma al tiempo consumido de la tarea y se refleja en el listado, en la facturación y en el reporte de horas.

## Criterios de aceptación

- [ ] Al detener el temporizador y asignar una tarea, el tiempo se guarda y aparece en el listado sin recargar.
- [ ] Si la tarea ya tenía tiempo, el nuevo se suma.
- [ ] El tiempo se refleja en la facturación por incremento de tiempo (NAS-029) y en el reporte de horas (NAS-046).
- [ ] Prueba que cubre detener → asignar → persistir.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- `practice/serializers.py`: `get_total_hours_detail` y `get_total_minutes_detail` están invertidos (también en `TaskReadRefSerializer`).
- `practice/views.py` (acción `time_details`): filtra `Task.objects.filter(task=instance)`; debe consultar `TaskTimeDetail`. Hoy da error 500.
- `practice/models.py` (`get_task_time_detail_total_amt`): devuelve `None` para tareas no facturables; devolver 0.

### Frontend (`nasbu-webapps`)

- `components/layout/header/header.component.ts`: abre `DialogAddHoursComponent` sin datos ni `afterClosed`; suscribirse y emitir un refresco por `TaskTimeService` para que `taskpage.component.ts` recargue.
- `components/dialogs/dialog-add-hours/dialog-add-hours.component.ts`: `onSelectTask` lee `this.taskTime.total_time` con `taskTime` indefinido; `submitForm` calcula la duración con `countUp.totalSeconds/60`, que redondea a 0. Calcular desde `currentTaskTimeInfo.startAt` hasta ahora, redondeando al minuto superior.

### Pruebas

- BE `practice/tests.py`: `time_details` y `total_hours` correctos.
- FE `dialog-add-hours.component.spec.ts`: duración correcta con temporizador iniciado desde el header.

### Riesgos y dependencias

El listado (`task-table.component.html`) solo muestra horas para tareas por hora o por incremento; confirmar si el cliente quiere verlas también en tarifa fija.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-101:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
