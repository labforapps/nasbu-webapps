# Memoria del proyecto

Bitácora de features, mejoras y bugs resueltos. La idea es que quede escrito lo que **no** se deduce
leyendo el código ni el historial de git: la causa raíz de un bug, por qué se resolvió de esa manera y
qué restricción externa lo condiciona.

**Leer este archivo antes de tocar código.** Después de implementar un feature, una mejora o resolver un
bug, y una vez verificado el cambio, agregar una entrada nueva **arriba de todo** (las entradas van de
más nueva a más vieja) con este formato:

```markdown
### AAAA-MM-DD — <feature | mejora | bug>: <título corto>

- **Qué:** qué se implementó, o qué estaba fallando y cómo se resolvió.
- **Por qué:** la causa raíz o la razón de la decisión, lo que no se ve en el código.
- **Archivos:** rutas tocadas.
```

---

### 2026-10-04 — bug: tras cambiar de plan los permisos no se actualizaban hasta cerrar sesión (NAS-073 / NAS-092)

- **Qué:**
  - `core-services` `AuthService.refreshUserInfo()` vuelve a pedir `/security/me/` aunque haya
    datos en memoria y conserva la suscripción seleccionada.
  - `practice-app` `AuthService.refreshPermissions()` lo usa y recarga `ngx-permissions`.
  - La pantalla de planes llama a `refreshPermissions()` cuando el cambio de plan se confirma.
  - La ruta `templates` exige `view_documenttemplate` o `view_documentgenerationlog` (los mismos
    del menú).
- **Por qué:** `fetchUserInfo()` cachea la respuesta en memoria durante toda la sesión, así que el
  `PermissionsResolver` nunca veía los permisos nuevos. Con la corrección del backend el grupo
  del plan cambia en el acto, pero el menú y los botones seguían con los del plan anterior. La
  ruta `templates` no tenía guard: el menú la ocultaba, pero abría escribiendo la URL.
- **Archivos:** `projects/core-services/src/lib/services/security/auth.service.ts` (+
  `auth.refresh.spec.ts`, `tsconfig.nas073.spec.json`),
  `projects/practice-app/src/app/services/auth/auth.service.ts`,
  `pages/configuration/plans/plans.component.ts` (+ `plans.permissions.spec.ts`),
  `app-routing.module.ts`.
- **Verificación:** `npm run build:services`; `ng test core-services
  --ts-config=projects/core-services/tsconfig.nas073.spec.json
  --include=lib/services/security/auth.refresh.spec.ts --watch=false --browsers=ChromeHeadless`
  (1 caso) y `ng test practice-app --include='**/plans.permissions.spec.ts' --watch=false
  --browsers=ChromeHeadless` (2 casos). `ng build --project=practice-app --configuration=qa` compila.
### 2026-10-04 — mejora: mensaje uniforme cuando el backend bloquea una acción (NAS-031)

- **Qué:**
  - Nuevo `BlockedActionInterceptor` (registrado en `app.module.ts` después del spinner). Ante un 403
    con `code` `permission_denied`, `plan_feature_missing` o `plan_limit_reached` muestra un
    `toastr.warning` con textos de `errorMessages.blockedAction.*` y re-lanza el error.
  - Con `feature_code` el mensaje nombra la función y, en un límite, la cantidad contratada
    (`errorMessages.blockedAction.features.<code>.{missing,limit}`, con `{{contracted}}`): "Tu
    plan actual no incluye la firma electrónica.", "Alcanzaste el límite de 3 usuarios de tu
    plan.". Si no hay texto para la función, o el límite llega sin `contracted`, se usa el
    genérico. Almacenamiento no muestra la cantidad porque el backend la guarda en bytes.
  - Opt-out con el header `X-Skip-Blocked-Toast` para pantallas que ya muestran su propio error;
    el interceptor lo quita antes de enviar la request.
  - El `AuthInterceptor` de `core-services` ya no reintenta respuestas 4xx: `retry(2)` pasó a
    `retry({ count: 2, delay })` que solo reintenta status 0 y 5xx.
