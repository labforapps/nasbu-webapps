import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-spinner',
    template: `<mat-spinner [diameter]="diameter" class="mat-spinner-color" ></mat-spinner>`,
    styleUrls: ['./snipper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
    @Input() diameter: number = 50;
}