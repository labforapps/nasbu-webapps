import { NgModule } from "@angular/core";
import { ErrorMessageTranslatePipe } from "./pipes/error-message-translate.pipe";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from "./components/spinner.component";
import { ValidationsPipe } from "./pipes/validations.pipe";
import { FilterPipe } from './pipes/filter.pipe';
import { LocalizedDatePipe } from "./pipes/Localized-date";
import { NgxIntlTelInputModule } from "./lib/phoneInput/ngx-intl-tel-input.module";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import { CustomerFullNamePipe } from './pipes/customer-full-name.pipe';

export const createTranslateLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};
registerLocaleData(localeEs, 'es');
registerLocaleData(localeEn, 'en');


@NgModule({
    declarations: [
      ErrorMessageTranslatePipe,
      SpinnerComponent,
      ValidationsPipe,
      FilterPipe,
      LocalizedDatePipe,
      CustomerFullNamePipe
    ],
    imports: [
      MatProgressSpinnerModule,
      NgxIntlTelInputModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      }),
    ],
    exports: [
      ErrorMessageTranslatePipe,
      SpinnerComponent,
      ValidationsPipe,
      FilterPipe,
      LocalizedDatePipe,
      NgxIntlTelInputModule,
      TranslateModule,
      CustomerFullNamePipe
    ],
})
export class SharedModule { }
