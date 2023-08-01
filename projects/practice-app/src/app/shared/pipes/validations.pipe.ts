import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'validations',
    pure: false
})

export class ValidationsPipe implements PipeTransform {
    validations: { [key: string]: string } = {}
    constructor(translate:TranslateService) {
        translate.get("formValidations").subscribe((res) => {
            this.validations = res;
        })
    }

    transform(value: AbstractControl | null, ...args: any[]): string {
        if(!value || !value.touched || value.valid || !value.errors) return "";

        const error = Object.keys(value.errors)[0];

        const message = this.validations[error];
        const field = args[0] ?? "";
        const params = args.slice(1);

        params[0] = this.getParams(error, value.errors[error]) ?? params[0]

        return message.replace("$0", field)
                      .replace("$1", params[0])
                      .replace("$2", params[1]);
    }

    getParams(errorName:string, error:ValidationErrors){
        switch(errorName){
            case "minlength":
            case "maxlength":
                return error['requiredLength'];

            case "min":
                return error['min'];

            case "max":
                return error['max'];

            default:
                return null;
        }
    }
}
