import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CoreServicesComponent } from './core-services.component';
import { SubscriptionService, CoreService, AuthService, AuthInterceptor } from './services';
import { Amplify, Auth } from 'aws-amplify';

@NgModule({
  declarations: [
    CoreServicesComponent
  ],
  imports: [
  ],
  exports: [
    CoreServicesComponent
  ]
})
export class CoreServicesModule {

  public static forRoot(config: any): ModuleWithProviders<CoreServicesModule> {

    Amplify.configure(config.awsconfig);
    Auth.configure(config.awsconfig)

    return {
        ngModule: CoreServicesModule,
        providers: [
          {provide: 'config', useValue: config},
          {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
          },
          AuthService,
          CoreService,
          SubscriptionService
        ]
    };
}
 }
