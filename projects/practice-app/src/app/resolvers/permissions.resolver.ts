import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { UserInfo } from 'core-models';
import { map, Observable} from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

/**
 * This' in case the user is already logged in, then permissions will be updated in localStorage, 
 * on method fetchUserInfo, jus in case any group is edited.
 * @export
 * @class PermissionsResolver
 * @implements {Resolve<UserInfo>}
 */
@Injectable({providedIn: 'root'})
export class PermissionsResolver implements Resolve<string[]>{
  constructor(private authService: AuthService){}
  resolve(route: ActivatedRouteSnapshot): Observable<string[]> {
    return this.authService.fetchUserInfo().pipe(
      map((userInfo: UserInfo) => this.authService.getAllPermisions(userInfo))
    );
  }
}