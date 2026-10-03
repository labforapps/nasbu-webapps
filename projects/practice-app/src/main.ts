import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular-ivy';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { Amplify, Auth } from 'aws-amplify';
Amplify.configure(environment.awsConfig);

if (environment.sentryDsn) {
  Sentry.init({
    dsn: environment.sentryDsn,
    environment: 'production',
    integrations: [
      new Sentry.Replay({ maskAllText: true, blockAllMedia: true }),
    ],
    // Session Replay: no grabar sesiones "sanas", sí grabar cuando ocurre un error
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0,
  });
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