- **Por qué:** El backend ahora informa la causa del bloqueo en `code` (ver bitácora de
  `nasbu-core`). El `retry(2)` reenviaba tres veces POSTs que el backend ya había rechazado y
  triplicaba cualquier toast de error. El 403 de la suscripción con pago pendiente no trae `code`,
  así que el interceptor no lo toca y sigue funcionando la redirección al checkout.
- **Archivos:** `projects/practice-app/src/app/shared/interceptors/blocked-action.interceptor.ts`
  (+ spec), `app.module.ts`, `assets/i18n/{es,en}.json`,
  `projects/core-services/src/lib/services/security/interceptor.service.ts` e
  `interceptor.retry.spec.ts`, `projects/core-services/tsconfig.cierre.spec.json`, `package.json`
  (script `test:cierre`).
- **Verificación:** `npm run build:services` y `npm run test:cierre` (2 + 6 casos);
  `ng build --project=practice-app --configuration=qa` compila.
### 2026-10-05 — mejora: el rol solo envía los módulos del plan (NAS-092)

- **Qué:** `PermissionComponent.updateSubscriptionGroups` envía el grupo con
  `modules_access` filtrado a los módulos del plan (`onlyPlanModules`).
- **Por qué:** La pantalla ya mostraba solo los módulos del plan, pero un rol creado antes, o de
  una firma que bajó de plan, conservaba módulos que ya no están. Al editarlo se reenviaban y
  el backend ahora los rechaza (ver bitácora de `nasbu-core`).
- **Archivos:** `pages/configuration/permission/permission.component.ts` (+
  `permission.plan-modules.spec.ts`).
- **Verificación:** `ng test practice-app --include='**/permission.plan-modules.spec.ts'
  --watch=false --browsers=ChromeHeadless` (2 casos). `ng build --project=practice-app
  --configuration=qa` compila. `dialog-new-role` está declarado pero ninguna pantalla lo usa.
### 2026-10-04 — bug: botones de eliminar visibles sin permiso de eliminación (NAS-027)

- **Qué:** 14 botones de eliminar quedan detrás de `*ngxPermissionsOnly="['delete_<modelo>']"`:
  pagos (2), horas cargadas, facturas, pasarelas de pago, grupos de permisos, métodos de pago,
  plantillas, documentos generados, notas (2), tipos de expediente, documentos del expediente y
  colaboradores. Los dos que ya tenían `*ngIf` se envolvieron en `ng-container`.
- **Por qué:** El backend no validaba `delete_*` (ver bitácora de `nasbu-core`) y el front mostraba
  el botón a cualquiera. Con el permiso ahora exigido en el backend, el botón visible sin permiso
  terminaba en un 403. El nombre del permiso es el `perm_postfix` del viewset que atiende la
  eliminación.
- **Fuera de alcance:** tipos de plantilla (`delete_documenttemplatetype` no está en el mapeo de
  módulos del backend, ocultarlo lo escondería también a los administradores), variables (se
  quitan del formulario, no llaman a la API) y el reverso de cartera.
- **Archivos:** `components/dialogs/dialog-payment-history`, `dialog-charged-hours`,
  `pages/invoicing/components/invoicing-table`, `pages/invoicing/payments/components/payments-table`,
  `pages/configuration/invoicing-parameters/subscription-payment-gateway`,
  `pages/configuration/permission`, `pages/configuration/profile-sign/payment-method`,
  `pages/documents-templates/{templates,documents}`, `pages/dashboard/dashboard-notes`,
  `pages/expedient/expedient-type-table`, `pages/expedient/expedient-info/{document,notes}`,
  `pages/collaborator` (todos `.component.html`).
- **Verificación:** `ng build --project=practice-app --configuration=qa` compila. Validación manual
  con un usuario de grupo de escritura: no ve los botones; un administrador sí.
### 2026-10-04 — bug: el diálogo de tarea ofrecía usuarios sin acceso al expediente privado (NAS-079)

- **Qué:** `DialogNewTaskComponent` guarda todos los usuarios en `allSecurityUsers` y muestra en
  el selector solo los que pueden trabajar en el expediente elegido
  (`assignableUsers`: en uno privado, el responsable y los de `case_file_user_access`). Al cambiar
  a un expediente privado se limpia un responsable que ya no es válido, salvo que venga fijado
  desde la pantalla de origen (`dataDialog.securityUser`).
