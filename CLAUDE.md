# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Memoria del proyecto

**Antes de cambiar código, leé [docs/memory.md](docs/memory.md).** Es la bitácora de features, mejoras y bugs ya resueltos: qué se cambió, por qué se resolvió así y qué archivos toca cada cosa. Evita volver a romper algo ya arreglado o re-descubrir una causa raíz que ya está documentada.

**Después de implementar un feature, una mejora o resolver un bug, y una vez verificado el cambio, agregá una entrada al principio de ese archivo** (van de más nueva a más vieja), con el formato documentado ahí: fecha, tipo, qué, por qué y archivos tocados. Lo importante de cada entrada es el **por qué** — la causa raíz o la restricción externa que condicionó la solución, que es justamente lo que no se deduce leyendo el código.

## Commands

**Serve practice-app (primary app):**
```sh
npm start
# Builds core-models → core-services → serves practice-app at http://localhost:4200
```

**Build individual libraries (watch mode during development):**
```sh
npm run build:models    # core-models with --watch
npm run build:services  # core-services with --watch
```

**Build for deployment:**
```sh
npm run build-qa    # QA/dev build
npm run build-prod  # Production build
```

**Run tests (for a specific project):**
```sh
ng test --project=practice-app
ng test --project=core-models
ng test --project=core-services
```

**Deploy:**
```sh
sudo chmod -R 755 deployment
./deployment/deploy_dev.sh    # → S3: dev.nasbulegal.com (CloudFront: E3MHELUD8EBU5U)
./deployment/deploy_prod.sh   # → S3: app.nasbulegal.com (CloudFront: EEOGDQA1MDQD5)
# Requires AWS CLI profile named "nasbu"
```

## Architecture

This is an **Angular 13 CLI monorepo** (`angular.json` at root) with four projects:

| Project | Type | Purpose |
|---|---|---|
| `core-models` | Library | Shared TypeScript interfaces/models |
| `core-services` | Library | Shared services, auth, HTTP interceptors |
| `practice-app` | Application | Main user-facing app (primary focus) |
| `lawyers-app` | Application | Lawyers-facing app |

`core-models` and `core-services` must be built before `practice-app` because `practice-app` imports them as path-mapped libraries (not npm packages). Changes to a library require a rebuild for `practice-app` to pick them up.

### core-models

All models are in `projects/core-models/src/lib/models/` organized by domain: `core`, `subscription`, `security`, `common`, `catalog`, `shared`, `practice`, `accounting`, `reports`. Everything is re-exported through `index.ts`. Import as `import { SomeModel } from 'core-models'`.

### core-services

`CoreServicesModule.forRoot(environment)` bootstraps AWS Amplify with the Cognito config from the environment file and registers:
- `AuthInterceptor` — attaches JWT tokens from Cognito to outgoing HTTP requests
- `AuthService` (core) — wraps AWS Amplify Auth directly
- `CoreService` — platform API calls (features, plans, document template types)
- `SubscriptionService`

All services are re-exported from `index.ts`. Import as `import { AuthService } from 'core-services'`.

### practice-app structure

**Auth flow:** `practice-app` has its own `AuthService` (`src/app/services/auth/auth.service.ts`) that wraps the `core-services` `AuthService` and adds `NgxPermissionsService` integration. Permissions are loaded on every navigation via `PermissionsResolver` (resolves on the root layout route), which calls `fetchUserInfo()` and stores permissions to localStorage. `UserResolver` loads current Cognito user info for the dashboard route.

**Routing:** Hash-based (`useHash: true`). Public routes (`/signin`, `/signup`, `/recovery`, `/account-confirmation`, etc.) are top-level. All authenticated pages are children of `LayoutComponent` at path `''`. Route guards use `NgxPermissionsGuard` with permission strings like `add_customer`, `view_customer`, etc.

**Interceptors:** Two HTTP interceptors are registered:
1. `AuthInterceptor` (from `core-services`) — attaches Bearer token
2. `SpinnerInterceptor` (practice-app) — shows/hides `NgxSpinner` on all requests except `/practice/case_files_notes/`

**Module organization inside practice-app:**
- `PagesModule` — all page components
- `ComponentsModule` — shared layout and dialog components (`LayoutComponent`, dialogs, document viewer, upload)
- `SharedModule` — pipes (`ErrorMessageTranslate`, `ValidationsPipe`, `FilterPipe`, `LocalizedDate`, `CustomerFullName`, `BillingType`, `Capitalize`, `TimeAgo`), directives (`Autofocus`, `AlphaNumeric`), and `NgxIntlTelInputModule`
- `MaterialModule` — re-exports Angular Material modules

**API:** Backend URL is set per environment (`environment.serverUrl`). Dev points to `http://apidev.nasbulegal.com/api`. Services in `core-services` and `practice-app/src/app/services/` call REST endpoints organized by domain matching the model domains.

**i18n:** `@ngx-translate` with JSON files at `src/assets/i18n/es.json` and `en.json`. Spanish (`es`) is the active language. Translation keys are used throughout templates.

**Permissions system:** `ngx-permissions` is used for RBAC. Permissions are string literals (e.g. `add_customer`, `view_customer`) stored in localStorage after Cognito auth and loaded by `PermissionsResolver` on route navigation.
