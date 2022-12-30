import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-empty-dashboard',
    templateUrl: 'empty-dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EmptyDashboardComponent {
    @Input() imageSrc!: string;
    @Input() title!: string;
    @Input() subTitle!: string;
}