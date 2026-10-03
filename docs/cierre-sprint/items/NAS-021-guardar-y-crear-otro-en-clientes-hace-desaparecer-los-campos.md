# NAS-021 · [BUG] "Guardar y crear otro" en Clientes hace desaparecer los campos Contactos y Correo

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P1 |
| Fase | F2 · Defectos funcionales del front |
| Estado para Claude Code | Listo para desarrollo |
| Repos | frontend |
| Lista en Trello | Prioridades lanzamiento |
| Tarjeta(s) Trello | [2FTlYdeA](https://trello.com/c/2FTlYdeA) |

## Contexto

Al crear un cliente de tipo Empresa o Persona y pulsar "Guardar y crear otro", el formulario se limpia, pero desaparecen los campos Contactos y Correo electrónico. Como son requeridos, el usuario no puede crear el siguiente cliente.

## Pasos para reproducir

1. Ir a Clientes → Nuevo cliente.
2. Elegir tipo Empresa (repetir con tipo Persona), completar los campos y pulsar "Guardar y crear otro".
3. Revisar el formulario vacío que aparece.

## Comportamiento actual

Los campos Contactos y Correo electrónico ya no se muestran y el formulario no se puede enviar.

## Comportamiento esperado

El formulario se reinicia con todos sus campos visibles y vacíos, igual que al abrirlo por primera vez.

## Criterios de aceptación

- [ ] Tras "Guardar y crear otro", el formulario muestra todos los campos del tipo seleccionado, vacíos.
- [ ] Se puede crear un segundo y un tercer cliente seguidos sin recargar la página, para Empresa y para Persona.
- [ ] El primer cliente queda guardado con sus contactos y correo.
- [ ] Prueba de componente o e2e que cubre el flujo para ambos tipos.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Frontend (`nasbu-webapps`)

- `pages/client/create-client/create-client.component.ts`: `resetForm()` llama a `createClientForm.reset()`, que pone en `null` el `type` de cada contacto, y luego `addContactItem` recibe un string y lee `item.type` → `undefined`. El template filtra contactos por `type` y no muestra nada, pero los controles requeridos siguen ahí.
- Reemplazar `resetForm()` por la reconstrucción del formulario (`initCreateClientForm()`), conservar el `customer_type` elegido y reiniciar el estado `submitted` del `NgForm`. Limpiar `imagenSubir` además de `imgTemp`.

### Pruebas

- FE `create-client.component.spec.ts`: tras `submitForm(true)` existen un contacto teléfono y uno correo con `type`, para Empresa y para Persona.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-021:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
