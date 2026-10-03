# Instrucciones para Claude Code – Cierre Sprint Nasbu

## Rama

- Trabajar **solo** en `features/cierre-sprint-nasbu`. Nunca hacer commit, merge ni push sobre `master` o `develop`.
- Antes de empezar: `git checkout features/cierre-sprint-nasbu && git pull --ff-only origin features/cierre-sprint-nasbu` (si la rama ya está publicada).
- Un commit por ítem, con mensaje que empiece por `NAS-XXX:`. Si un ítem toca ambos repos, usar el mismo ID en los dos commits.

## Flujo por ítem

1. Leer `docs/memory.md` del repo y el archivo del ítem completo, incluidos los ítems relacionados y `PLAN.md` (hallazgos H1–H8).
2. Confirmar en el código lo que dice la sección "Plan de implementación": las rutas y funciones citadas existen y se comportan como se describe. Si algo no coincide, detenerse y anotarlo en `## Resultado`.
3. Para un **BUG**, escribir primero una prueba que falle.
4. Implementar el cambio mínimo que cumple los criterios de aceptación. Sin refactors fuera de alcance.
5. Ejecutar las pruebas:
   - Backend: `python manage.py test <app>` del módulo tocado. Las pruebas que usan migraciones necesitan stub de `requests.get` (ver `catalog/migrations/0003`).
   - Frontend: compilar `core-models` y `core-services` si se tocaron, y correr la spec dirigida (`ng test --project=practice-app --watch=false --browsers=ChromeHeadless --include=...`).
6. Marcar los criterios cumplidos (`- [x]`) y agregar `## Resultado` al final del archivo del ítem: causa raíz, archivos, pruebas y validación manual.
7. Registrar la entrada en `docs/memory.md` con el formato de ese repo (en backend, también en `~/.claude/sessions/nasbu_core/memory.md`).

## Reglas

- **Requiere análisis:** no cambiar código de producción; entregar `docs/cierre-sprint/analisis/NAS-XXX.md`.
- **Requiere decisión del cliente:** implementar la lógica con la regla en un único punto de configuración y documentar la opción por defecto. No cerrar el ítem sin la decisión.
- Permisos, planes y límites se validan siempre en el backend, además del front.
- Textos visibles: en español, vía i18n (`assets/i18n/es.json` y `en.json`).
- Nunca escribir credenciales en código, pruebas ni documentos.
- Montos: se muestran como 4,000.50 y se envían sin formato.
