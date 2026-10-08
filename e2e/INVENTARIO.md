# Nasbu – Inventario de casos de prueba E2E con Playwright

Actualizado: 2026-10-08. Base: `nasbu-webapps` y `nasbu-core`, rama `develop`. Implementación en la rama `features/e2e-playwright` de `nasbu-webapps`, carpeta `e2e/`.

127 casos en 15 módulos: 43 P1, 57 P2, 27 P3. 66 casos están ligados a un ítem del backlog (columna **Ref.**).

**Estado:** 23 casos automatizados (más 2 variantes, BLQ-01b y EXP-02b) y 104 escritos como `test.fixme` con el motivo. Ninguno se ha corrido todavía contra QA: ver la sección 8.

## 1. Alcance y supuestos

- **Aplicación bajo prueba:** `practice-app`. Usa ruteo con hash (`/#/dashboard`), así que las URLs de las pruebas llevan `#/`.
- **Ambiente:** QA (`environment.qa.ts`). Nunca producción.
- **Autenticación:** Cognito vía Amplify. Se inicia sesión una vez por rol en un `setup` project y se reutiliza el `storageState`. Solo los casos del módulo AUT pasan por la pantalla de login.
- **Pagos:** la pasarela externa no se ejecuta de verdad. Se intercepta con `page.route` y se simulan las respuestas de éxito, rechazo y cancelación. Los flujos de `register/success` y `register/cancel` se prueban entrando a esas rutas con los parámetros que devuelve la pasarela.
- **SMS, correo y firma electrónica:** el E2E valida lo que hace la app (petición enviada, mensaje en pantalla, estado del registro). El contenido del SMS o del correo se valida con pruebas de backend, salvo que QA tenga un buzón de captura.
- **Datos:** cada caso crea sus propios datos por API (fixtures) y los limpia al final, o usa nombres con sufijo único. Ningún caso depende del orden de otro.
- **Credenciales:** van en variables de entorno o secretos de GitHub Actions, nunca en el repositorio. Las de la tarjeta de Trello #2 se deben rotar antes de usarlas.

## 2. Cuentas de prueba necesarias

| Clave | Plan | Rol | Uso |
| --- | --- | --- | --- |
| `ownerUltimate` | Ultimate | Owner | Flujo completo, firma de documentos, reportes |
| `ownerStarter` | Starter | Owner | Bloqueos por plan, modal de upgrade |
| `ownerLimite` | Starter con el límite de usuarios alcanzado | Owner | Límite del plan (NAS-020) |
| `colabEscritura` | Ultimate | Colaborador con `add_*`/`change_*`, sin `delete_*` | Permisos (NAS-027) |
| `colabLectura` | Ultimate | Colaborador solo `view_*` | Rutas y botones ocultos |
| `colabSinExpediente` | Ultimate | Colaborador fuera del expediente privado de prueba | Expedientes privados (NAS-038, NAS-079) |
| `suscripcionImpaga` | Cualquiera | Owner con alta sin pagar | `SubscriptionGuard` |
| `suscripcionSuspendida` | Cualquiera | Owner con suscripción suspendida | Diálogo de suspensión |

Para los cambios de plan (NAS-073, NAS-092) conviene una cuenta desechable que se recree por API en cada corrida.

## 3. Estructura propuesta

```
e2e/
  playwright.config.ts      # projects: setup, chromium; baseURL de QA; trace on-first-retry
  .env.example              # nombres de variables, sin valores
  fixtures/                 # login por rol, creación de datos por API, mock de pasarela
  pages/                    # page objects por módulo (ClientsPage, InvoicePage…)
  tests/
    auth/  subscription/  permissions/  dashboard/  customers/  users/
    expedients/  tasks/  templates/  invoicing/  payments/  reports/
    configuration/  notifications/  external/
```

- Etiquetas: `@smoke` (corre en cada PR), `@regression` (nocturna) y `@nas-xxx` para trazar el ítem del backlog.
- Selectores: `getByRole` y `getByLabel` primero; donde no alcance, agregar `data-testid` en el front en el mismo PR.
- CI: se suma como job al pipeline de NAS-110. `@smoke` en cada PR a `develop` y `master`; `@regression` programado.

