# NAS-093 · [HU] Actualizar los bullets del plan Ultimate en la landing page

| Campo | Valor |
| --- | --- |
| Tipo | Historia de usuario |
| Prioridad | P3 |
| Fase | F4 · Planes, textos y UI |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend + frontend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [cTvxiXEN](https://trello.com/c/cTvxiXEN) |
| Relacionado con | NAS-075 |

## Contexto

El cliente definió los bullets del plan Ultimate en la landing page.

## Historia de usuario

**Como** visitante de la landing page, **quiero** ver claramente qué incluye el plan Ultimate, **para** decidir qué plan contratar.

## Criterios de aceptación

- [ ] Los bullets del plan Ultimate son: "Este plan incluye todo lo del Plan Nasbu Starter"; "Documentos y plantillas"; "Firma electrónica (10 firmas al mes por usuario)"; "Almacenamiento en la nube" con la capacidad redondeada.
- [ ] La capacidad no se muestra como 976562.5 GB (ver NAS-075).

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- Opcional: campo `Plan.public_bullets` (JSON + migración) en `core/models.py` y `core/serializers.py` (`PlanSerializer`).

### Frontend (`nasbu-webapps`)

- Hoy hay 5 `<li>` fijos e iguales para todos los planes en `plans.component.html` y `register.component.html`, más un `switch` por `feature.code` en `register.component.ts`.
- Mostrar `PlanFeature.description` cuando exista (ya viene en la API y en el modelo de `core-models`) y viñetas por plan (campo nuevo o i18n por plan).
- Texto de firmas: "Firma Electrónica (10 firmas al mes x usuario)".

### Pruebas

- FE spec de componente: una descripción personalizada se muestra.

### Riesgos y dependencias

Confirmar si "10 por usuario" es un límite real; hoy la cantidad de firmas es por suscripción.

## Preguntas abiertas

- Confirmar con el cliente la capacidad real de almacenamiento del plan Ultimate.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-093:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
