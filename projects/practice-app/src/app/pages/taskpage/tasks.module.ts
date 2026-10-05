import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../material/material.module';
import { TaskFilterComponent } from './components/task-filter/task-filter.component';
import { TaskTableComponent } from './components/task-table/task-table.component';
import { TaskpageComponent } from './taskpage.component';
import { DialogAddHoursComponent } from '../../components/dialogs/dialog-add-hours/dialog-add-hours.component';
import { NgxTimerModule } from 'ngx-timer';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        TranslateModule.forChild(),
        NgxTimerModule,
        MatIconModule,
        SharedModule,
        // Sin este import *ngxPermissionsOnly no se resuelve y el elemento no se muestra a nadie.
        NgxPermissionsModule
    ],
    exports: [
        TaskpageComponent,
        TaskTableComponent,
        TaskFilterComponent,
        DialogAddHoursComponent,
    ],
    declarations: [
        TaskpageComponent,
        TaskTableComponent,
        TaskFilterComponent,
        DialogAddHoursComponent,
    ],
    providers: [],
})
export class TasksModule { }