## 4. Inventario

Columna **Estado E2E:** `Automatizado` si la prueba está escrita y activa; `Pendiente` si está registrada como `test.fixme`, con el motivo (rama sin mezclar, ítem sin implementar, cuenta o buzón que falta, o caso aún no escrito). Cada caso tiene su prueba con el mismo ID, así que `npx playwright test --grep CLI-04` corre exactamente ese.

### 4.1 Autenticación y registro (AUT)

| ID | Caso | Resultado esperado | Prio | Ref. | Estado E2E |
| --- | --- | --- | --- | --- | --- |
| AUT-01 | Iniciar sesión con credenciales válidas | Entra a `#/dashboard` con el nombre del usuario en el encabezado | P1 @smoke | — | Automatizado |
| AUT-02 | Iniciar sesión con contraseña incorrecta | Mensaje de error, sigue en `#/signin` | P1 | — | Automatizado |
| AUT-03 | Entrar a una ruta protegida sin sesión | Redirige a `#/signin` | P1 @smoke | — | Automatizado |
| AUT-04 | Cerrar sesión | Vuelve a `#/signin`; el botón atrás no muestra datos | P1 | — | Automatizado |
| AUT-05 | Primer ingreso con contraseña temporal | `#/signin-first-password` pide cambiarla y luego entra | P2 | — | Pendiente: Requiere una cuenta recién invitada por cada corrida |
| AUT-06 | Recuperar contraseña | `#/recovery` envía el código y permite fijar la nueva | P2 | — | Pendiente: Requiere leer el código del correo (buzón de captura) |
| AUT-07 | Registro de una firma nueva con pago exitoso (pasarela simulada) | Llega a `#/register/success` y puede entrar | P1 | — | Pendiente: Simular PlaceToPay con page.route; crea una suscripción real en QA |
| AUT-08 | Registro con pago cancelado | `#/register/cancel` informa y permite reintentar | P2 | — | Pendiente: por escribir |
| AUT-09 | Validaciones del formulario de registro | Campos obligatorios, correo y teléfono inválidos bloquean el envío | P2 | — | Pendiente: por escribir |
| AUT-10 | Confirmación de cuenta desde el enlace | `#/account-confirmation` confirma y lleva al login | P2 | — | Pendiente: por escribir |
| AUT-11 | Cuenta con sesión válida pero alta sin pagar | `SubscriptionGuard` no deja entrar al layout | P1 | — | Automatizado |
| AUT-12 | Cuenta con suscripción suspendida | Se muestra el diálogo de suspensión | P2 | — | Pendiente: Requiere la cuenta suscripcionSuspendida |
| AUT-13 | Cambiar contraseña desde el perfil | Diálogo de cambio la actualiza y permite volver a entrar | P3 | — | Pendiente: Cambia la contraseña de una cuenta compartida: usar una cuenta propia |

### 4.2 Suscripción y planes (SUB)

| ID | Caso | Resultado esperado | Prio | Ref. | Estado E2E |
| --- | --- | --- | --- | --- | --- |
| SUB-01 | Ver plan actual en `#/configuration/plans` | Muestra plan, ciclo y uso de cada feature | P2 | — | Pendiente: por escribir |
| SUB-02 | Upgrade de Starter a Ultimate | La firma de documentos queda habilitada sin cerrar sesión | P1 | NAS-073 | Pendiente: Requiere una cuenta desechable recreada por API en cada corrida y la pasarela simulada |
| SUB-03 | Upgrade conserva los usuarios y sus roles | Los colaboradores siguen entrando con sus mismos permisos | P1 | NAS-073 | Pendiente: por escribir |
| SUB-04 | Downgrade de Ultimate a Starter | Desaparecen del menú y de las rutas los módulos fuera del plan | P1 | NAS-092 | Pendiente: Hoy el downgrade es inmediato; ajustar si el cliente lo quiere al final del ciclo |
| SUB-05 | Tras el downgrade, entrar por URL a un módulo fuera del plan | No se muestra el módulo; aparece el modal de upgrade o se redirige | P1 | NAS-092, NAS-112 | Pendiente: por escribir |
| SUB-06 | Crear un rol en Starter | Solo se ofrecen los módulos del plan | P2 | NAS-092 | Pendiente: por escribir |
| SUB-07 | Agregar o cambiar método de pago | La tarjeta queda registrada y visible como la que se cobra | P2 | NAS-009 | Pendiente: Pendiente de la definición de NAS-009 |
| SUB-08 | Cancelar la suscripción | Según la definición de NAS-011 | P3 | NAS-011 | Pendiente: Pendiente de la definición de NAS-011 |

