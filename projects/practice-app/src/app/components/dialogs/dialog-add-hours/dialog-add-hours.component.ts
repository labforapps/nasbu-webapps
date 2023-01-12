import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskHour } from 'core-models';
import { countUpTimerConfigModel, timerTexts, CountupTimerService } from 'ngx-timer';    

@Component({
  selector: 'app-dialog-add-hours',
  templateUrl: './dialog-add-hours.component.html',
  styleUrls: ['./dialog-add-hours.component.scss']
})
export class DialogAddHoursComponent implements OnInit, OnDestroy {

  form!:FormGroup;
  timerConfig!: countUpTimerConfigModel;
  timerData: any;
  constructor(private countUp:CountupTimerService,
             @Inject(MAT_DIALOG_DATA) public data:TaskHour) { }

  ngOnInit(): void {
    this.configTimer();
    this.setForm()
  }

  ngOnDestroy(): void {
    if(this.isTimerStart){
      this.countUp.pauseTimer();
    }
  }

  setForm(){
    this.form = new FormGroup({
      expedientId: new FormControl(this.data?.expedientId ?? "", [Validators.required]),
      userId: new FormControl(this.data?.userId ?? "", [Validators.required]),
      pricePerHour: new FormControl(this.data?.pricePerHour ?? "", [Validators.required]),
      quotedHours: new FormControl(this.data?.quotedHours ?? "", [Validators.required]),
      isBillable: new FormControl(this.data?.isBillable ?? false, [Validators.required]),
      description: new FormControl(this.data?.description ?? "", [Validators.required]),
      state: new FormControl(this.data?.state ?? "", [Validators.required]),
    });
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
      this.countUp.startTimer();
    }
    else{
      this.countUp.pauseTimer();
    }

  }

  resetTimer(){
    this.countUp.stopTimer();
  }

  saveTimer(){
    this.countUp.getTimerValue().subscribe({
      next: (value) => {
        console.log("val", value);
        localStorage.setItem("add_hours_timer", JSON.stringify({value, date: new Date()}));
      }
    })
  }

  get isTimerStart(){
    return this.countUp.isTimerStart;
  }

  //Save= true, Edit = false
  get saveOrEdit(){
    return this.data != null;
  }
}
