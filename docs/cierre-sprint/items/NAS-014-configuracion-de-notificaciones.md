# NAS-014 · [HU] Configuración de notificaciones

| Campo | Valor |
| --- | --- |
| Tipo | Historia de usuario |
| Prioridad | P3 |
| Fase | F0 · Prerrequisitos |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend + frontend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [eJOlyz8y](https://trello.com/c/eJOlyz8y) |
| Relacionado con | NAS-088, NAS-106 |

## Contexto

El usuario o la firma necesita configurar sus notificaciones. Es un feature sin desarrollar; primero hay que aprobar el alcance.

## Historia de usuario

**Como** usuario de Nasbu, **quiero** elegir qué notificaciones recibo y por qué canal, **para** no recibir avisos que no necesito.

## Criterios de aceptación

- [ ] Pantalla de configuración con cada tipo de notificación y canal (correo, SMS, en app) activable.
- [ ] Las preferencias se respetan en todos los envíos.
- [ ] Antes de implementar, hay un documento de alcance aprobado por el cliente.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- Implementado en la rama remota `features/notification-preferences` (modelo `NotificationPreference`, `GET/PATCH /subscription/notification_preferences/`, migración 0030, `docs/notifications.md`), sin mergear a `master` (H8).

### Frontend (`nasbu-webapps`)

- Ya implementado en `master`: `pages/configuration/notification/` y `projects/core-services/src/lib/services/subscription/subscription-notifications.service.ts`.

### Pruebas

- Existen: `subscription/test_notifications.py` (BE) y `npm run test:notifications` (FE).

### Riesgos y dependencias

El merge choca con los commits recientes de `master` en `subscription/models.py` y `security/views.py`.

## Preguntas abiertas

- ¿La configuración es por usuario, por firma o ambas?
- ¿Los horarios de NAS-088 son configurables aquí?

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-014:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