### 4.3 Bloqueos por permiso, plan y límite (BLQ)

| ID | Caso | Resultado esperado | Prio | Ref. | Estado E2E |
| --- | --- | --- | --- | --- | --- |
| BLQ-01 | Acción bloqueada por permiso de rol (forzada por API desde la sesión) | Toast uniforme de permiso; sin reintentos de la petición | P1 | NAS-031 | Automatizado (+BLQ-01b) |
| BLQ-02 | Función no incluida en el plan (Starter) | Modal de upgrade, no toast | P1 | NAS-031, NAS-112 | Pendiente: Pendiente NAS-112 (modal de upgrade): hoy el 403 `plan_feature_missing` muestra toast |
| BLQ-03 | Owner pulsa "Mejorar plan" en el modal | Navega a la pantalla de cambio de plan | P1 | NAS-112 | Pendiente: Pendiente NAS-112 |
| BLQ-04 | Colaborador (no owner) ve el modal de upgrade | Muestra nombre y correo del owner, sin botón de cambiar plan | P1 | NAS-112 | Pendiente: Pendiente NAS-112 |
| BLQ-05 | Enviar a firmar con Starter | Mensaje de "plan sin firma", nunca un 403 crudo | P1 | NAS-061 | Pendiente: Activar al mezclar fix/NAS-061-firma-sin-plan |
| BLQ-06 | "Crear nuevo usuario" con el límite alcanzado | Aviso de límite del plan; no abre el formulario | P1 | NAS-020 | Automatizado |
| BLQ-07 | Colaborador con escritura sin `delete_*` | No ve botones de eliminar en clientes, expedientes, tareas, facturas, plantillas | P1 @smoke | NAS-027 | Automatizado |
| BLQ-08 | Colaborador de solo lectura | No ve botones de crear, editar ni enviar | P1 | NAS-092 | Automatizado |
| BLQ-09 | Colaborador de solo lectura entra por URL a `#/customers/edit/:id` | No se muestra el formulario | P1 | NAS-092 | Pendiente: Activar al mezclar features/NAS-092-permisos-en-toda-la-app (RoutePermissionsGuard) |
| BLQ-10 | Menú de Reportes con permisos parciales | Solo aparecen los reportes permitidos | P2 | NAS-092 | Pendiente: Activar al mezclar features/NAS-092-permisos-en-toda-la-app |

### 4.4 Dashboard y onboarding (DSH)

| ID | Caso | Resultado esperado | Prio | Ref. | Estado E2E |
| --- | --- | --- | --- | --- | --- |
| DSH-01 | Cargar el dashboard | Indicadores y accesos rápidos visibles, sin errores en consola | P1 @smoke | — | Automatizado |
| DSH-02 | Bienvenida en el primer ingreso | Mensaje y pop-up aparecen una vez | P2 | NAS-017 | Pendiente: por escribir |
| DSH-03 | Segundo ingreso y recarga | La bienvenida no vuelve a salir | P2 | NAS-017 | Pendiente: por escribir |
| DSH-04 | Banner de suscripción (próximo cobro, fallo de pago) | Se muestra según el estado y se puede cerrar | P3 | — | Pendiente: por escribir |
| DSH-05 | Indicadores de ahorro y % de facturas a tiempo | Según las reglas de NAS-097 y NAS-098 | P3 | NAS-097, NAS-098 | Pendiente: por escribir |
| DSH-06 | Tutoriales | `#/tutorials` lista categorías y abre un video | P3 | — | Pendiente: por escribir |

