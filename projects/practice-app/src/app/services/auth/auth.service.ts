import { Injectable } from '@angular/core';
import { AuthService as CoreAuthService } from 'core-services';
import { map, Observable } from 'rxjs';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import { UserSignupPayload, ForgotPasswordSubmit, CurrentUserInfo, UserInfo } from 'core-models';
import { UserSubscription } from 'core-models';
import { NgxPermissionsService } from 'ngx-permissions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private coreAuth: CoreAuthService, private permissionsService: NgxPermissionsService) { }

  signIn(username: string, password: string): Observable<any> {
    return this.coreAuth.signin(username, password);
  }

  signUp(userSignupPayload: UserSignupPayload): Observable<ISignUpResult> {
    return this.coreAuth
      .signup(userSignupPayload);
  }

  forgotPassword(username: string): Observable<any> {
    return this.coreAuth.recoverPassword(username);
  }

  forgotPasswordSubmit(forgotPasswordSubmit: ForgotPasswordSubmit): Observable<any> {
    return this.coreAuth.recoverPasswordSubmit(forgotPasswordSubmit);
  }

  getCurrentUserInfo(): Observable<CurrentUserInfo> {
    return this.coreAuth.getCurrentUserInfo();
  }

  fetchUserInfo(): Observable<UserInfo> {
    return this.coreAuth.fetchUserInfo();
  }

  getAllPermisions(user: UserInfo): string[] {
    return this.coreAuth.getAllPermisions(user);
  }

  /**
   * Before taking the localStorage data, the permissions resolver
   * is executed in the general dashboard route, updating the permissions
   * @memberof AuthService
   */
  addPermissions(): void {
    const user = this.coreAuth.getUserInfoFromLocalStorage();
    const allPermissions: string[] = user?.permissions ?? [];
    this.permissionsService.flushPermissions();
    this.permissionsService.addPermission(allPermissions);
  }
}
