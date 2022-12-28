import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from '../../app.module';
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
        TranslateModule.forChild()
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