### 4.5 Clientes (CLI)

| ID | Caso | Resultado esperado | Prio | Ref. | Estado E2E |
| --- | --- | --- | --- | --- | --- |
| CLI-01 | Crear cliente persona física | Aparece en la lista y su perfil muestra los datos | P1 @smoke | — | Automatizado |
| CLI-02 | Crear cliente empresa | Ídem, con los campos de empresa | P2 | — | Pendiente: por escribir |
| CLI-03 | Validaciones (obligatorios, correo, teléfono internacional) | Bloquean el guardado con mensaje por campo | P2 | — | Automatizado |
| CLI-04 | "Guardar y crear otro" | El formulario queda limpio y los campos Contactos y Correo siguen visibles | P1 | NAS-021 | Automatizado |
| CLI-05 | Editar cliente | Los cambios se reflejan en lista y perfil | P2 | — | Automatizado |
| CLI-06 | Buscar y filtrar en la lista | Resultados correctos y estado vacío cuando no hay coincidencias | P2 | — | Automatizado |
| CLI-07 | Eliminar cliente (owner) | Pide confirmación y lo quita de la lista | P2 | — | Automatizado |
| CLI-08 | Perfil del cliente: expedientes, facturas y estado de cuenta | Muestra solo lo del cliente | P2 | — | Pendiente: por escribir |
| CLI-09 | Registrar saldo a favor del cliente | El saldo se refleja en la cartera | P3 | — | Pendiente: por escribir |
| CLI-10 | Enviar formulario de registro al cliente (intake) | Se envía la invitación; el cliente completa `#/registerClient` y queda creado | P3 | — | Pendiente: Envía correo real |
| CLI-11 | Descargar la base de clientes | Según la definición de NAS-045 | P3 | NAS-045 | Pendiente: Pendiente de la definición de NAS-045 |

### 4.6 Usuarios y colaboradores (USR)

| ID | Caso | Resultado esperado | Prio | Ref. | Estado E2E |
| --- | --- | --- | --- | --- | --- |
| USR-01 | Crear colaborador con rol | Queda en la lista y recibe la invitación | P1 | — | Pendiente: Pendiente: crear un usuario en QA envía la invitación real de Cognito y consume una licencia |
| USR-02 | El correo de usuario se copia al de contacto | Al escribir el correo de acceso se llena "Correo electrónico" | P3 | NAS-018 | Automatizado |
| USR-03 | Editar rol de un colaborador | Al entrar con ese usuario, ve lo que el nuevo rol permite | P2 | — | Pendiente: por escribir |
| USR-04 | Desactivar colaborador | No puede iniciar sesión y libera la licencia | P2 | NAS-064 | Pendiente: por escribir |
| USR-05 | Reenviar invitación | Se envía de nuevo y se informa en pantalla | P3 | — | Pendiente: por escribir |
| USR-06 | Crear y editar roles en `#/configuration/permission` | Los permisos marcados se guardan y aplican | P2 | — | Pendiente: por escribir |

### 4.7 Expedientes (EXP)

| ID | Caso | Resultado esperado | Prio | Ref. | Estado E2E |
| --- | --- | --- | --- | --- | --- |
| EXP-01 | Crear expediente con cliente, tipo y tarifa | Queda en la lista y abre `#/expedient-info/:id` | P1 @smoke | — | Automatizado |
| EXP-02 | Monto con coma de miles (`1,500.00`) | Se guarda como 1500.00 | P1 | NAS-024 | Automatizado (+EXP-02b) |
| EXP-03 | Expediente por hora, monto fijo y contingencia | Cada tipo de facturación guarda sus campos | P2 | — | Pendiente: por escribir |
| EXP-04 | Expediente privado: compartir con usuarios | Solo los usuarios agregados lo ven en la lista | P1 | NAS-079 | Automatizado |
| EXP-05 | Usuario sin acceso entra por URL a un expediente privado | No ve el contenido | P1 | NAS-038 | Pendiente: Activar al mezclar fix/NAS-038-acceso-reportes |
| EXP-06 | Agregar nota | Aparece en el expediente con autor y fecha | P2 | — | Pendiente: por escribir |
| EXP-07 | Subir documento al expediente | Se lista, se previsualiza y se descarga | P2 | — | Pendiente: por escribir |
| EXP-08 | Generar documento desde plantilla | Se crea con las variables del expediente sustituidas | P2 | — | Pendiente: por escribir |
| EXP-09 | Registrar horas manuales | Suman al total del expediente | P2 | — | Pendiente: por escribir |
| EXP-10 | Cerrar expediente | Pide motivo; queda cerrado con fecha de cierre propia | P2 | NAS-048 | Pendiente: por escribir |
| EXP-11 | Crear tipo de expediente con variables | Disponible al crear un expediente | P3 | — | Pendiente: por escribir |
| EXP-12 | Editar y eliminar expediente | Respetan permisos y piden confirmación | P2 | NAS-027 | Pendiente: por escribir |

