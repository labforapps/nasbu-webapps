# NAS-009 · [SPIKE] Método de pago en Perfil de la firma: el usuario no ve qué tarjeta se cobra

| Campo | Valor |
| --- | --- |
| Tipo | Análisis (spike) |
| Prioridad | P1 |
| Fase | F6 · Análisis y definición con el cliente |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend + frontend |
| Lista en Trello | Flujo inexistente o no hay solución inmediata |
| Tarjeta(s) Trello | [un40Ma6i](https://trello.com/c/un40Ma6i) |

## Contexto

En Configuración → Perfil de la firma → Método de pago, la actualización ocurre dentro de Evertec. El usuario no puede saber a qué tarjeta se le cobra ni cuál modificó. La tarjeta pide analizar la logística.

## Criterios de aceptación

- [ ] Documento `docs/analisis/NAS-009-metodo-pago.md` que describe el flujo actual de actualización con Evertec.
- [ ] Lista qué datos devuelve Evertec tras actualizar: últimos 4 dígitos, marca y vencimiento, si los hay.
- [ ] Propone al menos una opción para mostrar al usuario la tarjeta activa (marca + últimos 4 dígitos) y confirmar el cambio.
- [ ] Estima el esfuerzo de cada opción.
- [ ] No se guarda ningún dato sensible de tarjeta fuera de Evertec, solo datos de visualización permitidos.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- Ya existe: `SubscriptionPaymentMethodReadSerializer` (`subscription/serializers.py`) expone `is_default` y `last_four_digits`, y el cobro usa `get_default_by_subscription` (`core/models.py`).

### Frontend (`nasbu-webapps`)

- `pages/configuration/profile-sign/payment-method/payment-method.component.html`: muestra las tarjetas pero no marca cuál es la de cobro. Agregar la insignia "Tarjeta de cobro" cuando `element.is_default`.

### Pruebas

- FE `payment-method.component.spec.ts`.

### Riesgos y dependencias

Pasa de análisis a desarrollo pequeño: el dato ya llega al front.

## Preguntas abiertas

- ¿Evertec expone la tarjeta tokenizada con marca y últimos 4 dígitos?
- ¿El cliente acepta mostrar solo la tarjeta activa, sin historial?

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-009:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
