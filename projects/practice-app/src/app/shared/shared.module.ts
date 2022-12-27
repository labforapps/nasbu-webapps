import { NgModule } from "@angular/core";
import { ErrorMessageTranslatePipe } from "./pipes/error-message-translate.pipe";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from "./components/spinner.component";

@NgModule({
    declarations: [ErrorMessageTranslatePipe, SpinnerComponent],
    imports: [MatProgressSpinnerModule],
    exports: [ErrorMessageTranslatePipe, SpinnerComponent],
})
export class SharedModule { }