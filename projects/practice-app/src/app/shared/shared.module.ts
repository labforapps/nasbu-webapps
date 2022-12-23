import { NgModule } from "@angular/core";
import { ErrorMessageTranslatePipe } from "./pipes/error-message-translate.pipe";

@NgModule({
    declarations: [ErrorMessageTranslatePipe],
    exports: [ErrorMessageTranslatePipe],
})
export class SharedModule { }