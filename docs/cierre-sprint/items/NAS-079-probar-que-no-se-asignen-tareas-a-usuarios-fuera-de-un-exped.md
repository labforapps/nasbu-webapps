# NAS-079 · [BUG] Probar que no se asignen tareas a usuarios fuera de un expediente privado

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P1 |
| Fase | F1 · Seguridad, permisos y planes |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend + frontend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [6xGOtIgk](https://trello.com/c/6xGOtIgk) |
| Relacionado con | NAS-038 |

## Contexto

Hay que verificar que no se pueda asignar una tarea a un usuario que no es miembro de un expediente privado.

## Escenarios a cubrir

- En un expediente privado, el selector de responsables solo muestra miembros.
- La API rechaza asignar a un no miembro aunque se envíe su id directamente.
- Un no miembro no ve el expediente privado en listados ni reportes (ver NAS-038).

## Criterios de aceptación

- [ ] Pruebas automatizadas (API y/o e2e) que cubren los escenarios listados y pasan en CI.
- [ ] Los defectos encontrados se reportan como tarjetas BUG nuevas, con pasos y causa.
- [ ] Lista de verificación manual para que el cliente valide en su ambiente.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- `practice/models.py`: nuevo `CaseFile.user_has_access(subscription_user)` (dueño asignado o `CaseFileUserAccess` activo).
- `practice/serializers.py` (`TaskWriteSerializer.validate`): si el expediente es `PRIVATE` y el asignado no tiene acceso, devolver 400.

### Frontend (`nasbu-webapps`)

- `components/dialogs/dialog-new-task/dialog-new-task.component.ts` (`onChangeCaseFile`): filtrar `securityUsers` con `assigned_to` y `case_file_user_access` del expediente y limpiar `assigned_to` si ya no es válido.

### Pruebas

- BE `practice/tests.py`: crear y actualizar tarea rechazados para no miembro; aceptados para miembro y dueño.
- FE `dialog-new-task.component.spec.ts`: el selector muestra solo miembros.

### Riesgos y dependencias

Definir si los usuarios con `VIEW_ALL_CASE_FILES` pueden ser asignados, y si el `executed_by` del temporizador sigue la misma regla.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-079:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