- **Por qué:** El backend ahora rechaza esa asignación (ver bitácora de `nasbu-core`); sin el
  filtro, el usuario elegía a alguien de la lista y recibía un error al guardar. Expedientes y
  usuarios se cargan en paralelo, por eso el filtro se recalcula cuando llega cada uno.
- **Archivos:** `components/dialogs/dialog-new-task/dialog-new-task.component.ts` (+
  `dialog-new-task.assignees.spec.ts`).
- **Verificación:** `ng test practice-app --include='**/dialog-new-task.assignees.spec.ts'
  --watch=false --browsers=ChromeHeadless` (4 casos). `ng build --project=practice-app
  --configuration=qa` compila.
### 2026-10-04 — mejora: al crear un colaborador se copia su correo al correo de contacto (NAS-018)

- **Qué:** `CreateCollaboratorComponent.copyUserEmailToContact()`, en el `blur` de "Correo para
  tu usuario": si el primer correo de contacto está vacío, se llena con el mismo valor.
- **Por qué:** Pedido del cliente para no escribir dos veces el mismo correo. Solo aplica al
  crear (`securityUserId` vacío) y nunca pisa un correo ya escrito, porque el de contacto puede
  ser distinto al de acceso.
- **Archivos:** `pages/collaborator/create-collaborator/create-collaborator.component.{ts,html}`
  (+ `create-collaborator.email.spec.ts`).
- **Verificación:** `ng test practice-app --include='**/create-collaborator.email.spec.ts'
  --watch=false --browsers=ChromeHeadless` (3 casos). `ng build --project=practice-app
  --configuration=qa` compila.
### 2026-10-04 — bug: "Guardar y crear otro" en Clientes dejaba el formulario sin Contactos ni Correo (NAS-021)

- **Qué:** `CreateClientComponent.resetForm()` reconstruye el formulario con
  `initCreateClientForm()` y vuelve a aplicar el tipo de cliente elegido con `setCustomerType`
  (Persona o Empresa). También limpia la imagen elegida.
- **Por qué:** `createClientForm.reset()` pone en `null` el `type` de cada contacto, y después
  `addContactItem('contacts', 'E')` recibía un string: leía `item.type` (`undefined`) y agregaba
  grupos sin tipo. La plantilla muestra los contactos filtrando por `type`, así que Contactos y
  Correo desaparecían, pero sus `contact_value` requeridos seguían en el formulario y no se
  podía crear el siguiente cliente. Además se forzaba el tipo Persona aunque se estuviera
  cargando empresas.
- **Archivos:** `pages/client/create-client/create-client.component.ts` (+
  `create-client.reset.spec.ts`).
- **Verificación:** `ng test practice-app --include='**/create-client.reset.spec.ts' --watch=false
  --browsers=ChromeHeadless` (2 casos; sin el cambio fallan los 2). `ng build
  --project=practice-app --configuration=qa` compila. `pages/client/components/form-create-client`
  tiene el mismo `resetForm` roto, pero ninguna plantilla usa ese componente.
### 2026-10-04 — bug: el expediente no se creaba si el monto llevaba coma de miles (NAS-024)

- **Qué:** Nuevo `shared/utils/amount.ts` con `parseAmount()`: acepta `4,000` y `4,000.50`,
  devuelve `null` si está vacío y `NaN` si no es un monto. `DialogNewExpedientComponent`
  normaliza retención, precio por hora, precio por incremento y flat fee antes de validar y
  armar el payload (`normalizeAmounts`). Si un monto no es válido muestra un error con el formato
  esperado y no envía nada.
- **Por qué:** Los inputs de monto son texto libre: `"4,000"` viajaba tal cual y el backend lo
  rechazaba, y `Number("4,000")` daba `NaN`, lo que rompía además la validación de retención vs.
  flat fee. Un monto vacío se deja como estaba para no cambiar lo que se enviaba antes.
