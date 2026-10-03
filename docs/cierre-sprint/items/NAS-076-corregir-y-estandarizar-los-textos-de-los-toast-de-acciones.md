# NAS-076 · [HU] Corregir y estandarizar los textos de los toast de acciones exitosas

| Campo | Valor |
| --- | --- |
| Tipo | Historia de usuario |
| Prioridad | P1 |
| Fase | F4 · Planes, textos y UI |
| Estado para Claude Code | Listo para desarrollo |
| Repos | frontend |
| Lista en Trello | Prioridades lanzamiento |
| Tarjeta(s) Trello | [Q6AUeYfr](https://trello.com/c/Q6AUeYfr) |

## Contexto

El cliente pidió corregir los textos de los toast que aparecen tras acciones exitosas. La tarjeta no detalla cuáles, así que el trabajo empieza por un inventario.

## Historia de usuario

**Como** usuario de Nasbu, **quiero** ver mensajes de confirmación claros, bien escritos y consistentes, **para** saber con certeza que mi acción se completó.

## Criterios de aceptación

- [ ] Existe un inventario de todos los toast de éxito (archivo, clave y texto actual → texto propuesto) en `docs/toasts-exito.md`.
- [ ] Todos los textos están en español, sin errores de ortografía ni de acentos, y siguen un patrón: "<Entidad> <acción> correctamente." (ej.: "Cliente creado correctamente.").
- [ ] Los textos salen de un único catálogo o archivo de traducciones, no de cadenas sueltas en el código.
- [ ] No cambia el comportamiento de ninguna acción, solo el texto.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Frontend (`nasbu-webapps`)

- 74 toasts de éxito con `ngx-toastr`: 24 llamadas directas `toastr.success` (15 con i18n) y 49 vía `services/helpers.service.ts` (`showMessageCreated/Updated/Deleted`, `showCustomMessage('Ok', ...)`), todas con texto fijo y título `'Ok'`.
- Errores concretos: clave `created_succesfully` mal escrita y texto "Creado Exitosamente!!" en `es.json`; título y mensaje invertidos en `helpers.service.ts`; textos en inglés (`invoicing-parameters.component.ts`, `collaborator.component.ts`); "Link Copiado en el portapeles".
- Crear claves `success.*` en `es.json`/`en.json` (mantener la clave vieja como alias), traducir también el título en `HelpersService` y reemplazar los textos fijos. Entregar `docs/toasts-exito.md` con el inventario.

### Pruebas

- FE `helpers.service.spec.ts`: título y mensaje traducidos; script que verifique que cada `success.*` existe en es y en.

### Riesgos y dependencias

El cliente debe aprobar la guía de estilo. Los toasts de error, info y warning quedan fuera de alcance.

## Preguntas abiertas

- ¿El cliente aprueba el patrón de redacción propuesto o tiene textos específicos?

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-076:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
