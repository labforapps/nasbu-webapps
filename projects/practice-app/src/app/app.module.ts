import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PagesModule } from './pages/pages.module';

import { FilePickerModule } from 'ngx-awesome-uploader';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AvatarModule } from 'ngx-avatar';
import { CoreServicesModule } from 'core-services';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
import { registerLocaleData } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

// importar locales
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import { ComponentsModule } from './components/components.module';
import { AngularImageViewerModule } from "@hreimer/angular-image-viewer";
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerInterceptor } from './shared/interceptors/spinner.interceptor';


export const createTranslateLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};
registerLocaleData(localeEs, 'es');
registerLocaleData(localeEn, 'en');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FilePickerModule,
    HttpClientModule,
    AvatarModule,
    FormsModule,
    ReactiveFormsModule,
    CoreServicesModule.forRoot(environment),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    SharedModule,
    NgxPermissionsModule.forRoot(),
    ToastrModule.forRoot(), // ToastrModule added
    TextMaskModule,
    PagesModule,
    ComponentsModule,
    NgxDocViewerModule,
    AngularImageViewerModule,
    NgxSpinnerModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
