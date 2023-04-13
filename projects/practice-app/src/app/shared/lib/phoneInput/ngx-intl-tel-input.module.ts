
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NativeElementInjectorDirective } from './directives/native-element-injector.directive';
import { NgxIntlTelInputComponent } from './ngx-intl-tel-input.component';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [NgxIntlTelInputComponent, NativeElementInjectorDirective],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [NgxIntlTelInputComponent, NativeElementInjectorDirective,MaterialModule],
})
export class NgxIntlTelInputModule {}
