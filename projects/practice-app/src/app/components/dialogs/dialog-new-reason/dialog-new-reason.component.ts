import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';
import { TaskTypeEnum,TaskType } from 'core-models';

@Component({
  selector: 'app-dialog-new-reason',
  templateUrl: './dialog-new-reason.component.html',
  styleUrls: ['./dialog-new-reason.component.scss']
})
export class DialogNewReasonComponent implements OnInit {

  reason!:string;
  typeTask = TaskTypeEnum;

  constructor(public dialogRef: MatDialogRef<DialogNewReasonComponent>,
             private commonService:CommonService,
             private helperService:HelpersService ) { }

  ngOnInit(): void {
  }

  submitForm(){

    if(!this.reason){
      this.helperService.showMessageRequiredFields();
      return;
    }

    const taskTypePayload:TaskType = {
      name: this.reason,
      type: this.typeTask.OTHER
    }

    this.commonService.createTaskType(taskTypePayload).subscribe((data:TaskType) => {
      this.helperService.showMessageCreated();
      this.dialogRef.close(data);
    })

  }

}