- **Archivos:** `shared/utils/amount.ts` (+ `amount.spec.ts`),
  `components/dialogs/dialog-new-expedient/dialog-new-expedient.component.ts` (+
  `dialog-new-expedient.amounts.spec.ts`).
- **Verificación:** `ng test practice-app --include='**/dialog-new-expedient.amounts.spec.ts'
  --include='**/shared/utils/amount.spec.ts' --watch=false --browsers=ChromeHeadless` (7 casos).
  `ng build --project=practice-app --configuration=qa` compila. Pendiente: aplicar `parseAmount`
  en tareas y facturas, y mostrar los montos formateados al salir del campo.

### 2026-10-04 — bug: un 403 de la bandeja cerraba el WebSocket de la campana

- **Qué:** La consulta REST de la bandeja (carga inicial y plan B) pasa por `catchError` dentro de
  `SubscriptionNotificationsService.getInboxSafely`: si falla, el stream sigue vivo y el socket
  no se cierra.
- **Por qué:** La campana une REST y WebSocket con `merge`. Un error REST (403 para quien no es
  dueño, ya corregido en el backend) terminaba el stream; el `async` pipe se desuscribía y el
  `WebsocketService` cerraba el socket con 1000, sin reintentar.
- **Archivos:** `projects/core-services/src/lib/services/subscription/subscription-notifications.service.ts`
  y su spec.

### 2026-10-04 — feature: la campana recibe los avisos en tiempo real

- **Qué:**
  - `WebsocketService` se reescribió: el socket se abre al suscribirse y se cierra al
    desuscribirse; ping cada 30 s; hasta 5 reintentos con espera creciente, pidiendo un token
    nuevo en cada uno; y estado `connected$`.
  - `SubscriptionNotificationsService.getNotifications(subscriptionId)` une tres fuentes: la
    carga inicial, el WebSocket (`?subscriptionId=&token=<access token>`) y, mientras no hay
    conexión, una consulta REST cada 60 s.
  - El header deduplica por `uuid`, cuenta solo los no leídos y marca como leídos en local al
    abrir la campana o hacer clic.
- **Por qué:** La escucha estaba desactivada (`return of([])`) y la reconexión vieja encadenaba
  intentos aunque ya hubiera conexión. El WebSocket ahora exige el access token (lo valida la
  Lambda `$connect` de `nasbu-lambda-services`); `getAccessToken()` devolvía el id token, por eso
  se agregó `getCognitoAccessToken()`.
- **Archivos:** `projects/core-services/src/lib/services/application/websocket.service.ts` y su
  spec, `.../subscription/subscription-notifications.service.ts` y su spec,
  `.../security/auth.service.ts`, `projects/practice-app/.../header/header.component.ts`,
  `tsconfig.notifications.spec.json`, `package.json`.
- **Verificación:** `npm run test:notifications` (14 + 15 casos) y `npm run build-qa`.
  `jasmine.clock()` no funciona con los timers de zone.js: los specs usan `fakeAsync`/`tick`.

### 2026-10-03 — mejora: la pantalla de notificaciones vuelve al diseño de la maqueta

- **Qué:** `configuration/notification` vuelve a la estructura y las clases de la maqueta
  original: pestaña "Configuraciones", bloques `l-notification` por categoría, tarjetas
  `c-notification-cog` y un único `c-switch` por aviso, con su estado escrito. No tiene estilos
  propios ni botón de guardar. El interruptor controla el email (el dashboard es obligatorio;
  lo explica el tooltip). Cada cambio se guarda al instante; si falla, el interruptor vuelve a su
  estado y se muestra un toastr de error.
- **Por qué:** La primera versión del feature había reemplazado la maqueta por un formulario con
  estilos propios y botón Guardar, divorciado del diseño de la app.
- **Archivos:** `projects/practice-app/src/app/pages/configuration/notification/*`,
  `assets/i18n/{es,en}.json`.

### 2026-10-03 — feature: cambio de contraseña con sesión iniciada

