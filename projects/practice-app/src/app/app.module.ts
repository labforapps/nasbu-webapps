import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PagesModule } from './pages/pages.module';

import { FilePickerModule } from 'ngx-awesome-uploader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AvatarModule } from 'ngx-avatar';
import { CoreServicesModule } from 'core-services';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
import { registerLocaleData } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';

// importar locales
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import { ComponentsModule } from './components/components.module';


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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
