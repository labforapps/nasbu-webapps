# NAS-067 · [HU] Destino del enlace en el correo de tarea asignada

| Campo | Valor |
| --- | --- |
| Tipo | Historia de usuario |
| Prioridad | P3 |
| Fase | F0 · Prerrequisitos |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend + frontend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [7kx1dS4L](https://trello.com/c/7kx1dS4L) |
| Relacionado con | NAS-014 |

## Contexto

Cuando a un usuario se le asigna una tarea, recibe un correo. Hay que definir adónde lleva el enlace; lo esperado es abrir la tarjeta de la tarea, editable o no según su permiso.

## Criterios de aceptación

- [ ] Documento `docs/analisis/NAS-067.md` con: situación actual en el código, opciones de solución, recomendación y estimación.
- [ ] Las preguntas abiertas de esta tarjeta quedan respondidas o listadas para el cliente.
- [ ] Si se aprueba la opción "abrir la tarjeta de la tarea", la implementación es: deep link → login si hace falta → tarea abierta.
- [ ] No se modifica código de producción hasta que el cliente apruebe la propuesta.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- En `master`, `Task.__create_and_send_assigned_task_notification__` (`practice/models.py`) envía `callback_uri: None` y la reasignación no notifica. La rama `features/notification-preferences` arma `/#/task?task=<uuid>&ssid=<sub>`.

### Frontend (`nasbu-webapps`)

- Ya implementado: `pages/taskpage/taskpage.component.ts` (`openLinkedTask`), `AuthGuard` con URL de retorno y enlaces de la campana en `header.component.ts`.

### Pruebas

- Tests de la rama y `pages/notification-links.spec.ts`.

### Riesgos y dependencias

Verificar que la plantilla de SendGrid tenga el botón con `{{callback_url}}` (se configura fuera de los repos).

## Preguntas abiertas

- ¿El enlace abre la tarea en modo vista o edición según el permiso?
- ¿Qué pasa si el usuario no tiene sesión iniciada?

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-067:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
