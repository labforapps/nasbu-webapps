import { Inject, Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { ICredentials } from '@aws-amplify/core';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { UserSignupPayload, UserInfo, UserSubscription, SelectedSubscription } from 'core-models';
import { ISignUpResult, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private selectedUserInfo!: UserInfo;

  constructor(@Inject('config') private config: any,
              private httpClient: HttpClient) {
      console.log('Config: ', this.config);
      // Amplify.configure(this.config.awsconfig);
  }

  signin(username: string, password: string): Observable<UserInfo> {
      const signin$ = Auth.signIn(username, password);
      return from(signin$).pipe(
          switchMap((cognitoUser: CognitoUser) => {
                console.log('Cognito user: ', cognitoUser);
                return this.fetchUserInfo();
          })
      );
  }

  fetchUserInfo(): Observable<UserInfo> {
      if (this.selectedUserInfo) {
          return of(this.selectedUserInfo);
      }
      const serverUrl: string = `${this.config.serverUrl}/security/me/`;
      return this.httpClient
                .get<UserInfo>(serverUrl)
                .pipe(
                    tap((userInfo: UserInfo) => this.selectedUserInfo = userInfo),
                    tap(() => {
                        this.storeUserInfoInLocalStorage();
                    })
                );
  }

  storeUserInfoInLocalStorage() {
      const firstSubscription: UserSubscription = this.selectedUserInfo.subscriptions[0];
      const ssid: SelectedSubscription = {ssid: firstSubscription.subscription, mt: firstSubscription.member_type};
      localStorage.setItem('ssid', JSON.stringify(ssid));
  }

  getUserInfoFromLocalStorage(): SelectedSubscription | null {
    const ssid = localStorage.getItem('ssid');
    if (ssid) {
        return JSON.parse(ssid) as SelectedSubscription;
    }

    return null;
  }

  signup(payload: UserSignupPayload): Observable<ISignUpResult> {
      const signup$ = Auth.signUp({
          username: payload.email,
          password: payload.password,
          attributes: {
              profile: '',
              name: `${payload.firstName} ${payload.lastName}`,
              locale: 'DO',
              updated_at: new Date().getTime().toString(),
              email: payload.email,          // optional
              phone_number: payload.phoneNumber,   // optional - E.164 number convention
              // other custom attributes
          }
      });
      return from(signup$);
  }

  signOut(): Observable<any> {
      const signOut$ = Auth.signOut();
      return from(signOut$);
  }

  recoverPassword(username: string): Observable<any> {
      //Auth.
      const forgotPassword$ = Auth.forgotPassword(username);
      return from(forgotPassword$);
  }

  isLoggedIn(): Observable<boolean> {
      const session$ = Auth.currentAuthenticatedUser();
      return from(session$).pipe(
          map((currentUser: any) =>  currentUser != null)
      );
  }

  getAccessToken(): Observable<string> {
      const currentUser$ = Auth.currentSession();
      return from(currentUser$).pipe(
          map((currentUser: CognitoUserSession) => {
              return currentUser.getIdToken().getJwtToken();
          })
      );
  }

}
