import { Injectable } from '@angular/core';
import { AuthService as CoreAuthService } from 'core-services';
import { map, Observable, tap } from 'rxjs';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import { UserSignupPayload, ForgotPasswordSubmit, CurrentUserInfo, UserInfo, SelectedSubscription, ChangeFirstPasswordPayload } from 'core-models';
import { NgxPermissionsService } from 'ngx-permissions';
import * as Sentry from '@sentry/angular-ivy';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private coreAuth: CoreAuthService, private permissionsService: NgxPermissionsService) { }

  signIn(username: string, password: string): Observable<any> {
    return this.coreAuth.signin(username, password).pipe(
      tap(() => {
        if (environment.sentryDsn) Sentry.setUser({ email: username, username });
      })
    );
  }

  signUp(userSignupPayload: UserSignupPayload): Observable<ISignUpResult> {
    return this.coreAuth
      .signup(userSignupPayload);
  }

  resendSignupConfirmationEmail(username:string){
    return this.coreAuth.resendSignupConfirmationEmail(username)
  }

  signOut(){
    if (environment.sentryDsn) Sentry.setUser(null);
    return this.coreAuth.signOut();
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

  /**
   * Recarga desde el backend los permisos del usuario y los aplica a ngx-permissions.
   * Se usa tras un cambio de plan, que cambia el grupo de permisos (NAS-073 / NAS-092).
   */
  refreshPermissions(): Observable<string[]> {
    return this.coreAuth.refreshUserInfo().pipe(
      map(() => this.addPermissions()?.permissions ?? [])
    );
  }

  getAllPermisions(user: UserInfo): string[] {
    return this.coreAuth.getAllPermisions(user);
  }

  saveFirstUserPassword(payload:ChangeFirstPasswordPayload) {
    return this.coreAuth.saveFirstUserPassword(payload);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<string> {
    return this.coreAuth.changePassword(oldPassword, newPassword);
  }

  /**
   * Before taking the localStorage data, the permissions resolver
   * is executed in the general dashboard route, updating the permissions
   * @memberof AuthService
   */
  addPermissions(): SelectedSubscription | null {
    const user = this.getUserInfoFromLocalStorage();
    const allPermissions: string[] = user?.permissions ?? [];
    this.permissionsService.flushPermissions();
    this.permissionsService.addPermission(allPermissions);
    return user;
  }

  getUserInfoFromLocalStorage(): SelectedSubscription | null {
    return this.coreAuth.getUserInfoFromLocalStorage();
  }

  selectSubscription(subscriptionId: string): boolean {
    return this.coreAuth.selectSubscription(subscriptionId);
  }

  getPendingPaymentSubscription(): SelectedSubscription | null {
    return this.coreAuth.getPendingPaymentSubscription();
  }
}
