# NAS-075 · [BUG] Landing page de planes: texto desbordado, porcentaje y almacenamiento mal formateados

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P2 |
| Fase | F4 · Planes, textos y UI |
| Estado para Claude Code | Listo para desarrollo |
| Repos | frontend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [AvCDzX48](https://trello.com/c/AvCDzX48), [6py3Eogx](https://trello.com/c/6py3Eogx) |
| Relacionado con | NAS-093 |

## Contexto

Unifica las tarjetas #75 y #63. En la landing page el texto se sale de la maqueta y en el paquete del medio no se lee la última línea (Chrome, zoom 100%). Además hay que cambiar 10.00% por 10%, redondear el almacenamiento, que muestra muchos decimales, y ajustar la maqueta para que quepan los planes.

## Criterios de aceptación

- [ ] Las tarjetas de los planes contienen todo su texto sin desbordar ni cortar líneas en 1280, 1440 y 1920 px y en móvil.
- [ ] Los porcentajes se muestran sin decimales innecesarios (10%).
- [ ] El almacenamiento se muestra redondeado y con la unidad correcta (ej.: "1 TB").
- [ ] Los bullets del plan Ultimate coinciden con NAS-093.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Frontend (`nasbu-webapps`)

- No hay landing pública en estos repos: las tarjetas de planes están en `pages/configuration/plans/` (dentro de la app) y en `pages/register/` (`/signup`). Si el cliente se refiere a un sitio de marketing, está en otro repo.
- `register.component.ts` y `plans.component.ts` dividen `feature.quantity/1024`, pero el backend guarda bytes (1e9) → 976562.5 "GB". Crear un pipe compartido `bytesToGb` en `SharedModule` (÷ 1e9, entero) y usarlo en ambos.
- Mostrar el descuento con `| number:'1.0-2'` (`Plan.anual_discount_pct` es `DecimalField` y sale como 10.00).
- `projects/practice-app/src/assets/sass/components/_plans.scss`: reducir `min-width: 30rem`, padding y espaciado de `li`; agregar `overflow-wrap: anywhere` (cubre la tarjeta #63).

### Pruebas

- FE spec del pipe (1e9 → "1 GB") y de `plans.component` (descuento "10%").

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-075:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
