# NAS-106 · [HU] Configurar el proveedor de SMS y permitir deshabilitarlo

| Campo | Valor |
| --- | --- |
| Tipo | Historia de usuario |
| Prioridad | P3 |
| Fase | F5 · Notificaciones y SMS |
| Estado para Claude Code | Requiere definición (análisis) |
| Repos | backend + frontend |
| Lista en Trello | Evaluar |
| Tarjeta(s) Trello | [NBEIhxKe](https://trello.com/c/NBEIhxKe) |
| Relacionado con | NAS-004, NAS-068 |

## Contexto

Hay que poder configurar el proveedor de SMS y deshabilitar los SMS. Es un feature sin desarrollar; primero hay que aprobar el alcance.

## Historia de usuario

**Como** administrador de la plataforma, **quiero** configurar o desactivar el proveedor de SMS, **para** controlar costos y canales.

## Criterios de aceptación

- [ ] Credenciales del proveedor en variables de entorno o secretos, no en el código.
- [ ] Un interruptor que desactiva el envío de SMS sin romper los flujos que lo usan (ej.: código de confirmación con alternativa por correo).
- [ ] Antes de implementar, hay un documento de alcance aprobado por el cliente.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- `services/notifications/smsnot.py`: singleton solo MessageBird con `reference: 'Foobar'` fijo.
- `nasbu_core/settings.py`: hay una API key por defecto en el código; moverla a variable de entorno sin valor por defecto y rotarla.
- Agregar `SMS_ENABLED` / `SMS_PROVIDER` (setting o `ConfigParam`), una interfaz de proveedor y `sms_service.send()` que no envía si está deshabilitado. Pasar por ahí los 3 usos actuales (`accounting/models.py`, `catalog/models.py`, `practice/models.py`). `Feature.SMS_NOTIFICATIONS` existe pero no se usa.

### Frontend (`nasbu-webapps`)

- Ocultar la opción `send_by = sms` en los diálogos de firma, intake y solicitud de pago cuando el SMS esté deshabilitado.

### Pruebas

- BE: con SMS deshabilitado no se llama al proveedor (mock).

### Riesgos y dependencias

La API key en el código es un hallazgo de seguridad: rotarla aunque no se implemente el resto.

## Preguntas abiertas

- ¿Qué proveedor se usa y quién administra la cuenta?
- Si se deshabilita el SMS, ¿por qué canal va el código de confirmación?

## Definición de terminado

- [ ] Documento de análisis entregado y revisado.
- [ ] Si se aprueba el desarrollo, se actualiza este archivo con criterios implementables.
