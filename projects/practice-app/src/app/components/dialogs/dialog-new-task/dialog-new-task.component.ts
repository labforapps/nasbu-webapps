import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tasks, TaskPeriodicity } from 'core-models';

@Component({
  selector: 'app-dialog-new-task',
  templateUrl: './dialog-new-task.component.html',
  styleUrls: ['./dialog-new-task.component.scss']
})
export class DialogNewTaskComponent implements OnInit {
  taskForm!:FormGroup;
  showDate:boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {task:Tasks, action: string}) {
    this.setForm();
  }

  ngOnInit(): void {}

  setForm(){
    this.taskForm = new FormGroup({
      type: new FormControl(this.data?.task?.type, [Validators.required]),
      periodicity: new FormControl(this.data?.task?.periodicity ?? '', [Validators.required]),
      personName: new FormControl(this.data?.task?.personName, [Validators.required]),
      description: new FormControl(this.data?.task?.description, [Validators.required]),
      collaboratorId: new FormControl(this.data?.task?.collaboratorId, [Validators.required]),
      expedientId: new FormControl(this.data?.task?.expedientId, [Validators.required]),
      endDate: new FormControl(this.data?.task?.endDate),
      startDate: new FormControl(this.data?.task?.startDate),
      pricePerHour: new FormControl(this.data?.task?.pricePerHour, [Validators.required]),
      quotedHours: new FormControl(this.data?.task?.quotedHours, [Validators.required]),
    })

    if(this.data?.action == "view"){
      this.taskForm.disable();
    }
  }

  get taskPeriodicity(){
    return TaskPeriodicity;
  }

  dateRadioChange(event: any){
    this.showDate = event.value;
  }
}
