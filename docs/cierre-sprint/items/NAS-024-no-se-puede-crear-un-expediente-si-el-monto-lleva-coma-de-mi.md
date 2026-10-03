# NAS-024 · [BUG] No se puede crear un expediente si el monto lleva coma de miles

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P2 |
| Fase | F2 · Defectos funcionales del front |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend + frontend |
| Lista en Trello | En curso |
| Tarjeta(s) Trello | [t7wUT9j7](https://trello.com/c/t7wUT9j7) |

## Contexto

Al crear un expediente, si el usuario escribe 4,000 en el campo VALOR del monto a retener o en las tarifas del cliente, el expediente no se crea. Con 4000 funciona.

## Pasos para reproducir

1. Ir a Expedientes → Nuevo expediente.
2. En el monto a retener, escribir 4,000.
3. Guardar.

## Comportamiento actual

El expediente no se crea.

## Comportamiento esperado

El sistema acepta 4,000 y 4000 como el mismo valor y guarda 4000.

## Criterios de aceptación

- [ ] Los campos de monto aceptan separador de miles con coma y decimales con punto (formato DO/US: 4,000.50).
- [ ] Al salir del campo, el valor se muestra formateado con comas.
- [ ] Al backend se envía un número sin formato (4000.5).
- [ ] Entradas inválidas (letras, dos puntos decimales) muestran un mensaje de validación, no un fallo silencioso.
- [ ] Se aplica a todos los campos de monto del formulario de expediente y de tarifas.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- `practice/serializers.py` (`CaseFileWriteSerializer`): `validate_retainer_amt`, `validate_bt_price_per_hour`, `validate_bt_amt` que quiten las comas si llega un string (defensa).

### Frontend (`nasbu-webapps`)

- `components/dialogs/dialog-new-expedient/dialog-new-expedient.component.{html,ts}`: los campos de monto son `matInput` sin máscara y se envían como string; `Number('4,000')` da `NaN` y rompe también la validación de tarifa fija.
- Crear una directiva o función `parseAmount()` compartida y aplicar máscara con `ngx-mask` (ya está en `package.json`). Usarla también en el diálogo de tareas y en `pages/invoicing/new-invoice/new-invoice.component.ts`.

### Pruebas

- BE `practice/tests.py`: POST de expediente con `"4,000"` → 201.
- FE `dialog-new-expedient.component.spec.ts`: el payload lleva 4000.

### Riesgos y dependencias

Formato fijo en-US/DO (coma de miles, punto decimal).

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-024:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