### 4.8 Tareas y temporizador (TAR)

| ID | Caso | Resultado esperado | Prio | Ref. | Estado E2E |
| --- | --- | --- | --- | --- | --- |
| TAR-01 | Crear tarea en un expediente y asignarla | Aparece en `#/task` del responsable | P1 @smoke | — | Automatizado |
| TAR-02 | Crear tarea suelta desde `#/task` | Se guarda con fecha de vencimiento | P2 | — | Pendiente: por escribir |
| TAR-03 | Asignar tarea en expediente privado | El selector solo ofrece usuarios con acceso | P1 | NAS-079 | Automatizado |
| TAR-04 | Forzar por API la asignación a un usuario sin acceso | El backend la rechaza y la UI lo informa | P1 | NAS-079 | Pendiente: Activar cuando fix/NAS-079-tarea-expediente-privado esté en develop de nasbu-core |
| TAR-05 | Iniciar, pausar y detener el temporizador | El tiempo queda registrado en la tarea (tolerancia de pocos segundos con `page.clock`) | P1 | NAS-101 | Pendiente: Pendiente NAS-101. Usar page.clock para controlar el tiempo transcurrido |
| TAR-06 | Temporizador activo al recargar o cambiar de página | Sigue contando y registra el total | P2 | NAS-101 | Pendiente: por escribir |
| TAR-07 | Temporizador con tareas del mismo nombre en distintos expedientes | Permite elegir el expediente | P3 | NAS-102 | Pendiente: por escribir |
| TAR-08 | Cerrar tarea | Pide motivo y queda cerrada | P2 | — | Pendiente: por escribir |
| TAR-09 | Filtrar tareas por estado, responsable y vencimiento | Resultados correctos | P3 | — | Pendiente: por escribir |
| TAR-10 | Correo de tarea asignada | El enlace lleva al destino definido | P3 | NAS-067 | Pendiente: por escribir |

### 4.9 Plantillas y firma (PLT)

| ID | Caso | Resultado esperado | Prio | Ref. | Estado E2E |
| --- | --- | --- | --- | --- | --- |
| PLT-01 | Subir plantilla `.docx` | Se lista con ícono de Word, no de documento roto | P2 | NAS-057 | Pendiente: Pendiente NAS-057 |
| PLT-02 | Subir archivo con formato no permitido | Mensaje de formato inválido | P2 | — | Pendiente: por escribir |
| PLT-03 | Crear tipo de plantilla con variables | Las variables quedan disponibles para la plantilla | P3 | — | Pendiente: por escribir |
| PLT-04 | Enlace "Cómo guardar la plantilla en .docx" | Abre el destino definido | P3 | NAS-058 | Pendiente: Pendiente NAS-058 |
| PLT-05 | Enviar documento a firmar (Ultimate) | Se crea la solicitud y el estado pasa a "enviado" | P1 | NAS-073 | Pendiente: Envía la solicitud real al proveedor de firma: simular su respuesta |
| PLT-06 | Firma externa completada (simular callback) | El documento muestra "firmado" y la evidencia | P2 | — | Pendiente: por escribir |
| PLT-07 | Acceso a `#/templates` con plan o rol sin permiso | Bloqueado por el guard | P2 | NAS-092 | Pendiente: Activar al mezclar features/NAS-092-permisos-en-toda-la-app |