- **Qué:**
  - Nuevo diálogo *Cambiar contraseña* en el menú del usuario (header). Pide la contraseña
    actual y la nueva dos veces, con las mismas reglas que la contraseña inicial.
  - Cambia la contraseña con Amplify (`Auth.changePassword`) y luego llama a
    `POST /security/me/account_events/` (`password_changed`). Así el backend genera el aviso
    "Cambio importante en tu cuenta" por dashboard y email.
  - Traduce los errores de Cognito: contraseña actual incorrecta, política, demasiados intentos.
- **Por qué:** La app no tenía forma de cambiar la contraseña sin cerrar sesión (solo la inicial
  y la recuperación), y el aviso de seguridad del backend no tenía quién lo disparara. Si el
  aviso al backend falla no se bloquea al usuario: la contraseña ya cambió en Cognito.
- **Archivos:** `projects/practice-app/src/app/components/dialogs/dialog-change-password/`,
  `components/components.module.ts`, `components/layout/header/header.component.{html,ts}`,
  `services/auth/auth.service.ts`, `projects/core-services/src/lib/services/security/auth.service.ts`
  (`changePassword`) y `security.service.ts` (`reportAccountEvent`), `assets/i18n/{es,en}.json`,
  `package.json`.
- **Verificación:** `npm run test:notifications` (6 + 16 casos, 5 del diálogo) y `npm run build-qa`.
  Falta la prueba manual contra Cognito en QA.

### 2026-10-02 — mejora: 24 notificaciones, dashboard obligatorio y enlaces que llevan al recurso

- **Qué:**
  - La pantalla de preferencias muestra 24 avisos en 7 categorías. El dashboard queda fijo
    (siempre activo) y solo se edita el email. El servicio envía solo `{code, email}`.
  - Se quitó `ngDoCheck`, que releía `localStorage` en cada ciclo de detección de cambios: la
    suscripción se lee en `ngOnInit`, como en el resto de las páginas.
  - Llamada a la acción:
    - el `AuthGuard` ahora exige sesión, guarda la ruta pedida y el login vuelve a ella
      (`consumeReturnUrl`);
    - el resolver de permisos selecciona la suscripción de `?ssid=`;
    - `/#/task?task=<uuid>` abre el detalle de la tarea;
    - `expedient-info` acepta `?tab=` por nombre (`documents`, `wallet`…) además del índice;
    - la campana navega con el router si el enlace es de la propia app.
  - Campo "Alerta de retainer bajo" en Parámetros de facturación.
- **Por qué:**
  - El `AuthGuard` devolvía siempre `true`: abrir el enlace de un email sin sesión dejaba una
    pantalla protegida cuya carga fallaba con 401, sin llevar al login.
  - Los enlaces del backend eran genéricos (`/#/task`) y no abrían el recurso.
- **Archivos:**
  - `projects/core-services/src/lib/services/security/auth.guard.ts` y
    `auth.guard.notifications.spec.ts`, `.../security/auth.service.ts` (`selectSubscription`),
    `projects/core-services/src/test.ts` (polyfill `global` para Amplify en pruebas),
    `projects/core-services/tsconfig.notifications.spec.json`;
  - `projects/core-models/.../notification-preferences.ts`, `.../subscription/subscription.ts`;
  - `projects/practice-app/src/app/resolvers/permissions.resolver.ts`,
    `services/auth/auth.service.ts`, `pages/login/login.component.ts`,
    `components/layout/header/header.component.ts`, `pages/taskpage/taskpage.component.ts`,
    `pages/expedient/expedient-info/expedient-info.component.ts`,
    `pages/configuration/notification/*`, `pages/configuration/invoicing-parameters/*`,
    `pages/notification-links.spec.ts`;
  - `assets/i18n/{es,en}.json`, `package.json`.
- **Verificación:** compilar `core-models` y `core-services` y luego `npm run test:notifications`
  (6 casos en `core-services` + 11 en `practice-app`). `npm run build-qa` compila.
  `practice-app` usa las librerías compiladas en `dist/`: sin recompilarlas, los tipos nuevos
  no existen y las pruebas fallan al compilar.

### 2026-09-29 — feature: preferencias personales de las siete notificaciones

