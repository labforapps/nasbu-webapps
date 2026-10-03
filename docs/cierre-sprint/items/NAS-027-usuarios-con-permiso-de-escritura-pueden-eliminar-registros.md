# NAS-027 · [BUG] Usuarios con permiso de escritura pueden eliminar registros

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P2 |
| Fase | F1 · Seguridad, permisos y planes |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend + frontend |
| Lista en Trello | En curso |
| Tarjeta(s) Trello | [F1jD5yHM](https://trello.com/c/F1jD5yHM) |
| Relacionado con | NAS-031 |

## Contexto

En la sección Permisos, un usuario con permiso de escritura no debería poder eliminar. Si lo intenta, debe ver un toast que indique que su permiso no le permite esa acción.

## Pasos para reproducir

1. Crear un usuario con permiso de escritura (no de eliminación).
2. Iniciar sesión con ese usuario e intentar eliminar un registro.

## Comportamiento actual

El registro se elimina.

## Comportamiento esperado

La eliminación se rechaza y aparece el toast de permiso.

## Criterios de aceptación

- [ ] El backend rechaza la eliminación para usuarios sin permiso de eliminar (403 con causa `PERMISSION_DENIED`).
- [ ] El frontend muestra el toast de permiso (NAS-031) y, si es posible, oculta o deshabilita la acción.
- [ ] Se revisan todos los módulos con acción de eliminar.
- [ ] Pruebas de API por módulo para los roles escritura y administrador.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- Corregir H2 en `mixins/viewsets/viewsets.py`: mapear `destroy` → `delete` y `partial_update` → `change`.
- Revisar `@action` personalizados que eliminan o modifican (ej.: `delete_user`) y asignarles el prefijo correcto.

### Frontend (`nasbu-webapps`)

- Agregar `*ngxPermissionsOnly` a los botones de eliminar que no lo tienen: `pages/documents-templates/documents/documents.component.html` y `pages/collaborator/collaborator.component.html` (`deleteCollaborator`).
- El toast de permiso lo muestra el interceptor de NAS-031.

### Pruebas

- BE `security/tests.py`: usuario en grupo de escritura recibe 403 en DELETE; administrador recibe 204. Repetir en al menos `catalog` y `practice`.

### Riesgos y dependencias

Endurece el acceso en todos los viewsets. Grupos personalizados que hoy eliminan sin el permiso `delete_` dejarán de poder: revisarlos antes de publicar. Las definiciones de acceso de escritura en `core/management/commands/reloadpermissions.py` ya excluyen `delete_`.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-027:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
