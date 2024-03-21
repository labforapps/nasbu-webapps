import { Component, OnInit } from '@angular/core';
import { CurrentUserInfo } from 'core-models';
import { BehaviorSubject, Observable } from 'rxjs';
import { AllowedLangs } from '../../../common';
import { AuthService } from '../../../services/auth/auth.service';
import { LangService } from '../../../services/lang.service';
import { Router } from '@angular/router';
import { TaskTimeService } from '../../../services/application/task-time.service';
import { CurrentTaskTimeInfo } from '../../../models/task';
import { countUpTimerConfigModel, CountupTimerService, timerTexts } from 'ngx-timer';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewTaskComponent } from '../../dialogs/dialog-new-task/dialog-new-task.component';
import { DialogAddHoursComponent } from '../../dialogs/dialog-add-hours/dialog-add-hours.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  timerConfig!: countUpTimerConfigModel;
  timerData: any;

  currentTaskTimeInfo!: CurrentTaskTimeInfo | null;

  public allowLangs = AllowedLangs;
  public currentLang: string = 'languages.';
  public user$!: Observable<CurrentUserInfo>;
  public currentFlag!: string;

  public langFlags: any =  {
    [AllowedLangs.English]: '../../../../assets/images/english-flag.jpg',
    [AllowedLangs.Spanish]: '../../../../assets/images/spanish-flag.jpg'
  };

  constructor(private countUp: CountupTimerService,
              private langService: LangService,
              private authService: AuthService,
              private taskTimeService: TaskTimeService,
              private router:Router,
              public  dialog: MatDialog,) { }

  ngOnInit(): void {
    this.loadUser();
    this.currentLang += this.langService.currentLang;
    this.currentFlag = this.langFlags[this.langService.currentLang];
    this.configTimer();
    this.currentTaskTimeInfo = this.taskTimeService.getCurrentTaskTimeInfo();
    if (this.currentTaskTimeInfo) {
        this.initTimer();
    }

    //this.countUp.intervalSubscription.subscribe((a: any) => console.log(a));
  }

  get isTimerStart(){
    return this.countUp.isTimerStart;
  }

  listenToClockChanges() {
      this.taskTimeService
          .currentTaskTime$
          .subscribe((currentTaskTimeInfo: CurrentTaskTimeInfo | null) => {
                this.currentTaskTimeInfo = currentTaskTimeInfo;
                this.initTimer();
          });
  }

  startOrPauseTimer() {
      if (this.countUp.isTimerStart) {
          this.countUp.pauseTimer();
          this.dialog.open(DialogAddHoursComponent);
      } else {
          const currentTaskTimeInfo: CurrentTaskTimeInfo = {
              startAt: moment(new Date()).toDate(),
              expiredAt: moment(new Date()).add(1, 'd').toDate()
          };
          this.taskTimeService.storeCurrentTaskTimeInfo(currentTaskTimeInfo);
          this.countUp.startTimer();
      }
  }

  initTimer() {
      this.configTimer();
      if (this.currentTaskTimeInfo) {
          this.countUp.startTimer(this.currentTaskTimeInfo.startAt);
      } else {
          this.countUp.startTimer();
      }
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

  changeLanguaje(lang: AllowedLangs): void {
    this.langService.changeLang(lang);
    this.currentLang = `languages.${lang}`;
    this.currentFlag = this.langFlags[lang]
  }

  loadUser(): void {
    this.user$ = this.authService.getCurrentUserInfo();
  }

  logout(){
    this.authService.signOut();
    this.router.navigate(['signin']);
  }

}
