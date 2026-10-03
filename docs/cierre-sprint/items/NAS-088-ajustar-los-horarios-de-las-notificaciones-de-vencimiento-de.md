# NAS-088 · [HU] Ajustar los horarios de las notificaciones de vencimiento de tareas

| Campo | Valor |
| --- | --- |
| Tipo | Historia de usuario |
| Prioridad | P3 |
| Fase | F5 · Notificaciones y SMS |
| Estado para Claude Code | Requiere decisión del cliente |
| Repos | backend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [RdD9fmqn](https://trello.com/c/RdD9fmqn) |
| Relacionado con | NAS-014 |

## Contexto

Kenneth pidió por el chat grupal un nuevo esquema de 3 notificaciones de vencimiento de tareas.

## Historia de usuario

**Como** usuario con tareas asignadas, **quiero** recibir recordatorios en horarios útiles antes y durante el día de vencimiento, **para** no dejar vencer mis tareas.

## Criterios de aceptación

- [ ] Primera notificación: 4:00 p. m. del día anterior al vencimiento.
- [ ] Segunda notificación: 8:00 a. m. del día de vencimiento.
- [ ] Tercera y última: 1:00 p. m. del día de vencimiento.
- [ ] Los horarios usan la zona horaria de la firma (por defecto America/Santo_Domingo).
- [ ] Las tareas completadas antes de un envío no reciben las notificaciones restantes.
- [ ] Los horarios están en configuración, no fijos en el código.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- Prerrequisito F0 (merge de `features/notification-preferences`). En esa rama, `NotificationEvent.generate_due_notifications` emite `task_due_soon` una sola vez (tareas que vencen mañana) y un sweep corre cada 5 minutos.
- Agregar slots configurables (ej.: `TASK_DUE_REMINDER_SLOTS = [(-1,'16:00'),(0,'08:00'),(0,'13:00')]`), calcular con `ZoneInfo('America/Santo_Domingo')` sin cambiar `TIME_ZONE` global, y emitir con sufijo `f"{due_date}:{slot}"` para deduplicar por envío. Incluir tareas que vencen hoy.

### Pruebas

- BE `subscription/test_notifications.py` con tiempo congelado: tres eventos distintos, sin duplicados entre barridos y nada para tareas cerradas.

### Riesgos y dependencias

Definir si los horarios son globales o por suscripción. Con el barrido de 5 min, un envío puede llegar hasta 5 min tarde.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-088:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