### 4.10 Facturación (FAC)

| ID | Caso | Resultado esperado | Prio | Ref. | Estado E2E |
| --- | --- | --- | --- | --- | --- |
| FAC-01 | Crear factura manual con ítems e impuesto | Totales correctos y queda en la lista | P1 @smoke | NAS-104 | Automatizado |
| FAC-02 | Crear factura desde expediente | Trae horas, gastos y reembolsos del expediente | P1 | — | Pendiente: por escribir |
| FAC-03 | Agregar ítem manual en factura desde expediente | No copia el texto del reembolso | P2 | NAS-105 | Pendiente: Activar al mezclar fix/NAS-105-item-manual-factura |
| FAC-04 | Editar factura en borrador | Guarda los cambios y recalcula totales | P2 | NAS-104 | Pendiente: por escribir |
| FAC-05 | Eliminar factura | Pide confirmación y respeta permisos | P2 | NAS-104, NAS-027 | Pendiente: por escribir |
| FAC-06 | Salir con cambios sin guardar | `CanComponenteDeactivateGuard` pide confirmar | P3 | — | Pendiente: por escribir |
| FAC-07 | Facturar con el perfil de la firma incompleto | Aviso que lleva a completar el perfil | P2 | NAS-096 | Pendiente: por escribir |
| FAC-08 | PDF de la factura | Incluye el teléfono de la firma | P3 | NAS-089 | Pendiente: por escribir |
| FAC-09 | PDF con cobros por incremento de tiempo | Desglosa los incrementos | P1 | NAS-029 | Pendiente: por escribir |
| FAC-10 | Enviar factura por correo | Se envía y el estado cambia a "enviada" | P2 | NAS-104 | Pendiente: por escribir |
| FAC-11 | Solicitud de pago al cliente | Genera el enlace de pago | P2 | — | Pendiente: por escribir |
| FAC-12 | Parámetros de facturación (secuencia, impuestos) | Se aplican a la siguiente factura | P2 | — | Pendiente: por escribir |

### 4.11 Pagos y cartera (PAG)

| ID | Caso | Resultado esperado | Prio | Ref. | Estado E2E |
| --- | --- | --- | --- | --- | --- |
| PAG-01 | Registrar pago total | Factura pasa a "pagada" | P1 | NAS-103 | Pendiente: por escribir |
| PAG-02 | Registrar pago parcial | Queda "parcial" con el saldo correcto | P1 | NAS-103 | Pendiente: por escribir |
| PAG-03 | Varios pagos parciales hasta saldar | La suma cierra la factura; historial con cada pago | P1 | NAS-103 | Pendiente: por escribir |
| PAG-04 | Pago mayor que el saldo | Se rechaza o va a saldo a favor, según regla | P2 | NAS-103 | Pendiente: por escribir |
| PAG-05 | Aplicar saldo a favor del cliente a una factura | Descuenta del saldo y de la factura | P2 | — | Pendiente: por escribir |
| PAG-06 | Pago del cliente desde el enlace externo (`#/pg/checkoutRequest`, pasarela simulada) | La factura refleja el pago | P2 | — | Pendiente: por escribir |
| PAG-07 | Historial en `#/payments` | Lista los pagos con filtro por fecha y cliente | P3 | — | Pendiente: por escribir |

### 4.12 Reportes (REP)

