# NAS-038 · [BUG] Estado de cuenta: al filtrar por usuario aparecen expedientes que no le corresponden

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P1 |
| Fase | F1 · Seguridad, permisos y planes |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend + frontend |
| Lista en Trello | Backlog defectos |
| Tarjeta(s) Trello | [3ohM4g8U](https://trello.com/c/3ohM4g8U) |
| Relacionado con | NAS-079 |

## Contexto

En Reportes → Estado de cuenta, al filtrar por usuario para elegir los expedientes del reporte, aparecen todos los expedientes, incluidos los que no le corresponden. La tarjeta no tiene prioridad, pero se sube a P1 por posible exposición de datos entre usuarios.

## Pasos para reproducir

1. Ir a Reportes → Estado de cuenta.
2. Filtrar por un usuario que tenga solo algunos expedientes.
3. Revisar la lista de expedientes disponibles.

## Comportamiento actual

Aparecen todos los expedientes de la firma.

## Comportamiento esperado

Solo aparecen los expedientes asociados al usuario filtrado y que el usuario actual tiene permiso de ver.

## Criterios de aceptación

- [ ] El filtro por usuario devuelve solo los expedientes asociados a ese usuario.
- [ ] El backend aplica el filtro; no basta con filtrar en el frontend.
- [ ] Los expedientes privados (ver NAS-079) solo aparecen a sus miembros.
- [ ] Prueba de API que verifica que un usuario no recibe expedientes ajenos.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- Pasar el `request` (o el `SubscriptionUser` y si puede ver todos los expedientes) a los generadores de reportes desde `get_payload` en `mixins/viewsets/viewsets.py`.
- Crear un helper de acceso reutilizable con la regla del listado de expedientes (`practice/views.py` + `is_owner_or_can_access_all_case_files` en `practice/permissions/permissions.py`): público, asignado o con `CaseFileUserAccess`.
- Aplicarlo en los generadores de estado de cuenta, facturas y casos (`reports/generators/generators.py`) y rechazar `case_file`/`customer` no accesibles.
- Agregar el campo `case_file` a `CaseFilesReportPayloadSerializer` (`reports/serializers/serializers.py`); hoy se descarta en silencio.

### Frontend (`nasbu-webapps`)

- `pages/report/report-customer-wallet-details/`: filtrar la lista de expedientes según el usuario elegido.
- `pages/report/report-cases/report-cases.component.ts`: acotar el desplegable de expedientes al abogado elegido.

### Pruebas

- BE nuevo `reports/tests.py`: un usuario no dueño recibe solo sus expedientes y los públicos; pedir un expediente privado ajeno devuelve vacío o 403.

### Riesgos y dependencias

La pantalla de estado de cuenta no tiene filtro explícito por usuario; confirmar con el cliente qué filtro usaba al reportar el defecto.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-038:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
