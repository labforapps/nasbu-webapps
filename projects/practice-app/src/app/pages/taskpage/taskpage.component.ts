import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {TaskType,Task, TaskTypeEnum, TaskTypeiIconClassMap, TaskStatus } from 'core-models';
import { DialogNewReasonComponent } from '../../components/dialogs/dialog-new-reason/dialog-new-reason.component';
import { DialogNewTaskComponent } from '../../components/dialogs/dialog-new-task/dialog-new-task.component';
import { AuthService, CommonService, PracticeService } from 'core-services';
import * as moment from 'moment';
@Component({
  selector: 'app-taskpage',
  templateUrl: './taskpage.component.html',
  styleUrls: ['./taskpage.component.scss']
})
export class TaskpageComponent implements OnInit {

  currentTab: number = 0;
  allTasks !:Task[];
  pendingTasks!:Task[];
  completedTasks!:Task[];
  overdueTasks!:Task[];
  selectedSubscription!:any;
  public tasksTypes!:TaskType[];
  taskTypeEnum = TaskTypeEnum;
  taskStatus = TaskStatus

  constructor(public dialog: MatDialog,
             private practiceService:PracticeService,
             private authService: AuthService,
             private commonService:CommonService) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getTasks();
    this.getTasksType();
  }

  getTasks() {
    const currentDate = moment();

    this.practiceService.getTasks(this.selectedSubscription?.ssid.uuid).subscribe((data:Task[]) => {
      this.allTasks = data;
      this.pendingTasks = this.allTasks.filter(x => x.status === this.taskStatus.OPEN && x.overdue === false);
      this.completedTasks = this.allTasks.filter(x => x.status === this.taskStatus.CLOSED);
      this.overdueTasks = this.allTasks.filter(x => x.overdue === true).sort((a, b) => {
          let dateA = new Date(a.end_date || '').getTime();
          let dateB = new Date(b.end_date || '').getTime();
          return dateB - dateA;
      });
    })
  }

  getTasksType(){
    this.commonService.getTaskTypes().subscribe(data => {
      this.tasksTypes = data;
    })
  }

  openDialog(taskType:TaskType){

    if(taskType.type === this.taskTypeEnum.OTHER && taskType.name === 'Otros'){
      this.openDialogNewReason();
    }
    else{
      this.openDialogNewTask(taskType);
    }

  }

  openDialogNewTask(taskType:TaskType){
    const dialogRef = this.dialog.open(DialogNewTaskComponent,{
      data: {
        taskType: taskType
      }
    });

    dialogRef.afterClosed().subscribe((result:Task) => {

      if(result.uuid) {
        this.getTasks();
        this.currentTab = 0;
      }
    });
  }

  openDialogNewReason(){
    const dialogRef = this.dialog.open(DialogNewReasonComponent);

    dialogRef.afterClosed().subscribe((data:TaskType) => {
      if(data.uuid){
        this.tasksTypes.push(data);
      }
    })
  }

  returnTaskTypeIcon(taskType:TaskType){
    return TaskTypeiIconClassMap.get(taskType.type) || '';
  }

  onTabChange(event: number) {
    this.currentTab = event;
  }

  onExecuteTaskEvent(){
    this.getTasks();
  }



}