- **Qué:** Se convirtió la maqueta de configuración en un formulario con controles separados
  Dashboard/Email para tarea completada/vencida, expediente abierto/cerrado y factura
  creada/pagada/vencida. Se añadieron tipos compartidos, métodos GET/PATCH, traducciones es/en,
  mensajes de carga/error/guardado y aislamiento al cambiar de suscripción. Rama:
  `features/notification-preferences`.
- **Por qué:** Los controles anteriores no persistían configuración y Facturación repetía
  etiquetas de tareas. El backend ahora aplica preferencias por usuario y suscripción, sin
  ampliar el acceso a los recursos. El contrato sigue en `/subscription/notification_preferences/`.
- **Archivos:** `projects/core-models/src/lib/models/notification-preferences.ts` e `index.ts`,
  `projects/core-services/src/lib/services/subscription/subscription-notifications.service.ts`
  y su spec, `projects/practice-app/src/app/pages/configuration/notification/`,
  `projects/practice-app/src/assets/i18n/{es,en}.json`,
  `projects/core-services/tsconfig.notifications.spec.json`, `package.json`.
- **Verificación:** `npm run test:notifications`: 2 casos HTTP + 6 formulario aprobados.
  `npm run build-qa`: bibliotecas y aplicación compiladas. El tsconfig dirigido evita que un
  spec antiguo del interceptor que no compila deje las pruebas HTTP con cero casos;
  una salida de cero pruebas no cuenta como validación. Se preservaron los cambios locales
  ajenos al feature y no se cambió la recepción WebSocket existente.

### 2026-08-31 — bug: se entraba a la app con la cuenta confirmada pero sin haber pagado

- **Qué:** en el alta por redirect se podía terminar con la cuenta de Cognito confirmada, la
  suscripción en `'Z'` (pendiente de tokenización) y acceso completo a la app. Ahora el backend
  responde 403 para esas suscripciones, y del lado del front se implementó `SubscriptionGuard`
  —que era un stub que devolvía `true` y **no estaba aplicado a ninguna ruta**— y se lo enganchó
  en la ruta del `LayoutComponent` junto al `AuthGuard`. El login y el guard mandan al usuario de
  vuelta a PlaceToPay pidiendo una sesión nueva (`resume_tokenization`), en vez de dejarlo con una
  cuenta bloqueada.
- **Por qué:** el modo redirect invierte el orden (ver la entrada del 2026-08-11), y eso implica
  que `Auth.signUp` corre primero — **y Cognito manda el mail de verificación en ese instante**,
  antes de que la tarjeta se tokenice. Quien abandonaba el checkout y hacía clic en ese mail
  confirmaba la cuenta igual. Dos cosas que no se ven leyendo el código: el trigger
  **PostConfirmation** de Cognito (que vive en AWS, no en ningún repo) llama a
  `/subscription/onboarding/confirm/`, y como corre *después* de la confirmación no puede
  impedirla — por eso el corte tuvo que ser de **acceso** y no de confirmación. Y del lado del
  backend nada verificaba el estado de la suscripción, así que una en `'Z'` operaba normal.
  No se reutiliza el `first_checkout_url` guardado porque la sesión de PlaceToPay vive 30 minutos
  y para cuando el usuario vuelve ya venció.
- **Archivos:** `projects/practice-app/src/app/services/auth/subscription.guard.ts` (+ spec),
  `services/checkout/checkout-redirect.service.ts` (nuevo: seam para `window.location.href`, sin
  él Karma se cae con *"Some of your tests did a full page reload!"*),
  `pages/login/login.component.ts` (+ spec), `services/auth/auth.service.ts`,
  `services/onboarding/onboarding.service.ts`, `app-routing.module.ts`,
  `pages/account-confirmation/account-confirmation.component.ts`,
  `projects/core-services/.../security/auth.service.ts` e `interceptor.service.ts`,
  `projects/core-services/.../subscription/subscription.service.ts`,
  `projects/core-models/.../security.ts` y `subscription.ts`, `assets/i18n/{es,en}.json`.
  Requiere reconstruir `core-models` y `core-services` para que `practice-app` los tome.

### 2026-08-27 — bug: la pantalla de signup se frizaba al editar la cantidad de usuarios