| ID | Caso | Resultado esperado | Prio | Ref. | Estado E2E |
| --- | --- | --- | --- | --- | --- |
| REP-01 | Estado de cuenta filtrado por usuario | Solo expedientes del usuario | P1 | NAS-038 | Pendiente: Activar al mezclar fix/NAS-038-acceso-reportes |
| REP-02 | Reportes con usuario sin acceso a un expediente privado | El expediente no aparece | P1 | NAS-038 | Pendiente: Activar al mezclar fix/NAS-038-acceso-reportes |
| REP-03 | Reporte de horas | Decimales correctos y columna de tipo de facturación | P2 | NAS-046 | Pendiente: Pendiente NAS-046 |
| REP-04 | Reporte de casos: fechas | Creación y cierre distintas | P2 | NAS-048 | Pendiente: Pendiente NAS-048 |
| REP-05 | Reporte de casos: columna | Dice "Num. de Caso", no "# No. Fact." | P2 | NAS-109 | Pendiente: Pendiente NAS-109 |
| REP-06 | Reporte de facturación y exportación | La exportación contiene las mismas filas que la pantalla | P2 | — | Pendiente: por escribir |
| REP-07 | Reporte de ingresos | Totales cuadran con los pagos registrados | P2 | — | Pendiente: por escribir |
| REP-08 | Cartera del cliente (detalle) | Saldos coinciden con facturas y pagos | P2 | — | Pendiente: por escribir |
| REP-09 | Métricas generales | Cargan sin errores con y sin datos | P3 | — | Pendiente: por escribir |
| REP-10 | Reporte de clientes | Lista y exporta | P3 | NAS-045 | Pendiente: por escribir |

### 4.13 Configuración (CFG)

| ID | Caso | Resultado esperado | Prio | Ref. | Estado E2E |
| --- | --- | --- | --- | --- | --- |
| CFG-01 | Crear y editar el perfil de la firma | Datos guardados se ven en facturas | P2 | — | Pendiente: por escribir |
| CFG-02 | Subir logo de la firma | Se ve en el encabezado y en el PDF | P3 | — | Pendiente: por escribir |
| CFG-03 | Activar y desactivar avisos por correo | Cada interruptor guarda al instante; si falla, vuelve a su estado | P2 | NAS-014 | Pendiente: por escribir |
| CFG-04 | Horarios de notificación de vencimiento | Según la definición de NAS-088 | P3 | NAS-088 | Pendiente: Pendiente NAS-088 |
| CFG-05 | Configurar o deshabilitar proveedor de SMS | Según la definición de NAS-106 | P3 | NAS-106 | Pendiente: Pendiente NAS-106 |

### 4.14 Mensajes y notificaciones (MSG)

| ID | Caso | Resultado esperado | Prio | Ref. | Estado E2E |
| --- | --- | --- | --- | --- | --- |
| MSG-01 | Mensaje superior de éxito o informativo | Desaparece al completarse la acción y no vuelve en el siguiente ingreso | P1 | NAS-111 | Pendiente: Pendiente NAS-111 |
| MSG-02 | Mensaje superior de advertencia o error | Se muestra en cada ingreso mientras la condición siga | P1 | NAS-111 | Pendiente: Pendiente NAS-111 |
| MSG-03 | Textos de toast en acciones exitosas (crear, editar, eliminar por módulo) | Coinciden con el catálogo estandarizado | P1 | NAS-076 | Pendiente: Pendiente NAS-076 |
| MSG-04 | Campana: aviso nuevo en tiempo real | Llega sin recargar y suma al contador de no leídos | P2 | — | Pendiente: por escribir |
| MSG-05 | Campana: abrir marca como leídos | El contador vuelve a cero | P3 | — | Pendiente: por escribir |
| MSG-06 | Campana con la bandeja REST fallando (403 simulado) | La campana sigue funcionando y no se rompe el socket | P3 | — | Pendiente: por escribir |

### 4.15 Landing de planes (LND)

Aplica si la landing se sirve desde este repositorio; si vive en otro sitio, se agrega como otro `project` en la configuración.

| ID | Caso | Resultado esperado | Prio | Ref. | Estado E2E |
| --- | --- | --- | --- | --- | --- |
| LND-01 | Tarjetas de planes en 375, 768 y 1440 px | Sin texto desbordado (comparación visual) | P2 | NAS-075 | Pendiente: La landing no vive en este repositorio: definir su URL antes de activar |
| LND-02 | Porcentaje de descuento y almacenamiento | Formato correcto (`20 %`, `10 GB`) | P2 | NAS-075 | Pendiente: por escribir |
| LND-03 | Bullets del plan Ultimate | Coinciden con el texto aprobado | P3 | NAS-093 | Pendiente: por escribir |
| LND-04 | Botón de un plan | Lleva al registro con el plan preseleccionado | P2 | — | Pendiente: por escribir |

