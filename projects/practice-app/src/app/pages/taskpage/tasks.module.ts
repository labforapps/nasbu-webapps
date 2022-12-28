import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { TaskTableComponent } from './task-table/task-table.component';
import { TaskpageComponent } from './taskpage.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    exports: [
        TaskpageComponent,
        TaskTableComponent
    ],
    declarations: [
        TaskpageComponent,
        TaskTableComponent
    ],
    providers: [],
})
export class TasksModule { }
