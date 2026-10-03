# NAS-018 · [HU] Replicar el correo de usuario en el campo Correo electrónico al crear un colaborador

| Campo | Valor |
| --- | --- |
| Tipo | Historia de usuario |
| Prioridad | P3 |
| Fase | F2 · Defectos funcionales del front |
| Estado para Claude Code | Listo para desarrollo |
| Repos | frontend |
| Lista en Trello | Backlog defectos |
| Tarjeta(s) Trello | [EjOeRvLd](https://trello.com/c/EjOeRvLd) |

## Contexto

Al crear un colaborador, el valor de "Correo para tu usuario" podría copiarse en el campo "Correo electrónico" que aparece más abajo.

## Historia de usuario

**Como** administrador que crea colaboradores, **quiero** no escribir dos veces el mismo correo, **para** crear usuarios más rápido y sin errores.

## Criterios de aceptación

- [ ] Al completar "Correo para tu usuario", el campo "Correo electrónico" se llena con el mismo valor si estaba vacío.
- [ ] Si el usuario ya editó "Correo electrónico", no se sobrescribe.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Frontend (`nasbu-webapps`)

- `pages/collaborator/create-collaborator/create-collaborator.component.{ts,html}`: en `(blur)` del control `email`, si el primer contacto de tipo correo está vacío, copiar el valor. Solo en modo creación.

### Pruebas

- FE `create-collaborator.component.spec.ts`: copia si está vacío y no sobrescribe.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-018:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
