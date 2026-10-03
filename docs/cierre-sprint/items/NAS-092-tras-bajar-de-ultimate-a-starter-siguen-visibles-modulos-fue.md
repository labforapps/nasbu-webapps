# NAS-092 · [BUG] Tras bajar de Ultimate a Starter siguen visibles módulos fuera del plan

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P1 |
| Fase | F1 · Seguridad, permisos y planes |
| Estado para Claude Code | Requiere decisión del cliente |
| Repos | backend + frontend |
| Lista en Trello | Prioridades lanzamiento |
| Tarjeta(s) Trello | [JxCgkHLP](https://trello.com/c/JxCgkHLP) |
| Relacionado con | NAS-073, NAS-031 |

## Contexto

Al cambiar una cuenta de Ultimate a Starter, la vista del usuario y la suscripción siguen mostrando módulos que no forman parte de Starter, por ejemplo Documentos y plantillas.

## Pasos para reproducir

1. Iniciar sesión con una cuenta en plan Ultimate.
2. Cambiar el plan a Starter.
3. Revisar el menú principal y la vista de Suscripción.

## Comportamiento actual

Documentos y plantillas, y otros módulos de Ultimate, siguen visibles y accesibles.

## Comportamiento esperado

El acceso a los módulos se ajusta al plan según la regla de negocio que defina el cliente.

## Criterios de aceptación

- [ ] La regla aplicada (inmediata o al final del ciclo) está documentada y es configurable en un solo punto.
- [ ] Cuando el downgrade entra en efecto, los módulos fuera de Starter no aparecen en el menú y sus rutas o endpoints responden con el mensaje de plan (ver NAS-031).
- [ ] Si el acceso se mantiene hasta fin de ciclo, la vista de Suscripción muestra la fecha en que el cambio será efectivo.
- [ ] Los datos creados en módulos de Ultimate no se eliminan al bajar de plan.
- [ ] Hay pruebas para downgrade inmediato y diferido.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- Aplicar la misma corrección H1/H3 en el downgrade.
- Nuevo permiso `PlanModulePermission` que valide el módulo del viewset contra `PlanAccessDefinition` (`core/models.py`); hoy es solo de visualización y `reloadplanaccessdefinitions` da todos los módulos a todos los planes.
- Si el cliente elige downgrade al final del ciclo: `SubscriptionChangePlanRequest` con estado `PENDING` + `effective_date` y una tarea Django-Q que lo aplique. Dejar la regla en un solo punto de configuración.

### Frontend (`nasbu-webapps`)

- `app-routing.module.ts`: agregar `NgxPermissionsGuard` a la ruta `templates` (hoy sin guard). El menú ya oculta la entrada por `view_documenttemplate`.
- Recargar permisos tras el cambio de plan (igual que NAS-073).

### Pruebas

- BE `subscription/tests.py`: tras downgrade, `view_documenttemplate` desaparece y GET a plantillas devuelve 403 con `code = plan_feature_missing`.

### Riesgos y dependencias

El código actual aplica el cambio de inmediato y no tiene estado de cambio programado.

## Preguntas abiertas

- ¿El cliente conserva los features de Ultimate hasta terminar el ciclo pagado, o los pierde de inmediato?
- ¿Qué pasa con documentos o plantillas existentes al bajar de plan: solo lectura u ocultos?

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-092:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
