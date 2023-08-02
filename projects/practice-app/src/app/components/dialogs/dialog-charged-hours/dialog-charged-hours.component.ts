import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAddHoursComponent } from '../dialog-add-hours/dialog-add-hours.component';
import { PracticeService } from 'core-services';
import { Task, TimeTask } from 'core-models';
import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-dialog-charged-hours',
  templateUrl: './dialog-charged-hours.component.html',
  styleUrls: ['./dialog-charged-hours.component.scss']
})
export class DialogChargedHoursComponent implements OnInit {

  task!:Task;
  tasksTime!:TimeTask[];

  constructor(public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data:Task,
              private practiceService:PracticeService,
              private helperService:HelpersService) {
  }

  ngOnInit(): void {
    this.task = this.data;
    this.getTaskTimeDetails();
    //this.getTaskTimeByTask();
  }

  getTaskTimeDetails(){
    this.practiceService.getTasksTime(this.task.subscription).subscribe((data:TimeTask[]) => {
      this.tasksTime = data.filter(x => x.task.uuid === this.task.uuid);
    })
  }

  getTaskTimeByTask(){
    this.practiceService.getTasksTimeByTask(this.task).subscribe((data:TimeTask[]) => {
      console.log(data);
    })
  }

  openDialogAddHours(taskTime?:TimeTask){

    const dialogRef = this.dialog.open(DialogAddHoursComponent, {
      data: {
        task: this.task,
        taskTime: taskTime
      }
    });

    dialogRef.afterClosed().subscribe((result:TimeTask) => {

      if(result && result.uuid){
        const caseFileFiltered = this.tasksTime.filter(x => x.uuid === result.uuid);
        if(caseFileFiltered){
          this.tasksTime = this.tasksTime.filter(x => x.uuid !== result.uuid);
          this.tasksTime.push(result);
        }
        else{
          this.tasksTime.push(result);
        }
      }
    });

  }

  deleteHour(taskTime:TimeTask){

    this.helperService.showConfirmationDeleteDialog().then(result => {
      if(result.isConfirmed){
        this.practiceService.deleteTaskTime(taskTime.subscription,taskTime.uuid || '').subscribe(data => {
          this.helperService.showMessageDeleted();
          this.tasksTime = this.tasksTime.filter(x => x.uuid !== taskTime.uuid);
        })
      }
    })

  }


  get totalHours(){
    return this.tasksTime ?  this.tasksTime.reduce((acc, curr) => acc + curr.total_time, 0) / 60 : 0;
  }

  get totalAmount(){
    return this.tasksTime ?  this.tasksTime.reduce((acc, curr) => acc +  Number(curr.total_amt), 0) : 0;
  }
}