- **Qué:** en `/#/signup`, cambiar el campo de cantidad de usuarios colgaba la pestaña. El getter
  `planTotalPrice` mutaba `this.totalUsers` mientras el template lo interpolaba. Se separó en tres piezas:
  `usersCount` (getter puro que normaliza y es el único punto de verdad, lo usan el precio y el payload),
  `onTotalUsersChange()` (aplica el mínimo de 1 en el mismo tecleo) y `normalizeTotalUsers()` (corrige el
  campo vacío en el `blur`). El input pasó de `[(ngModel)]` a `[ngModel]` + `(ngModelChange)` para poder
  interceptar el valor antes de que llegue al modelo.
- **Por qué:** un getter que consume el template corre en cada ciclo de change detection y tiene que ser
  puro. Con el campo vacío `ngModel` escribe `null`, y la vieja normalización lo dejaba alternando entre
  `0` y `-0` ciclo a ciclo; Angular compara bindings con `Object.is`, que los ve distintos, así que
  `NgModel.ngOnChanges` encolaba un microtask por ciclo y el loop nunca le devolvía el hilo al navegador.
  El campo vacío se respeta mientras se tipea porque es estado de tránsito al reemplazar el valor:
  forzarlo a 1 en cada tecla le pisa al usuario lo que está escribiendo.
- **Archivos:** `projects/practice-app/src/app/pages/register/register.component.ts` y `.html`.

### 2026-08-26 — bug: el signup fallaba con `InvalidParameterException` de Cognito

- **Qué:** dar de alta una suscripción cortaba con *"Attributes did not conform to the schema: addresses /
  birthdate / gender / picture is required"*. `Auth.signUp` mandaba `''` en esos cuatro atributos; ahora
  van con placeholders (`'-'`, y `'1900-01-01'` para `birthdate`).
- **Por qué:** los dos pools (`us-east-1_GhGElWDEe` dev, `us-east-1_y0A2UwzZU` prod) marcan `address`,
  `birthdate`, `gender` y `picture` como *required*, y Cognito trata el string vacío como atributo ausente.
  `birthdate` además tiene constraint de largo exacto 10, de ahí el formato `YYYY-MM-DD`. El flag
  `Required` del esquema es **inmutable** una vez creado el pool: no se puede desmarcar, hay que mandar
  valores no vacíos. `profile` sí acepta `''` porque no es required. La app no lee ninguno de estos cuatro
  atributos, son solo para cumplir el esquema; si algún día se quiere el dato real hay que pedirlo en el
  formulario de alta.
- **Archivos:** `projects/core-services/src/lib/services/security/auth.service.ts` (requiere
  `npm run build:services` para que `practice-app` lo tome).

### 2026-08-11 — feature: checkout de PlaceToPay en modo redirect

- **Qué:** se agregó un segundo camino de alta. `CheckoutModeService.detect()` elige entre lightbox y
  redirect, con override por query param (`?checkout=redirect`) para poder probar ambos sin cambiar de
  navegador. En redirect se invierte el orden respecto del lightbox: primero se crean el usuario y la
  suscripción, después se tokeniza la tarjeta, y el retorno de PlaceToPay cae en la misma ruta `/signup`
  con `subscription_id` en la URL, donde se confirma o se cancela la tokenización.
- **Por qué:** el lightbox se abre en un iframe y las políticas de cookies de terceros de WebKit lo rompen,
  así que en Safari y en móviles no queda otra que el redirect. Detalles que no se ven en el código:
  la **ausencia** de `pm_request_id` en los atributos del signup es la señal que usa el backend para armar
  la sesión de tokenización (no alcanza con mandarlo en `undefined`, Amplify lo manda igual); la
  referencia que va a PlaceToPay tiene que ser única por intento y de máximo 32 caracteres, por eso el
  UUID va sin guiones; y `confirm/cancel_tokenization` son idempotentes en el backend porque el
  `AuthInterceptor` reintenta las requests fallidas.
- **Archivos:** `projects/practice-app/src/app/services/checkout/checkout-mode.service.ts`,
  `pages/register/register.component.ts`, `services/onboarding/onboarding.service.ts`,
  `projects/core-services/src/lib/services/subscription/subscription.service.ts`.
