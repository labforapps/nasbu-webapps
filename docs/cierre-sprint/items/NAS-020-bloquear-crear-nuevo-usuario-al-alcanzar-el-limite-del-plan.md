# NAS-020 · [HU] Bloquear "Crear nuevo usuario" al alcanzar el límite del plan

| Campo | Valor |
| --- | --- |
| Tipo | Historia de usuario |
| Prioridad | P3 |
| Fase | F1 · Seguridad, permisos y planes |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend + frontend |
| Lista en Trello | Backlog defectos |
| Tarjeta(s) Trello | [H5WZ6CfO](https://trello.com/c/H5WZ6CfO) |
| Relacionado con | NAS-031, NAS-064 |

## Contexto

Cuando la firma ya alcanzó el límite de usuarios de su plan, el botón "Crear nuevo usuario" no debería abrir el formulario, sino mostrar un toast de límite alcanzado.

## Historia de usuario

**Como** administrador de la firma, **quiero** saber antes de llenar el formulario que llegué al límite de usuarios, **para** no perder tiempo y entender qué hacer.

## Criterios de aceptación

- [ ] Con el límite alcanzado, "Crear nuevo usuario" no abre el formulario y muestra: "Alcanzaste el límite de usuarios de tu plan."
- [ ] El backend también rechaza la creación con causa `LIMIT_REACHED`.
- [ ] Usa el mecanismo de NAS-031.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- El backend ya bloquea (hoy con 501, `security/views.py` → `helpers/validations/validations.py`). Con NAS-031 pasa a 403 `plan_limit_reached`.
- La corrección H3 (NAS-073) evita que el límite caiga a 1 tras un cambio de plan.

### Frontend (`nasbu-webapps`)

- `pages/collaborator/collaborator.component.html`: cambiar el `routerLink` a `/user/create` por un `(click)` que compare `subscription/features/users` contra el uso y muestre el toast de límite. Reutilizar la lógica de `components/subscription-banner/subscription-banner.component.ts`.
- Agregar un guard a la ruta `user/create` en `app-routing.module.ts`.

### Pruebas

- FE `collaborator.component.spec.ts`: con el límite alcanzado no navega y muestra el toast.
- BE `security/tests.py`: crear por encima del límite → `plan_limit_reached`.

### Riesgos y dependencias

Verificar que el uso de USERS no se descuente dos veces entre `delete_user` y el soft delete que entró en el PR #118.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-020:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
