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
  constructor(private langService: LangService, private authService: AuthService) { }

  ngOnInit(): void {
    this,this.loadUser();
    this.currentLang += this.langService.currentLang;
  }

  changeLanguaje(lang: AllowedLangs): void {
    this.langService.changeLang(lang);
    this.currentLang = `languages.${lang}`;
  }

  loadUser(): void {
    this.user$ = this.authService.getCurrentUserInfo();
  }

}
