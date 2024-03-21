import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CurrentUserInfo } from 'core-models';
import { Observable} from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({providedIn: 'root'})
export class UserResolver implements Resolve<CurrentUserInfo>{
  constructor(private authService: AuthService){}
  resolve(route: ActivatedRouteSnapshot): Observable<CurrentUserInfo> {
    return this.authService.getCurrentUserInfo();
  }
}