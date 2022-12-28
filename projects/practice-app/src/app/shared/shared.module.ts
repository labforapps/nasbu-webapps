import { NgModule } from "@angular/core";
import { ErrorMessageTranslatePipe } from "./pipes/error-message-translate.pipe";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from "./components/spinner.component";
import { ValidationsPipe } from "./pipes/validations.pipe";

@NgModule({
    declarations: [ErrorMessageTranslatePipe, SpinnerComponent, ValidationsPipe],
    imports: [MatProgressSpinnerModule],
    exports: [ErrorMessageTranslatePipe, SpinnerComponent, ValidationsPipe],
})
export class SharedModule { }