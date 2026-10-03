# NAS-073 · [BUG] El upgrade de Starter a Ultimate no habilita la firma de documentos

| Campo | Valor |
| --- | --- |
| Tipo | Defecto |
| Prioridad | P1 |
| Fase | F1 · Seguridad, permisos y planes |
| Estado para Claude Code | Listo para desarrollo |
| Repos | backend + frontend |
| Lista en Trello | Prioridades lanzamiento |
| Tarjeta(s) Trello | [WhLTixCh](https://trello.com/c/WhLTixCh) |
| Relacionado con | NAS-092, NAS-061, NAS-093 |

## Contexto

La cuenta de prueba mirelesmateo@mailinator.com cambió de plan Starter a Ultimate para probar la firma electrónica. Se creó una plantilla de tipo "Contrato para firma", pero los documentos de ese tipo no se pueden enviar a firmar: el cambio de plan no surtió efecto.

## Pasos para reproducir

1. Iniciar sesión con una cuenta en plan Starter.
2. Cambiar el plan a Ultimate desde Suscripción y completar el flujo.
3. Crear o abrir una plantilla de tipo "Contrato para firma" y generar un documento.
4. Intentar enviar el documento a firmar.

## Comportamiento actual

La opción de firma no queda habilitada para la cuenta tras el upgrade.

## Comportamiento esperado

Al confirmarse el upgrade, la cuenta tiene de inmediato los features de Ultimate, incluida la firma electrónica.

## Criterios de aceptación

- [ ] Dado una cuenta Starter, cuando completa el upgrade a Ultimate, entonces puede enviar a firmar documentos de tipo "Contrato para firma" sin cerrar sesión.
- [ ] Los límites de firma del plan Ultimate se aplican desde el upgrade (ver NAS-093: 10 firmas al mes por usuario).
- [ ] La vista de Suscripción muestra Ultimate como plan activo.
- [ ] Existe una prueba automatizada que cubre upgrade → feature habilitado.

## Plan de implementación

Análisis sobre `master` del 2026-10-03 (backend `dee6dd1`, frontend `af8e50f`). Trabajar en la rama `features/cierre-sprint-nasbu`. Las rutas del front son relativas a `projects/practice-app/src/app` (las de `assets/` a `projects/practice-app/src`) salvo que empiecen por `projects/`. Verificar números de línea antes de editar: se citan funciones, no líneas.

### Backend (`nasbu-core`)

- Corregir H1 en `subscription/models.py` (`__upgrade_or_downgrade_plan__`): mover `SubscriptionMember.member_group` y `SubscriptionUser.group` del `security_group` del plan anterior al del plan nuevo. Solo los miembros en el grupo por defecto del plan; los grupos personalizados (`SubscriptionPermissionsGroup`) no se tocan.
- Corregir H3: pasar `total_users` a `SubscriptionFeature.create_subscription_features` para conservar el límite de usuarios.
- Migración de datos (o comando de gestión) para reparar las suscripciones que ya cambiaron de plan.

### Frontend (`nasbu-webapps`)

- `pages/configuration/plans/plans.component.ts`: tras un cambio de plan exitoso, recargar permisos (`fetchUserInfo()` / `PermissionsResolver`) además de `getSubscriptionInformation()`.

### Pruebas

- BE `subscription/tests.py`: tras upgrade, el dueño tiene `add_documentsignaturerequest` y conserva el valor de USERS.
- FE `plans.component.spec.ts`: se recargan los permisos tras el cambio.

### Riesgos y dependencias

Confirmar que `Plan.security_group` (nullable) está cargado en todos los planes de cada ambiente. Hacer junto con NAS-092.

## Definición de terminado

- [ ] Todos los criterios de aceptación se cumplen.
- [ ] Pruebas nuevas pasan, junto con las existentes del módulo.
- [ ] Commit en `features/cierre-sprint-nasbu` que empieza con `NAS-073:`.
- [ ] Entrada en `docs/memory.md` del repo tocado (formato de ese repo).
- [ ] Sección `## Resultado` agregada al final de este archivo.
