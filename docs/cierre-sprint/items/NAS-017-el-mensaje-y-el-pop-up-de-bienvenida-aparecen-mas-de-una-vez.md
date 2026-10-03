# NAS-017 · [BUG] El mensaje y el pop-up de bienvenida aparecen más de una vez

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P2 |
| Fase | F2 · Defectos funcionales del front |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend + frontend |
| Lista en Trello | Backlog defectos |
| Tarjeta(s) Trello | [dPQVwkka](https://trello.com/c/dPQVwkka), [GYDwkUVK](https://trello.com/c/GYDwkUVK) |

## Contexto

Unifica las tarjetas #17 y #26. El pop-up de bienvenida sigue apareciendo después de iniciar el proceso y completar uno de sus pasos. El mensaje de bienvenida debería salir solo en el primer ingreso, pero aparece repetidas veces.

## Pasos para reproducir

1. Crear una cuenta nueva e iniciar sesión.
2. Ver el pop-up de bienvenida y completar uno de los pasos.
3. Navegar a otra sección, recargar o cerrar sesión y volver a entrar.

## Comportamiento actual

El pop-up de bienvenida vuelve a aparecer.

## Comportamiento esperado

El pop-up aparece solo en el primer ingreso y deja de mostrarse al iniciar el proceso.

## Criterios de aceptación

- [ ] El estado de bienvenida vista se guarda en el backend por usuario, no solo en el almacenamiento local.
- [ ] No se vuelve a mostrar tras recargar, cerrar sesión o entrar desde otro dispositivo.
- [ ] Si el usuario completa un paso del onboarding, el pop-up no reaparece.
- [ ] Prueba que cubre primer ingreso → visto → no se repite.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- `security/models.py`: campo `welcome_seen_at` en `SubscriptionUser` (migración) expuesto en el endpoint de información del usuario, más `POST /security/me/welcome_seen/` en `security/views.py`.

### Frontend (`nasbu-webapps`)

- `pages/login/login.component.ts`: pone `first_login_<username>=true` cada vez que falta la clave en localStorage (cada navegador nuevo). `components/layout/layout.component.ts` abre `DialogIntakeComponent` con ese flag.
- `components/subscription-banner/subscription-banner.component.ts`: la clave `nasbu_welcome_shown` es global, no por usuario, e ignora el avance del onboarding.
- Mostrar el diálogo y el banner solo si `welcome_seen_at` es nulo y `stepsCompleted === 0` (`components/onboarding/onboarding.component.ts`); marcarlo visto al mostrarlo. Quitar la lógica de localStorage.

### Pruebas

- BE `security/tests.py`: el endpoint marca la fecha una sola vez.
- FE specs de `layout` y `subscription-banner`.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-017:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
