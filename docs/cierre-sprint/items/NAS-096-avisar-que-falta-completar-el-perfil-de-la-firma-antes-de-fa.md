# NAS-096 · [HU] Avisar que falta completar el perfil de la firma antes de facturar

| Campo | Valor |
| --- | --- |
| Tipo | Historia de usuario |
| Prioridad | P2 |
| Fase | F3 · Facturación y reportes |
| Estado para Claude Code | Requiere decisión del cliente |
| Repos | backend + frontend |
| Lista en Trello | Backlog defectos |
| Tarjeta(s) Trello | [LE4OmR7a](https://trello.com/c/LE4OmR7a) |
| Relacionado con | NAS-089 |

## Contexto

Con una cuenta nueva se facturaron tareas de un expediente y la factura salió vacía, porque no se habían completado los datos de Perfil de la firma, que alimentan la factura.

## Historia de usuario

**Como** usuario que va a facturar, **quiero** que el sistema me avise si falta información del perfil de la firma, **para** no emitir facturas vacías o incompletas.

## Criterios de aceptación

- [ ] Al intentar facturar con el perfil de la firma incompleto, se muestra el toast "Debes completar la información de perfil de la firma para facturar." y no se genera la factura.
- [ ] El toast ofrece un enlace a Perfil de la firma.
- [ ] Los campos mínimos requeridos están definidos en un solo lugar.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- Nuevo `Subscription.is_profile_complete_for_invoicing()` en `subscription/models.py`. No reutilizar `__is_contact_info_filled__` ni `__is_fully_configured__`: el primero exige `phone_number` (nunca se llena) y el segundo está roto.
- Validarlo en `InvoiceWriteSerializer.validate` o al inicio de `save_or_update_invoice` (`accounting/models.py`) y devolver 400 con `code = incomplete_firm_profile`.

### Frontend (`nasbu-webapps`)

- `pages/invoicing/new-invoice/new-invoice.component.ts` (`submitForm`): validar antes de guardar con `subscriptionInfo` y mostrar el toast; mapear también el 400 del backend. Textos en `assets/i18n/es.json`/`en.json`.

### Pruebas

- BE `accounting/tests.py`: POST con perfil incompleto → 400.
- FE `new-invoice.component.spec.ts` (usar un tsconfig dirigido como `test:notifications`).

### Riesgos y dependencias

Falta que el cliente defina los campos obligatorios (nombre, RNC, dirección, teléfono, correo, logo).

## Preguntas abiertas

- ¿Qué campos del perfil son obligatorios para facturar (nombre, RNC, dirección, teléfono, logo)?

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-096:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
