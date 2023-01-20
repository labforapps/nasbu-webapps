import { Component, OnInit } from '@angular/core';
import { CurrentUserInfo } from 'core-models';
import { BehaviorSubject, Observable } from 'rxjs';
import { AllowedLangs } from '../../../common';
import { AuthService } from '../../../services/auth/auth.service';
import { LangService } from '../../../services/lang.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public allowLangs = AllowedLangs;
  public currentLang: string = 'languages.';
  public user$!: Observable<CurrentUserInfo>;
  public currentFlag!: string;
  public langFlags: any =  {
    [AllowedLangs.English]: '../../../../assets/images/english-flag.jpg',
    [AllowedLangs.Spanish]: '../../../../assets/images/spanish-flag.jpg'
  };
  constructor(private langService: LangService, private authService: AuthService) { }

  ngOnInit(): void {
    this,this.loadUser();
    this.currentLang += this.langService.currentLang;
    this.currentFlag = this.langFlags[this.langService.currentLang]
  }

  changeLanguaje(lang: AllowedLangs): void {
    this.langService.changeLang(lang);
    this.currentLang = `languages.${lang}`;
    this.currentFlag = this.langFlags[lang]
  }

  loadUser(): void {
    this.user$ = this.authService.getCurrentUserInfo();
  }

}
