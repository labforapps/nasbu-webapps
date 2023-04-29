import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Schedule, Subscription, WeekDaysDescription } from 'core-models';
import { FormService } from 'projects/practice-app/src/app/services/form.service';

@Component({
  selector: 'app-profile-schedule',
  templateUrl: './profile-schedule.component.html',
  styleUrls: ['./profile-schedule.component.scss']
})
export class ProfileScheduleComponent implements OnInit {

  @Input() subscription!:Subscription;
  @Output() subscriptionSchedule:any = new EventEmitter<Schedule[]>();
  scheduleForm!:FormGroup;

  constructor(private _formBuilder:FormBuilder,
              private formService:FormService) { }

  ngOnInit(): void {
    this.initForm();
    this.setDataFormArray();
    console.log(this.subscription);
  }

  initForm()
  {
    this.scheduleForm = this._formBuilder.group({
      schedules: this._formBuilder.array([
        this._formBuilder.group({
          week_day:    [''],
          is_closed:   [false],
          start_time:  ['00:00'],
          end_time:    ['00:00']
        })
      ])
    });

    const myArrayForm = this.scheduleForm.get('schedules') as FormArray;
    myArrayForm?.valueChanges.subscribe((newValues) => {
      this.subscriptionSchedule.emit(newValues);
      // do something else here, such as update a variable or call a function
    });
  }

  returnWeekDayDesc(weekDay: number) {
    return WeekDaysDescription.get(weekDay);
  }

  setScheduleFieldToggle(event:any,index:any)
  {
    (this.scheduleForm.get('schedules') as FormArray)?.at(index).patchValue({
      is_closed: !event.checked,
    });
  }

  returnFormArray(formArray: string) {
    return this.formService.returnFormArrayControls(this.scheduleForm,formArray);
  }

  setDataFormArray()
  {
    if(this.subscription.schedules.length === 0){
      this.formService.removeItemFormArray(this.scheduleForm,'schedules',0);
      const weekDaysArray = [1,2,3,4,5,6,7];

      for(let i = 0; i < weekDaysArray.length; i++){
        this.subscription.schedules.push({
          week_day:    weekDaysArray[i],
          is_closed:   true,
          start_time:  '00:00',
          end_time:    '00:00',
        })
      }
    }

    const weekdays = [2, 3, 4, 5, 6, 7, 1];

    this.subscription.schedules.sort((a, b) => {
      const aIndex = weekdays.indexOf(a.week_day);
      const bIndex = weekdays.indexOf(b.week_day);
      return aIndex - bIndex;
    });

    this.formService.setDataFormArray(this.scheduleForm,'schedules',this.subscription.schedules);
    this.subscriptionSchedule.emit(this.subscription.schedules);
  }

}
