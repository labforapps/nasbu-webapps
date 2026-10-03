# NAS-031 · [HU] Mensaje uniforme cuando una acción está bloqueada por permiso, plan o límite

| Campo | Valor |
| --- | --- |
| Tipo | Historia de usuario |
| Prioridad | P1 |
| Fase | F1 · Seguridad, permisos y planes |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend + frontend |
| Lista en Trello | Prioridades lanzamiento |
| Tarjeta(s) Trello | [yxG77Hmu](https://trello.com/c/yxG77Hmu) |
| Relacionado con | NAS-027, NAS-061, NAS-020, NAS-092 |

## Contexto

Cuando el usuario no puede avanzar por su tipo de permiso, por su plan o porque agotó un recurso, el sistema debe decírselo siempre con un mensaje claro. Ejemplo pedido: "No tienes acceso a esta acción por el tipo de permiso que cuentas". La tarjeta pide evaluar el esfuerzo y, si es alto, mover parte a otro sprint.

## Historia de usuario

**Como** usuario de Nasbu, **quiero** recibir un mensaje claro cuando una acción está bloqueada, **para** entender por qué no puedo continuar y qué necesito.

## Criterios de aceptación

- [ ] Existe un mecanismo central (interceptor HTTP o guard) que traduce respuestas 403 y de límite a un toast con texto según la causa: permiso, plan o límite de recurso.
- [ ] Ninguna acción bloqueada termina en error genérico, pantalla en blanco o error 403 visible al usuario.
- [ ] Textos base: permiso → "No tienes acceso a esta acción por el tipo de permiso que cuentas."; plan → "Tu plan actual no incluye esta función."; límite → "Alcanzaste el límite de <recurso> de tu plan."
- [ ] Hay un documento `docs/mapa-permisos.md` que lista cada acción bloqueable y su causa.
- [ ] Cubre como mínimo los casos de NAS-027, NAS-061 y NAS-020.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- Definir un cuerpo de error único: `{code: 'permission_denied'|'plan_feature_missing'|'plan_limit_reached', detail, feature_code?, contracted?, used?}`.
- `helpers/exceptions/exceptions.py`: escribir `feature_code` en `response.data` (hoy va a un header) y agregar `code` para cada excepción.
- `subscription/exceptions.py`: cambiar `status_code = 501` por 403 en las dos excepciones de plan.
- `helpers/permissions/permissions.py` (`HasSubscriptionPermission`): definir `message` y `code = 'permission_denied'`.
- Corregir H4 en `helpers/validations/validations.py` (`__execute_flag_validation__`: pasar la suscripción, no `self`).

### Frontend (`nasbu-webapps`)

- `projects/core-services/src/lib/services/security/interceptor.service.ts`: no reintentar respuestas 4xx (limitar `retry(2)` a errores de red/5xx).
- Nuevo `services/interceptors/blocked-action.interceptor.ts` registrado en `app.module.ts` junto a `SpinnerInterceptor`: mapea `code` a un toastr con claves i18n `blocked.permission`, `blocked.plan`, `blocked.limit` en `assets/i18n/es.json` y `en.json`.
- Permitir opt-out por header (`X-Skip-Blocked-Toast`) para pantallas que ya muestran su propio error, y evitar el doble toast.

### Pruebas

- BE `core/tests.py` o `helpers/tests.py`: cuerpo del error por cada excepción.
- FE `blocked-action.interceptor.spec.ts`: un toast por `code`; sin toast con el header de opt-out.

### Riesgos y dependencias

Pantallas que hoy muestran su propio toast de error pueden duplicar mensajes. Revisar callers que dependan del 501 (en el front no se encontró ninguno).

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-031:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
