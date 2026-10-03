# Plan de implementación – Cierre Sprint Nasbu

Base: `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Rama de trabajo `features/cierre-sprint-nasbu` en ambos repos.

El cierre se resuelve en 6 fases. La F0 desbloquea el resto; la F1 concentra los defectos de seguridad y planes, que comparten causas raíz. Cinco ítems necesitan una decisión del cliente antes de cerrarse (NAS-029, NAS-058, NAS-088, NAS-092, NAS-096).

## Hallazgos transversales

Varias tarjetas comparten causa raíz. Resolverlas juntas evita parches duplicados.

| Id | Hallazgo | Dónde | Ítems |
| --- | --- | --- | --- |
| H1 | El grupo de permisos del plan se asigna solo al alta; el cambio de plan reemplaza los `SubscriptionFeature` pero nunca actualiza `SubscriptionMember.member_group` ni `SubscriptionUser.group`. | BE `subscription/models.py` (`default_group = plan.security_group` en el alta; `__upgrade_or_downgrade_plan__`) | NAS-073, NAS-092 |
| H2 | El chequeo de eliminación nunca se aplica: compara `self.action == 'delete'`, pero DRF llama a la acción `destroy`. `partial_update` tampoco se mapea. | BE `mixins/viewsets/viewsets.py` (`get_permissions`) | NAS-027 |
| H3 | Cada cambio de plan reinicia el límite de usuarios a 1: `create_subscription_features(self)` se llama sin `total_users`. | BE `subscription/models.py` (`__upgrade_or_downgrade_plan__`) | NAS-073, NAS-092, NAS-020 |
| H4 | La validación de flag de feature busca con `self` (el validador) en lugar de la suscripción, así que siempre falla. | BE `helpers/validations/validations.py` (`__execute_flag_validation__`) | NAS-061, NAS-031 |
| H5 | Errores de bloqueo sin formato común: `feature_code` se escribe como header HTTP en vez de en `response.data`; las excepciones de plan responden 501; el 403 de permiso no trae causa. | BE `helpers/exceptions/exceptions.py`, `subscription/exceptions.py`, `helpers/permissions/permissions.py` (`HasSubscriptionPermission`) | NAS-031, NAS-061, NAS-020, NAS-027 |
| H6 | El front no tiene manejo global de errores de bloqueo y el interceptor reintenta todo 2 veces (`retry(2)`), incluidos POST que fallan con 4xx. | FE `projects/core-services/src/lib/services/security/interceptor.service.ts` | NAS-031, NAS-061 |
| H7 | Los reportes filtran solo por suscripción, cliente y expediente; no aplican las reglas de acceso del usuario que sí aplica el listado de expedientes. | BE `reports/generators/generators.py`, `mixins/viewsets/viewsets.py` (`get_payload`), `practice/permissions/permissions.py` | NAS-038, NAS-045 |
| H8 | `master` del backend no tiene `/subscription/notification_preferences/` ni `/security/me/account_events/`, que el front de `master` ya consume. Están en la rama remota `features/notification-preferences` del backend, sin mergear. | BE rama `origin/features/notification-preferences` | NAS-014, NAS-067, NAS-088 |

## F0 · Prerrequisitos

1. **Integrar notificaciones en el backend (H8).** Mergear `origin/features/notification-preferences` en `features/cierre-sprint-nasbu` de `nasbu-core` y resolver conflictos en `subscription/models.py` y `security/views.py`. Sin esto, el front de `master` recibe 404 en Preferencias de notificación y en el aviso de cambio de contraseña. Cierra NAS-014 y NAS-067 del lado backend y habilita NAS-088.
2. **Línea base de pruebas.** Backend: `python manage.py test subscription security` debe pasar antes de tocar nada (`practice/tests.py`, `catalog/tests.py` y `accounting/tests.py` están vacíos). Frontend: las specs antiguas no compilan; usar tsconfigs dirigidos como `npm run test:notifications`.
3. **Seguridad inmediata (fuera de código).** Rotar la API key de MessageBird que está como valor por defecto en `nasbu_core/settings.py` y las contraseñas de la tarjeta #2 de Trello.
4. **Leer `docs/memory.md` de cada repo** antes de editar, y registrar ahí cada ítem terminado.

## F1 · Seguridad, permisos y planes

- **[NAS-031](items/NAS-031-mensaje-uniforme-cuando-una-accion-esta-bloqueada-por-permis.md)** (P1, Listo para desarrollo) — Mensaje uniforme cuando una acción está bloqueada por permiso, plan o límite.
- **[NAS-038](items/NAS-038-estado-de-cuenta-al-filtrar-por-usuario-aparecen-expedientes.md)** (P1, Listo para desarrollo) — Estado de cuenta: al filtrar por usuario aparecen expedientes que no le corresponden.
- **[NAS-073](items/NAS-073-el-upgrade-de-starter-a-ultimate-no-habilita-la-firma-de-doc.md)** (P1, Listo para desarrollo) — El upgrade de Starter a Ultimate no habilita la firma de documentos.
- **[NAS-079](items/NAS-079-probar-que-no-se-asignen-tareas-a-usuarios-fuera-de-un-exped.md)** (P1, Listo para desarrollo) — Probar que no se asignen tareas a usuarios fuera de un expediente privado.
- **[NAS-092](items/NAS-092-tras-bajar-de-ultimate-a-starter-siguen-visibles-modulos-fue.md)** (P1, Requiere decisión del cliente) — Tras bajar de Ultimate a Starter siguen visibles módulos fuera del plan.
- **[NAS-027](items/NAS-027-usuarios-con-permiso-de-escritura-pueden-eliminar-registros.md)** (P2, Listo para desarrollo) — Usuarios con permiso de escritura pueden eliminar registros.
- **[NAS-061](items/NAS-061-enviar-a-firmar-con-plan-starter-devuelve-error-403-en-lugar.md)** (P2, Listo para desarrollo) — Enviar a firmar con plan Starter devuelve error 403 en lugar de un mensaje de plan.
- **[NAS-020](items/NAS-020-bloquear-crear-nuevo-usuario-al-alcanzar-el-limite-del-plan.md)** (P3, Listo para desarrollo) — Bloquear "Crear nuevo usuario" al alcanzar el límite del plan.

## F2 · Defectos funcionales del front

- **[NAS-021](items/NAS-021-guardar-y-crear-otro-en-clientes-hace-desaparecer-los-campos.md)** (P1, Listo para desarrollo) — "Guardar y crear otro" en Clientes hace desaparecer los campos Contactos y Correo.
- **[NAS-101](items/NAS-101-el-temporizador-no-registra-el-tiempo-consumido-en-la-tarea.md)** (P1, Listo para desarrollo) — El temporizador no registra el tiempo consumido en la tarea asignada.
- **[NAS-017](items/NAS-017-el-mensaje-y-el-pop-up-de-bienvenida-aparecen-mas-de-una-vez.md)** (P2, Listo para desarrollo) — El mensaje y el pop-up de bienvenida aparecen más de una vez.
- **[NAS-024](items/NAS-024-no-se-puede-crear-un-expediente-si-el-monto-lleva-coma-de-mi.md)** (P2, Listo para desarrollo) — No se puede crear un expediente si el monto lleva coma de miles.
- **[NAS-018](items/NAS-018-replicar-el-correo-de-usuario-en-el-campo-correo-electronico.md)** (P3, Listo para desarrollo) — Replicar el correo de usuario en el campo Correo electrónico al crear un colaborador.
- **[NAS-105](items/NAS-105-factura-desde-expediente-el-item-manual-copia-el-texto-del-r.md)** (P3, Listo para desarrollo) — Factura desde expediente: el ítem manual copia el texto del reembolso.

## F3 · Facturación y reportes

- **[NAS-029](items/NAS-029-desglosar-en-el-pdf-de-factura-los-cobros-por-incremento-de.md)** (P1, Requiere decisión del cliente) — Desglosar en el PDF de factura los cobros por incremento de tiempo.
- **[NAS-046](items/NAS-046-reporte-de-horas-decimales-incorrectos-y-falta-el-tipo-de-fa.md)** (P2, Listo para desarrollo) — Reporte de horas: decimales incorrectos y falta el tipo de facturación.
- **[NAS-048](items/NAS-048-reporte-de-casos-la-fecha-de-creacion-y-la-de-cierre-salen-i.md)** (P2, Listo para desarrollo) — Reporte de casos: la fecha de creación y la de cierre salen iguales.
- **[NAS-109](items/NAS-109-reporte-de-casos-la-columna-no-fact-debe-ser-num-de-caso.md)** (P2, Listo para desarrollo) — Reporte de casos: la columna "# No. Fact." debe ser "Num. de Caso".
- **[NAS-096](items/NAS-096-avisar-que-falta-completar-el-perfil-de-la-firma-antes-de-fa.md)** (P2, Requiere decisión del cliente) — Avisar que falta completar el perfil de la firma antes de facturar.
- **[NAS-103](items/NAS-103-probar-pagos-parciales-a-facturas.md)** (P2, QA – pruebas automatizadas) — Probar pagos parciales a facturas.
- **[NAS-104](items/NAS-104-probar-factura-manual-eliminacion-y-demas-acciones.md)** (P2, QA – pruebas automatizadas) — Probar factura manual, eliminación y demás acciones.
- **[NAS-089](items/NAS-089-el-pdf-de-la-factura-no-muestra-el-telefono-de-la-firma.md)** (P3, Listo para desarrollo) — El PDF de la factura no muestra el teléfono de la firma.
- **[NAS-098](items/NAS-098-metrica-de-porcentaje-de-facturas-pagadas-a-tiempo.md)** (P3, Listo para desarrollo) — Métrica de porcentaje de facturas pagadas a tiempo.

## F4 · Planes, textos y UI

- **[NAS-076](items/NAS-076-corregir-y-estandarizar-los-textos-de-los-toast-de-acciones.md)** (P1, Listo para desarrollo) — Corregir y estandarizar los textos de los toast de acciones exitosas.
- **[NAS-075](items/NAS-075-landing-page-de-planes-texto-desbordado-porcentaje-y-almacen.md)** (P2, Listo para desarrollo) — Landing page de planes: texto desbordado, porcentaje y almacenamiento mal formateados.
- **[NAS-093](items/NAS-093-actualizar-los-bullets-del-plan-ultimate-en-la-landing-page.md)** (P3, Listo para desarrollo) — Actualizar los bullets del plan Ultimate en la landing page.
- **[NAS-058](items/NAS-058-enlazar-el-boton-como-guardar-la-plantilla-en-docx.md)** (P3, Requiere decisión del cliente) — Enlazar el botón "Cómo guardar la plantilla en .docx".
- **[NAS-057](items/NAS-057-al-subir-una-plantilla-el-icono-aparece-como-documento-roto.md)** (P3, Requiere definición (análisis)) — Al subir una plantilla, el ícono aparece como documento roto.

## F5 · Notificaciones y SMS

- **[NAS-004](items/NAS-004-el-sms-de-confirmacion-de-compra-muestra-0-00-en-lugar-del-m.md)** (P2, Requiere definición (análisis)) — El SMS de confirmación de compra muestra $0.00 en lugar del monto cobrado.
- **[NAS-088](items/NAS-088-ajustar-los-horarios-de-las-notificaciones-de-vencimiento-de.md)** (P3, Requiere decisión del cliente) — Ajustar los horarios de las notificaciones de vencimiento de tareas.
- **[NAS-068](items/NAS-068-texto-del-sms-para-la-prueba-gratuita-de-7-dias.md)** (P3, Requiere definición (análisis)) — Texto del SMS para la prueba gratuita de 7 días.
- **[NAS-106](items/NAS-106-configurar-el-proveedor-de-sms-y-permitir-deshabilitarlo.md)** (P3, Requiere definición (análisis)) — Configurar el proveedor de SMS y permitir deshabilitarlo.

## F6 · Análisis y definición con el cliente

- **[NAS-009](items/NAS-009-metodo-de-pago-en-perfil-de-la-firma-el-usuario-no-ve-que-ta.md)** (P1, Listo para desarrollo) — Método de pago en Perfil de la firma: el usuario no ve qué tarjeta se cobra.
- **[NAS-044](items/NAS-044-revisar-el-caso-del-cliente-que-no-pudo-crear-una-tarea.md)** (P2, Requiere definición (análisis)) — Revisar el caso del cliente que no pudo crear una tarea.
- **[NAS-102](items/NAS-102-temporizador-elegir-el-expediente-cuando-hay-tareas-con-el-m.md)** (P3, Listo para desarrollo) — Temporizador: elegir el expediente cuando hay tareas con el mismo nombre.
- **[NAS-011](items/NAS-011-cancelar-una-suscripcion.md)** (P3, Requiere definición (análisis)) — Cancelar una suscripción.
- **[NAS-045](items/NAS-045-reporte-de-clientes-para-descargar-la-base-de-datos.md)** (P3, Requiere definición (análisis)) — Reporte de clientes para descargar la base de datos.
- **[NAS-064](items/NAS-064-reutilizar-la-cuenta-de-un-usuario-que-sale-de-la-firma-sin.md)** (P3, Requiere definición (análisis)) — Reutilizar la cuenta de un usuario que sale de la firma sin consumir otra licencia.
- **[NAS-097](items/NAS-097-definir-las-reglas-de-negocio-de-los-indicadores-de-ahorro.md)** (P3, Requiere definición (análisis)) — Definir las reglas de negocio de los indicadores de ahorro.

## Orden y dependencias

- NAS-031 (formato de error + interceptor) antes de NAS-061, NAS-020 y NAS-027.
- NAS-073 y NAS-092 en el mismo cambio: comparten H1 y H3.
- NAS-038 crea el filtro de acceso a reportes que reutiliza NAS-045.
- NAS-103 (corrección de `payed_at`) antes de NAS-098.
- NAS-101 antes de NAS-102; NAS-029 comparte cálculo con NAS-046.
- NAS-106 antes de NAS-068. F0.1 antes de NAS-088.

## Decisiones pendientes del cliente

| Ítem | Decisión |
| --- | --- |
| NAS-092 | Downgrade inmediato o al final del ciclo pagado. |
| NAS-029 | El cobro real aplica incrementos solo a los minutos sobrantes de cada registro; la fórmula pedida no cuadra con el total. Cambiar la regla de cobro o el desglose. |
| NAS-096 | Campos obligatorios del perfil de la firma para facturar. |
| NAS-088 | Horarios globales o por suscripción. |
| NAS-058 | Quién graba el video y dónde se aloja. |
| NAS-075 / NAS-093 | Si la "landing" es la pantalla de planes de la app o un sitio aparte (no está en estos repos). |

## Cómo ejecutar con Claude Code

1. Abrir Claude Code en el repo correspondiente, en la rama `features/cierre-sprint-nasbu`.
2. Un ítem por sesión, en el orden de las fases. Prompt: `Implementa docs/cierre-sprint/items/NAS-031-*.md siguiendo docs/cierre-sprint/CLAUDE_CODE_INSTRUCCIONES.md`.
3. Los ítems que tocan ambos repos se hacen primero en backend (contrato de API) y luego en frontend, con el mismo ID en ambos commits.
