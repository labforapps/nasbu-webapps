import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  TaskStatus,Task } from 'core-models';
import { PracticeService } from 'core-services';
import { DialogCloseExpedientComponent } from '../dialog-close-expedient/dialog-close-expedient.component';
@Component({
  selector: 'app-dialog-close-task',
  templateUrl: './dialog-close-task.component.html',
  styleUrls: ['./dialog-close-task.component.scss']
})
export class DialogCloseTaskComponent implements OnInit {

  public pageStep: number = 1;
  task!:Task;
  taskStatus = TaskStatus

  constructor(private practiceService:PracticeService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogCloseExpedientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {task:Task}) { }

  ngOnInit(): void {
    this.task = this.data.task;
  }

  closeExpedient(){

    // this.practiceService.updateCaseFileChangeStatus(this.caseFile).subscribe(data => {
      this.pageStep = 2;
      this.task.status = this.taskStatus.CLOSED;
    // })
  }

  closeDialog(){

  }


}
