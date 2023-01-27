import { NgModule } from "@angular/core";
import { ErrorMessageTranslatePipe } from "./pipes/error-message-translate.pipe";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from "./components/spinner.component";
import { ValidationsPipe } from "./pipes/validations.pipe";
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
    declarations: [ErrorMessageTranslatePipe, SpinnerComponent, ValidationsPipe, FilterPipe],
    imports: [MatProgressSpinnerModule],
    exports: [ErrorMessageTranslatePipe, SpinnerComponent, ValidationsPipe,FilterPipe],
})
export class SharedModule { }
