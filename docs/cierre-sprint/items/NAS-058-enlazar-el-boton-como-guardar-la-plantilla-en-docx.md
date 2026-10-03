# NAS-058 · [HU] Enlazar el botón "Cómo guardar la plantilla en .docx"

| Campo | Valor |
| --- | --- |
| Tipo | Historia de usuario |
| Prioridad | P3 |
| Fase | F4 · Planes, textos y UI |
| Estado para Claude Code | Requiere decisión del cliente |
| Repos | frontend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [1y3TxrE0](https://trello.com/c/1y3TxrE0) |

## Contexto

El botón de ayuda sobre cómo guardar la plantilla en .docx debe enlazar a un video que aún no existe.

## Criterios de aceptación

- [ ] Documento `docs/analisis/NAS-058.md` con: situación actual en el código, opciones de solución, recomendación y estimación.
- [ ] Las preguntas abiertas de esta tarjeta quedan respondidas o listadas para el cliente.
- [ ] Mientras no exista el video: ocultar el botón o enlazar a una guía escrita breve.
- [ ] No se modifica código de producción hasta que el cliente apruebe la propuesta.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Frontend (`nasbu-webapps`)

- El enlace ya existe en `dialog-new-template.component.html`, pero solo aparece si `docxHelpUrl` tiene valor, y está en `''` en el `.ts`.
- Cuando exista el video: leer la URL de `environment.ts` o de una variable de sistema/`Tutorial` del backend, y pasar el texto a i18n.

### Pruebas

- FE spec: el enlace aparece u oculta según la URL.

### Riesgos y dependencias

El video no existe; falta definir quién lo graba y dónde se aloja.

## Preguntas abiertas

- ¿Quién produce el video y dónde se aloja?

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-058:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
