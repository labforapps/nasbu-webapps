import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TimeTask,Task, SecurityUser } from 'core-models';
import { AuthService, SecurityService,PracticeService } from 'core-services';
import { countUpTimerConfigModel, timerTexts, CountupTimerService } from 'ngx-timer';
import { HelpersService } from '../../../services/helpers.service';
import * as moment from 'moment'
import { CurrentTaskTimeInfo } from '../../../models/task';
import { TaskTimeService } from '../../../services/application/task-time.service';


@Component({
  selector: 'app-dialog-add-hours',
  templateUrl: './dialog-add-hours.component.html',
  styleUrls: ['./dialog-add-hours.component.scss']
})
export class DialogAddHoursComponent implements OnInit, OnDestroy {

  taskTimeForm!:FormGroup;
  timerConfig!: countUpTimerConfigModel;
  timerData: any;
  task!:Task | null;
  tasks!:Task[];
  selectedSubscription!:any;
  securityUsers!:SecurityUser[];
  securityUserSelected!:SecurityUser;
  taskTime!:TimeTask;
  startTime!:any;
  endTime!:any;

  currentTaskTimeInfo!: CurrentTaskTimeInfo | null;

  constructor(private countUp:CountupTimerService,
             @Inject(MAT_DIALOG_DATA) public dataDialog:{task:Task,taskTime:TimeTask},
             public  dialogRef: MatDialogRef<DialogAddHoursComponent>,
             private formBuilder:FormBuilder,
             private practiceService:PracticeService,
             private authService:AuthService,
             private securityService:SecurityService,
             private helperService:HelpersService,
             private taskTimeService: TaskTimeService) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    console.log(this.dataDialog);
    this.task = this.dataDialog  && this.dataDialog.task !== undefined ? this.dataDialog.task : null;
    this.configTimer();
    this.initForm();
    this.getTasks();
    this.getSecurityUsers();
    this.currentTaskTimeInfo = this.taskTimeService.getCurrentTaskTimeInfo();

    if(this.dataDialog && this.dataDialog.taskTime !== undefined) this.taskTime = this.dataDialog.taskTime;

    this.setForm();

  }

  ngOnDestroy(): void {
    if(this.isTimerStart){
      //this.countUp.pauseTimer();
    }
  }

  initForm(){
    this.taskTimeForm = this.formBuilder.group({
      description:    ['',Validators.required],
      task:           ['',Validators.required],
      executed_by:    ['',Validators.required],
      quoted_hours:   [0],
      price_per_hour: [''],
      not_billable:   [false,Validators.required],
    });
  }

  setForm(){
    if(this.taskTime){
      this.taskTimeForm.patchValue({
        ...this.taskTime,
        task: this.taskTime.task.uuid,
        quoted_hours: this.taskTime.fixed_time ? this.taskTime.total_time / 60 : 0,
      });
    }
  }

  getTasks(){
    this.practiceService.getTasks(this.selectedSubscription?.ssid.uuid).subscribe((data:Task[]) => {
      this.tasks = data;
     if(this.task) if(this.dataDialog && this.dataDialog.task) this.taskTimeForm.patchValue({task: this.task.uuid,price_per_hour: this.task.bt_price_per_hour})
    })
  }

  getSecurityUsers(){
    this.securityService.getSecurityUsers(this.selectedSubscription?.ssid.uuid).subscribe((data:SecurityUser[]) => {
      this.securityUsers = data;
    })
  }

  configTimer(){
    this.timerData = JSON.parse(localStorage.getItem("add_hours_timer") || '{}');
    this.timerConfig = new countUpTimerConfigModel();

    //custom class
    this.timerConfig.timerClass  = 'inline-timer';

    //timer text values
    this.timerConfig.timerTexts = new timerTexts();
    this.timerConfig.timerTexts.hourText = ':';
    this.timerConfig.timerTexts.minuteText = ":";
  }

  startTimer(){
    if(!this.countUp.isTimerStart){
      this.startTime = moment(new Date()).format();
      this.storeTaskTimeInfo();
      this.countUp.startTimer();
    }
    else{
      this.endTime = new Date();
      this.countUp.pauseTimer();
    }

  }

  resetTimer(){
    this.countUp.stopTimer();
    this.taskTimeService.removeCurrentTaskTimeInfo();
  }

  saveTimer(){
    this.countUp.getTimerValue().subscribe({
      next: (value) => {
        localStorage.setItem("add_hours_timer", JSON.stringify({value, date: new Date()}));
      }
    })
  }

  get isTimerStart(){
    return this.countUp.isTimerStart;
  }

  //Save= true, Edit = false
  get saveOrEdit(){
    return this.dataDialog != null;
  }

  setSecurityUserSelected(securityUser:SecurityUser){
    this.securityUserSelected = securityUser;
  }

  submitForm(){

    if(!this.taskTimeForm.valid){
      this.helperService.showMessageRequiredFields();
      return;
    }

    const taskTimeFormValue = this.taskTimeForm.value;

    let startDate = this.startTime;
    let endDate   = new Date().toISOString();
    let totalTime = moment(new Date()).diff(startDate,'minute');

    let currentTaskTimeInfo: CurrentTaskTimeInfo | null = this.taskTimeService.getCurrentTaskTimeInfo();

    if(currentTaskTimeInfo != null) startDate = currentTaskTimeInfo.startAt;

    let fixed_time = false;

    if(Number(taskTimeFormValue.quoted_hours) > 0){
      fixed_time = true;
      totalTime = Number(taskTimeFormValue.quoted_hours) * 60;
    }

    const timeTaskPayload: TimeTask = {
      subscription: this.selectedSubscription?.ssid.uuid,
      ...taskTimeFormValue,
      title: taskTimeFormValue.description,
      total_time_str: totalTime,//Enviar la hora del reloj
      total_time: totalTime,
      start_at: startDate,
      total_amt: 0,
      end_at: endDate,
      fixed_time
    };

    if(this.taskTime) timeTaskPayload.uuid = this.taskTime.uuid;


    console.log(timeTaskPayload);

    this.practiceService.saveTaskTime(timeTaskPayload).subscribe(data => {

      this.resetTimer();

      if(timeTaskPayload.uuid){
        this.helperService.showMessageUpdated();
      }
      else{
        this.helperService.showMessageCreated();
      }
      data.user = this.securityUserSelected;
      this.dialogRef.close(data);
    })

  }

  storeTaskTimeInfo() {
      const payload: CurrentTaskTimeInfo = {
          expiredAt: this.currentTaskTimeInfo?.expiredAt || moment(new Date()).add(1, 'd').toDate(),
          startAt: this.currentTaskTimeInfo?.startAt || this.startTime,
          description:    this.taskTimeForm.value.description,
          task:           this.taskTimeForm.value.task,
          executedBy:    this.taskTimeForm.value.executed_by,
          notBillable:   this.taskTimeForm.value.description,
      };
      //this.taskTimeService.storeCurrentTaskTimeInfo(payload);
  }

}
