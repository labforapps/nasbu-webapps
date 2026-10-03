# NAS-061 · [BUG] Enviar a firmar con plan Starter devuelve error 403 en lugar de un mensaje de plan

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P2 |
| Fase | F1 · Seguridad, permisos y planes |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend + frontend |
| Lista en Trello | En curso |
| Tarjeta(s) Trello | [nazNk0XD](https://trello.com/c/nazNk0XD) |
| Relacionado con | NAS-031, NAS-073 |

## Contexto

Un usuario con plan Starter, que no incluye firma electrónica, intenta enviar un documento a firmar y recibe un error 403.

## Pasos para reproducir

1. Iniciar sesión con una cuenta Starter.
2. Intentar enviar un documento a firmar.

## Comportamiento actual

Aparece un error 403.

## Comportamiento esperado

Se muestra el toast "Tu plan actual no incluye la firma electrónica." y, si aplica, una opción para ver planes.

## Criterios de aceptación

- [ ] Con plan Starter, la acción de firma muestra el mensaje de plan y no el 403.
- [ ] Idealmente el botón de firma aparece deshabilitado o con indicador de plan antes de pulsarlo.
- [ ] Usa el mecanismo central de NAS-031.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- El 403 sale de `HasSubscriptionPermission` antes de llegar a `execute_features_validations` (`mixins/viewsets/viewsets.py`).
- En `DocumentSignatureRequestViewSet` (`practice/views.py`), validar primero la feature de plan `SIGNATURE_REQUESTS` y responder 403 con `code = plan_feature_missing` (formato de NAS-031).

### Frontend (`nasbu-webapps`)

- `components/dialogs/dialog-external-doc-signature/dialog-external-doc-signature.component.ts`: reemplazar el mensaje genérico por el del interceptor.
- `pages/documents-templates/documents/documents.component.html`: deshabilitar u ocultar "Enviar para firma" si la suscripción no tiene la feature (`GET subscription/features/signature_requests`).

### Pruebas

- BE `practice/tests.py`: POST a solicitudes de firma con plan sin feature → 403 con `code`.
- FE `dialog-external-doc-signature.component.spec.ts`.

### Riesgos y dependencias

Depende de NAS-031.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-061:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
