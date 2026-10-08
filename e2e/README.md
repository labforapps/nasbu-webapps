# Pruebas E2E de Nasbu (Playwright)

Pruebas de punta a punta de `practice-app` contra QA (`dev.nasbulegal.com`). El inventario de casos,
su prioridad y su estado está en [INVENTARIO.md](INVENTARIO.md): cada caso tiene una prueba con el
mismo ID (`CLI-04`, `BLQ-07`…).

Es un paquete aparte del monorepo de Angular: tiene su propio `package.json` y no depende del build.

## Correr las pruebas

```sh
cd e2e
npm ci
npx playwright install chromium
cp .env.example .env   # completar las credenciales de las cuentas de prueba
npm test               # todo
npm run test:smoke     # solo @smoke (8 casos, lo que corre en cada PR)
npx playwright test --grep NAS-021   # lo ligado a un ítem del backlog
npx playwright test --grep CLI-      # un módulo
npm run report         # abre el último reporte HTML
```

Un rol sin credenciales no hace fallar el suite: sus pruebas quedan omitidas con el motivo.

## Cómo está armado

| Carpeta | Qué tiene |
| --- | --- |
| `tests/auth.setup.ts` | Inicia sesión una vez por rol y guarda la sesión en `.auth/<rol>.json`. |
| `tests/<módulo>/` | Las pruebas, una por caso del inventario. |
| `support/fixtures.ts` | `test` con `role` (sesión a usar), `api` (datos por API), `cleanup` y `uid`. |
| `support/api.ts` | Cliente de `nasbu-core` autenticado con Cognito, igual que el front. |
| `support/data.ts` | Clientes y expedientes de prueba creados por API, con su limpieza. |
| `support/pages/` | Page objects por pantalla. |
| `support/i18n.ts` | Textos tomados de `assets/i18n/es.json` por clave. |

Reglas:

- Cada prueba crea sus datos y los borra al terminar (`cleanup`), con un sufijo único (`uid`). Ninguna depende de otra.
- Para cambiar de rol: `asRole('colabEscritura')` en el archivo o en un `describe`.
- Selectores: `formcontrolname` para controles de formularios y claves de traducción para textos. Si algo no se puede ubicar así, agregar un `data-testid` en el front.
- Un caso que espera una rama sin mezclar o un ítem sin implementar va como `test.fixme` con el motivo. Al mezclar, se quita el `fixme`.
- Nunca correr contra producción.

## CI

`.github/workflows/e2e.yml` corre el smoke en cada PR a `develop` y `master`, el suite completo de
lunes a viernes a las 5:00 (hora de Santo Domingo), y a demanda con un filtro. Las credenciales van
como secretos del repositorio con los mismos nombres que en `.env.example`. El reporte queda como
artefacto `playwright-report`.

## Correr contra mocks locales

`E2E_MOCK=<ruta>` carga un módulo con `install(context)` antes de cada prueba, y `E2E_API_TOKEN`
permite preparar datos sin Cognito. Sirve para depurar selectores contra una build local con un
backend simulado.
