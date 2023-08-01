import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CurrentTaskTimeInfo } from '../../models/task';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TaskTimeService {

  private CURRENT_TASK_TIME_INFO: string = 'current_task_time';

  public currentTaskTime$: BehaviorSubject<CurrentTaskTimeInfo | null> =
        new BehaviorSubject<CurrentTaskTimeInfo | null>(null);

  constructor() { }

  storeCurrentTaskTimeInfo(payload: CurrentTaskTimeInfo){
      const payloadStr: string = JSON.stringify(payload);
      localStorage.setItem(this.CURRENT_TASK_TIME_INFO, payloadStr);
      this.currentTaskTime$.next(payload);
  }

  getCurrentTaskTimeInfo(): CurrentTaskTimeInfo | null {
      let currentTaskTimeInfo = localStorage.getItem(this.CURRENT_TASK_TIME_INFO);
      if (currentTaskTimeInfo) {

          let currentTaskTimeInfoObj: CurrentTaskTimeInfo | null = JSON.parse(currentTaskTimeInfo);
          const expiredAt = moment(currentTaskTimeInfoObj?.expiredAt);
          const currentDate = moment(new Date());

          if (currentDate.isAfter(expiredAt)) {
              this.removeCurrentTaskTimeInfo();
              currentTaskTimeInfoObj = null;
          }

          return currentTaskTimeInfoObj;
      }

      return null;
  }

  removeCurrentTaskTimeInfo(){
      localStorage.removeItem(this.CURRENT_TASK_TIME_INFO);
  }
}
