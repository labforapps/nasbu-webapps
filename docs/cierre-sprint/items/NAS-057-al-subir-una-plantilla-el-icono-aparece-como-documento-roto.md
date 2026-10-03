# NAS-057 · [BUG] Al subir una plantilla, el ícono aparece como documento roto

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P3 |
| Fase | F4 · Planes, textos y UI |
| Estado para Claude Code | Requiere definición (análisis) |
| Repos | frontend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [WISX4edu](https://trello.com/c/WISX4edu) |

## Contexto

En la creación de plantillas, al subir el archivo, el ícono se muestra como una imagen rota.

## Criterios de aceptación

- [ ] Al subir una plantilla .docx se muestra un ícono de documento válido.
- [ ] Funciona en Chrome, Edge y Safari.
- [ ] El ícono es un recurso local del proyecto, no una URL externa.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Frontend (`nasbu-webapps`)

- `components/dialogs/dialog-new-template/dialog-new-template.component.html` usa `assets/images/upload-document.svg` y `assets/images/check.svg`; ambos existen y son SVG válidos. Otras pantallas usan rutas `../../../../assets/...`.
- Reproducir en QA y revisar en la pestaña Network si hay un 404 (despliegue/CloudFront o build viejo). Luego unificar las rutas a `assets/...`.

### Pruebas

- FE spec que valide los `src` de las imágenes.

### Riesgos y dependencias

Se necesita captura y ambiente donde se vio.

## Definición de terminado

- [ ] Documento de análisis entregado y revisado.
- [ ] Si se aprueba el desarrollo, se actualiza este archivo con criterios implementables.
