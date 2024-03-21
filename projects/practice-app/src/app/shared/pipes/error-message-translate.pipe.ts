import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';


@Pipe({
    name: 'errorMessageTranslate',
    pure: false
})
export class ErrorMessageTranslatePipe
    extends TranslatePipe
    implements PipeTransform {
    constructor(
        private translateService: TranslateService,
        private changeDetectionRef: ChangeDetectorRef
    ) {
        super(translateService, changeDetectionRef);
    }

    override transform(key: string): string {
        const completeKey = 'errorMessages.' + key;
        const unexpetedErrorKey = 'errorMessages.unexpectedError';
        let value = super.transform(completeKey);
        if (completeKey === value) {
            value = super.transform(unexpetedErrorKey);
        };
        return value;
    }
}