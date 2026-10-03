# Cierre Sprint Nasbu – Backlog y plan

41 ítems del tablero de Trello [Nasbu 2026-2027 – Reporte Sprint 10 Junio–15 Junio](https://trello.com/b/3oiJghTd/nasbu-2026-2027-reporte-sprint-10-junio-15-junio), mapeados al código de `nasbu-core` y `nasbu-webapps`. Esta misma carpeta existe en los dos repos.

- **Rama de trabajo:** `features/cierre-sprint-nasbu`, creada desde `master` el 2026-10-03 en ambos repos. No se trabaja sobre `master`.
- **Por tipo:** 18 defectos, 15 historias, 6 análisis, 2 de pruebas.
- **Por estado:** 25 listos para desarrollo, 5 requieren decisión del cliente, 2 de pruebas, 9 requieren análisis.

Ver `PLAN.md` para fases, hallazgos transversales y dependencias, y `CLAUDE_CODE_INSTRUCCIONES.md` para el flujo de trabajo.

## Ítems por fase

### F0 · Prerrequisitos

| ID | Tipo | Prio | Estado | Repos | Título | Trello |
| --- | --- | --- | --- | --- | --- | --- |
| [NAS-014](items/NAS-014-configuracion-de-notificaciones.md) | HU | P3 | Listo para desarrollo | backend + frontend | Configuración de notificaciones | [eJOlyz8y](https://trello.com/c/eJOlyz8y) |
| [NAS-067](items/NAS-067-destino-del-enlace-en-el-correo-de-tarea-asignada.md) | HU | P3 | Listo para desarrollo | backend + frontend | Destino del enlace en el correo de tarea asignada | [7kx1dS4L](https://trello.com/c/7kx1dS4L) |

### F1 · Seguridad, permisos y planes

| ID | Tipo | Prio | Estado | Repos | Título | Trello |
| --- | --- | --- | --- | --- | --- | --- |
| [NAS-031](items/NAS-031-mensaje-uniforme-cuando-una-accion-esta-bloqueada-por-permis.md) | HU | P1 | Listo para desarrollo | backend + frontend | Mensaje uniforme cuando una acción está bloqueada por permiso, plan o límite | [yxG77Hmu](https://trello.com/c/yxG77Hmu) |
| [NAS-038](items/NAS-038-estado-de-cuenta-al-filtrar-por-usuario-aparecen-expedientes.md) | BUG | P1 | Listo para desarrollo | backend + frontend | Estado de cuenta: al filtrar por usuario aparecen expedientes que no le corresponden | [3ohM4g8U](https://trello.com/c/3ohM4g8U) |
| [NAS-073](items/NAS-073-el-upgrade-de-starter-a-ultimate-no-habilita-la-firma-de-doc.md) | BUG | P1 | Listo para desarrollo | backend + frontend | El upgrade de Starter a Ultimate no habilita la firma de documentos | [WhLTixCh](https://trello.com/c/WhLTixCh) |
| [NAS-079](items/NAS-079-probar-que-no-se-asignen-tareas-a-usuarios-fuera-de-un-exped.md) | BUG | P1 | Listo para desarrollo | backend + frontend | Probar que no se asignen tareas a usuarios fuera de un expediente privado | [6xGOtIgk](https://trello.com/c/6xGOtIgk) |
| [NAS-092](items/NAS-092-tras-bajar-de-ultimate-a-starter-siguen-visibles-modulos-fue.md) | BUG | P1 | Requiere decisión del cliente | backend + frontend | Tras bajar de Ultimate a Starter siguen visibles módulos fuera del plan | [JxCgkHLP](https://trello.com/c/JxCgkHLP) |
| [NAS-027](items/NAS-027-usuarios-con-permiso-de-escritura-pueden-eliminar-registros.md) | BUG | P2 | Listo para desarrollo | backend + frontend | Usuarios con permiso de escritura pueden eliminar registros | [F1jD5yHM](https://trello.com/c/F1jD5yHM) |
| [NAS-061](items/NAS-061-enviar-a-firmar-con-plan-starter-devuelve-error-403-en-lugar.md) | BUG | P2 | Listo para desarrollo | backend + frontend | Enviar a firmar con plan Starter devuelve error 403 en lugar de un mensaje de plan | [nazNk0XD](https://trello.com/c/nazNk0XD) |
| [NAS-020](items/NAS-020-bloquear-crear-nuevo-usuario-al-alcanzar-el-limite-del-plan.md) | HU | P3 | Listo para desarrollo | backend + frontend | Bloquear "Crear nuevo usuario" al alcanzar el límite del plan | [H5WZ6CfO](https://trello.com/c/H5WZ6CfO) |

### F2 · Defectos funcionales del front

| ID | Tipo | Prio | Estado | Repos | Título | Trello |
| --- | --- | --- | --- | --- | --- | --- |
| [NAS-021](items/NAS-021-guardar-y-crear-otro-en-clientes-hace-desaparecer-los-campos.md) | BUG | P1 | Listo para desarrollo | frontend | "Guardar y crear otro" en Clientes hace desaparecer los campos Contactos y Correo | [2FTlYdeA](https://trello.com/c/2FTlYdeA) |
| [NAS-101](items/NAS-101-el-temporizador-no-registra-el-tiempo-consumido-en-la-tarea.md) | BUG | P1 | Listo para desarrollo | backend + frontend | El temporizador no registra el tiempo consumido en la tarea asignada | [TNptWo2B](https://trello.com/c/TNptWo2B) |
| [NAS-017](items/NAS-017-el-mensaje-y-el-pop-up-de-bienvenida-aparecen-mas-de-una-vez.md) | BUG | P2 | Listo para desarrollo | backend + frontend | El mensaje y el pop-up de bienvenida aparecen más de una vez | [dPQVwkka](https://trello.com/c/dPQVwkka), [GYDwkUVK](https://trello.com/c/GYDwkUVK) |
| [NAS-024](items/NAS-024-no-se-puede-crear-un-expediente-si-el-monto-lleva-coma-de-mi.md) | BUG | P2 | Listo para desarrollo | backend + frontend | No se puede crear un expediente si el monto lleva coma de miles | [t7wUT9j7](https://trello.com/c/t7wUT9j7) |
| [NAS-018](items/NAS-018-replicar-el-correo-de-usuario-en-el-campo-correo-electronico.md) | HU | P3 | Listo para desarrollo | frontend | Replicar el correo de usuario en el campo Correo electrónico al crear un colaborador | [EjOeRvLd](https://trello.com/c/EjOeRvLd) |
| [NAS-105](items/NAS-105-factura-desde-expediente-el-item-manual-copia-el-texto-del-r.md) | BUG | P3 | Listo para desarrollo | frontend | Factura desde expediente: el ítem manual copia el texto del reembolso | [7zIVpnIh](https://trello.com/c/7zIVpnIh) |

### F3 · Facturación y reportes

| ID | Tipo | Prio | Estado | Repos | Título | Trello |
| --- | --- | --- | --- | --- | --- | --- |
| [NAS-029](items/NAS-029-desglosar-en-el-pdf-de-factura-los-cobros-por-incremento-de.md) | HU | P1 | Requiere decisión del cliente | backend | Desglosar en el PDF de factura los cobros por incremento de tiempo | [ZWkaga2u](https://trello.com/c/ZWkaga2u) |
| [NAS-046](items/NAS-046-reporte-de-horas-decimales-incorrectos-y-falta-el-tipo-de-fa.md) | BUG | P2 | Listo para desarrollo | backend | Reporte de horas: decimales incorrectos y falta el tipo de facturación | [dUkhBKi5](https://trello.com/c/dUkhBKi5) |
| [NAS-048](items/NAS-048-reporte-de-casos-la-fecha-de-creacion-y-la-de-cierre-salen-i.md) | BUG | P2 | Listo para desarrollo | backend | Reporte de casos: la fecha de creación y la de cierre salen iguales | [qZE8jkmv](https://trello.com/c/qZE8jkmv) |
| [NAS-109](items/NAS-109-reporte-de-casos-la-columna-no-fact-debe-ser-num-de-caso.md) | BUG | P2 | Listo para desarrollo | backend | Reporte de casos: la columna "# No. Fact." debe ser "Num. de Caso" | [GQOsPV30](https://trello.com/c/GQOsPV30) |
| [NAS-096](items/NAS-096-avisar-que-falta-completar-el-perfil-de-la-firma-antes-de-fa.md) | HU | P2 | Requiere decisión del cliente | backend + frontend | Avisar que falta completar el perfil de la firma antes de facturar | [LE4OmR7a](https://trello.com/c/LE4OmR7a) |
| [NAS-103](items/NAS-103-probar-pagos-parciales-a-facturas.md) | QA | P2 | QA – pruebas automatizadas | backend + frontend | Probar pagos parciales a facturas | [6t4sQQgx](https://trello.com/c/6t4sQQgx) |
| [NAS-104](items/NAS-104-probar-factura-manual-eliminacion-y-demas-acciones.md) | QA | P2 | QA – pruebas automatizadas | backend + frontend | Probar factura manual, eliminación y demás acciones | [bTDiGcoQ](https://trello.com/c/bTDiGcoQ) |
| [NAS-089](items/NAS-089-el-pdf-de-la-factura-no-muestra-el-telefono-de-la-firma.md) | BUG | P3 | Listo para desarrollo | backend | El PDF de la factura no muestra el teléfono de la firma | [eUR5B6pH](https://trello.com/c/eUR5B6pH) |
| [NAS-098](items/NAS-098-metrica-de-porcentaje-de-facturas-pagadas-a-tiempo.md) | HU | P3 | Listo para desarrollo | backend + frontend | Métrica de porcentaje de facturas pagadas a tiempo | [Zv0dev7N](https://trello.com/c/Zv0dev7N) |

### F4 · Planes, textos y UI

| ID | Tipo | Prio | Estado | Repos | Título | Trello |
| --- | --- | --- | --- | --- | --- | --- |
| [NAS-076](items/NAS-076-corregir-y-estandarizar-los-textos-de-los-toast-de-acciones.md) | HU | P1 | Listo para desarrollo | frontend | Corregir y estandarizar los textos de los toast de acciones exitosas | [Q6AUeYfr](https://trello.com/c/Q6AUeYfr) |
| [NAS-075](items/NAS-075-landing-page-de-planes-texto-desbordado-porcentaje-y-almacen.md) | BUG | P2 | Listo para desarrollo | frontend | Landing page de planes: texto desbordado, porcentaje y almacenamiento mal formateados | [AvCDzX48](https://trello.com/c/AvCDzX48), [6py3Eogx](https://trello.com/c/6py3Eogx) |
| [NAS-093](items/NAS-093-actualizar-los-bullets-del-plan-ultimate-en-la-landing-page.md) | HU | P3 | Listo para desarrollo | backend + frontend | Actualizar los bullets del plan Ultimate en la landing page | [cTvxiXEN](https://trello.com/c/cTvxiXEN) |
| [NAS-058](items/NAS-058-enlazar-el-boton-como-guardar-la-plantilla-en-docx.md) | HU | P3 | Requiere decisión del cliente | frontend | Enlazar el botón "Cómo guardar la plantilla en .docx" | [1y3TxrE0](https://trello.com/c/1y3TxrE0) |
| [NAS-057](items/NAS-057-al-subir-una-plantilla-el-icono-aparece-como-documento-roto.md) | BUG | P3 | Requiere definición (análisis) | frontend | Al subir una plantilla, el ícono aparece como documento roto | [WISX4edu](https://trello.com/c/WISX4edu) |

### F5 · Notificaciones y SMS

| ID | Tipo | Prio | Estado | Repos | Título | Trello |
| --- | --- | --- | --- | --- | --- | --- |
| [NAS-004](items/NAS-004-el-sms-de-confirmacion-de-compra-muestra-0-00-en-lugar-del-m.md) | BUG | P2 | Requiere definición (análisis) | backend | El SMS de confirmación de compra muestra $0.00 en lugar del monto cobrado | [BWTJTI7C](https://trello.com/c/BWTJTI7C) |
| [NAS-088](items/NAS-088-ajustar-los-horarios-de-las-notificaciones-de-vencimiento-de.md) | HU | P3 | Requiere decisión del cliente | backend | Ajustar los horarios de las notificaciones de vencimiento de tareas | [RdD9fmqn](https://trello.com/c/RdD9fmqn) |
| [NAS-068](items/NAS-068-texto-del-sms-para-la-prueba-gratuita-de-7-dias.md) | SPIKE | P3 | Requiere definición (análisis) | backend | Texto del SMS para la prueba gratuita de 7 días | [EUfemVsR](https://trello.com/c/EUfemVsR) |
| [NAS-106](items/NAS-106-configurar-el-proveedor-de-sms-y-permitir-deshabilitarlo.md) | HU | P3 | Requiere definición (análisis) | backend + frontend | Configurar el proveedor de SMS y permitir deshabilitarlo | [NBEIhxKe](https://trello.com/c/NBEIhxKe) |

### F6 · Análisis y definición con el cliente

| ID | Tipo | Prio | Estado | Repos | Título | Trello |
| --- | --- | --- | --- | --- | --- | --- |
| [NAS-009](items/NAS-009-metodo-de-pago-en-perfil-de-la-firma-el-usuario-no-ve-que-ta.md) | SPIKE | P1 | Listo para desarrollo | backend + frontend | Método de pago en Perfil de la firma: el usuario no ve qué tarjeta se cobra | [un40Ma6i](https://trello.com/c/un40Ma6i) |
| [NAS-044](items/NAS-044-revisar-el-caso-del-cliente-que-no-pudo-crear-una-tarea.md) | SPIKE | P2 | Requiere definición (análisis) | backend + frontend | Revisar el caso del cliente que no pudo crear una tarea | [M3TPD7Xr](https://trello.com/c/M3TPD7Xr) |
| [NAS-102](items/NAS-102-temporizador-elegir-el-expediente-cuando-hay-tareas-con-el-m.md) | HU | P3 | Listo para desarrollo | frontend | Temporizador: elegir el expediente cuando hay tareas con el mismo nombre | [kPzCaBVq](https://trello.com/c/kPzCaBVq) |
| [NAS-011](items/NAS-011-cancelar-una-suscripcion.md) | SPIKE | P3 | Requiere definición (análisis) | backend | Cancelar una suscripción | [lmOXayjK](https://trello.com/c/lmOXayjK) |
| [NAS-045](items/NAS-045-reporte-de-clientes-para-descargar-la-base-de-datos.md) | HU | P3 | Requiere definición (análisis) | backend + frontend | Reporte de clientes para descargar la base de datos | [A2AizFjo](https://trello.com/c/A2AizFjo) |
| [NAS-064](items/NAS-064-reutilizar-la-cuenta-de-un-usuario-que-sale-de-la-firma-sin.md) | SPIKE | P3 | Requiere definición (análisis) | backend + frontend | Reutilizar la cuenta de un usuario que sale de la firma sin consumir otra licencia | [y6jhrCYu](https://trello.com/c/y6jhrCYu) |
| [NAS-097](items/NAS-097-definir-las-reglas-de-negocio-de-los-indicadores-de-ahorro.md) | SPIKE | P3 | Requiere definición (análisis) | backend + frontend | Definir las reglas de negocio de los indicadores de ahorro | [7AwSuDxZ](https://trello.com/c/7AwSuDxZ) |

La tarjeta #2 (usuarios de prueba) no se incluye: contiene contraseñas en texto plano de cuentas en producción. Rotarlas y quitarlas de Trello.