## 5. Fuera del E2E

Se cubren mejor con pruebas de backend o de componente, no con Playwright:

- Contenido del SMS de compra (NAS-004) y del de prueba gratuita (NAS-068).
- Comandos de mantenimiento: `auditdeletepermissions`, `repairplangroups`, `restrictgroupstoplan`.
- Reglas de cálculo puras (incrementos de tiempo, impuestos): pruebas unitarias; el E2E solo valida que el total llega a la pantalla y al PDF.
- Cobros recurrentes de la suscripción y reintentos de pago.

## 6. Orden de implementación

1. **Base:** configuración, login por rol con `storageState`, fixtures de datos por API, mock de pasarela, job en el pipeline de NAS-110.
2. **Smoke (`@smoke`, 8 casos):** AUT-01, AUT-03, DSH-01, CLI-01, EXP-01, TAR-01, FAC-01 y BLQ-07. Hecho.
3. **P1 en `develop`:** AUT, BLQ-01, BLQ-06 a BLQ-08, CLI-04, EXP-02, EXP-04, TAR-03. Hecho. Faltan PLT-05, FAC-02 y PAG-01 a PAG-03.
4. **P1 de ramas sin mezclar:** quitar el `test.fixme` al mezclar cada una: BLQ-09 y BLQ-10 (NAS-092 permisos), EXP-05 y REP-01/02 (NAS-038), BLQ-05 (NAS-061), FAC-03 (NAS-105). TAR-04 espera el merge de NAS-079 en `develop` de `nasbu-core`.
5. **P2 y P3**, y los ítems pendientes a medida que se implementan.

Hecho = escrito y verificado contra la app compilada de `develop` con backend simulado. Falta la primera corrida contra QA (sección 8).

## 7. Decisiones que cambian el resultado esperado

- **SUB-04:** hoy el downgrade es inmediato. Si el cliente lo quiere al final del ciclo pagado, el caso verifica que los módulos sigan visibles hasta esa fecha.
- **TAR-03 / TAR-04:** TAR-03 espera que en un expediente privado solo se ofrezca a quien tiene acceso. Falta definir si el owner o quien ve todos los expedientes puede ser asignado sin ser miembro.
- **PAG-04:** confirmar si un pago mayor al saldo se rechaza o se convierte en saldo a favor.
- **SUB-07, SUB-08, CLI-11, CFG-04, CFG-05, TAR-10, PLT-04, DSH-05:** se completan cuando cierre el análisis de su ítem.

## 8. Ejecución y hallazgos

- **Cómo se verificó:** QA no es accesible desde el entorno donde se escribieron las pruebas, así que se compiló `practice-app` de `develop` y se corrió el suite contra un backend simulado en memoria y un Cognito simulado. Eso valida selectores, flujos y lógica del front; no valida reglas del backend ni datos reales. La primera corrida contra QA puede pedir ajustes de selectores o de datos.
- **Backend:** `develop` de `nasbu-core` no tiene mezcladas las ramas NAS-020, 024, 027, 031, 038, 061, 073/092 y 079 (sí lo están en el front). En QA, el front de esos ítems funciona, pero el backend no los aplica: por ejemplo, un colaborador sin `delete_*` no ve el botón (BLQ-07 pasa), pero la API todavía le dejaría eliminar.
- **USR-02 (NAS-018) falla con el código actual:** al crear un colaborador, el formulario reemplaza sus contactos por los de la firma. Si la firma tiene correo, el correo de contacto ya viene lleno con el de la firma y no se copia el del usuario. Si no tiene, no hay campo de correo. La prueba queda activa porque describe lo pedido.
- **Rutas fuera del layout:** `#/customers/create-client` abierto por URL en una carga nueva redirige a `/`, porque su guard evalúa los permisos antes de que se carguen. Las pruebas entran desde la lista; conviene revisarlo junto con NAS-092.
- **Bienvenida (NAS-017):** el pop-up vuelve a salir tras el login y, al cerrarlo, se abre el menú de primeros pasos. El login de las pruebas cierra ambos.
