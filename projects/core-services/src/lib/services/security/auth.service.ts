import { Inject, Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { catchError, from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { UserSignupPayload, UserInfo, UserSubscription, SelectedSubscription, ForgotPasswordSubmit, CurrentUserInfo,ChangeFirstPasswordPayload } from 'core-models';
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

     resendSignupConfirmationEmail(username:string): Observable<any> {
       const resendSignup$ = Auth.resendSignUp(username);
       return from(resendSignup$)
    }

    signin(username: string, password: string): Observable<UserInfo | CognitoUser> {
        const signin$ = Auth.signIn(username, password);
        return from(signin$).pipe(
            switchMap((cognitoUser: CognitoUser) => {
                console.log('Cognito user: ', cognitoUser);
                if(cognitoUser.challengeName === 'NEW_PASSWORD_REQUIRED' ){
                  return of(cognitoUser);
                }

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

    storeUserInfoInLocalStorage(): void {
        const firstSubscription: UserSubscription = this.selectedUserInfo.subscriptions[0];
        const allPermissions = this.getAllPermisions(this.selectedUserInfo);
        const ssid: SelectedSubscription = { ssid: firstSubscription.subscription, mt: firstSubscription.member_type, permissions: allPermissions };
        localStorage.setItem('ssid', JSON.stringify(ssid));
    }

    getUserInfoFromLocalStorage(): SelectedSubscription | null {
        const ssid = localStorage.getItem('ssid');
        if (ssid) {
            return JSON.parse(ssid) as SelectedSubscription;
        }

        return null;
    }

    getAllPermisions(user: UserInfo): string[] {
        let allPermissions: string[] = [];
        user.subscriptions.map(({ permissions }: UserSubscription) => {
            allPermissions.push(...permissions)
        });
        return [... new Set(allPermissions)];
    }

    getCurrentUserInfo(): Observable<CurrentUserInfo> {
        const userInfo$ = Auth.currentUserInfo();
        return from(userInfo$);
    }

    signup(payload: UserSignupPayload): Observable<ISignUpResult> {
      // period = [r for r in user_info['UserAttributes'] if r['Name'] == 'custom:onb_period'][0]['Value']
      // free_trial = int([r for r in user_info['UserAttributes'] if r['Name'] == 'custom:onb_free_trial'][0]['Value'])
      // total_users = int([r for r in user_info['UserAttributes'] if r['Name'] == 'custom:onb_total_users'][0]['Value'])
      // plan = [r for r in user_info['UserAttributes'] if r['Name'] == 'custom:onb_plan'][0]['Value']
      // pm_request_id = [r for r in user_info['UserAttributes'] if r['Name'] == 'custom:onb_pm_request_id'][0]['Value']
      // onboarding_in_progress = int([r for r in user_info['UserAttributes'] if r['Name'] == 'custom:onb_in_progress'][0]['Value'])
        const signup$ = Auth.signUp({
            username: payload.email,
            password: payload.password,
            attributes: {
                profile: '',
                picture: '',
                gender: '',
                birthdate: '',
                address: '',
                name: payload.firstName,
                middle_name: payload.lastName,
                given_name: `${payload.firstName} ${payload.lastName}`,
                locale: 'DO',
                updated_at: new Date().getTime().toString(),
                email: payload.email,          // optional
                phone_number: payload.phoneNumber,   // optional - E.164 number convention
               'custom:onb_period': payload.subscriptionInfo.period,
               'custom:onb_free_trial': (payload.subscriptionInfo.free_trial ? 1 : 0).toString(),
               'custom:onb_total_users': payload.subscriptionInfo.total_users.toString(),
               'custom:onb_plan': payload.subscriptionInfo.plan,
               'custom:onb_pm_request_id': payload.subscriptionInfo.pm_request_id?.toString(),
               'custom:onb_in_progress': '1',                // other custom attributes
            },
        });

       // Auth.updateUserAttributes()

        return from(signup$);
    }

    signOut(): Observable<any> {
        const signOut$ = Auth.signOut();
        return from(signOut$);
    }

    recoverPassword(username: string): Observable<any> {
        const forgotPassword$ = Auth.forgotPassword(username);
        return from(forgotPassword$);
    }

    recoverPasswordSubmit({ username, code, newPassword }: ForgotPasswordSubmit): Observable<any> {
        const forgotPasswordSubmit$ = Auth.forgotPasswordSubmit(username, code, newPassword);
        return from(forgotPasswordSubmit$);
    }

    isLoggedIn(): Observable<boolean> {
        const session$ = Auth.currentAuthenticatedUser();
        return from(session$).pipe(
            catchError((error) => of(null)),
            map((currentUser: any) => currentUser != null),

        );
    }

    getAccessToken(): Observable<string> {
        const currentUser$ = Auth.currentSession();
        return from(currentUser$).pipe(
            catchError((error: any) => {
                return of(null);
            }),
            map((currentUser: CognitoUserSession | null) => {
                if (!currentUser) {
                    return '';
                }
                return currentUser.getIdToken().getJwtToken();
            })
        );
    }

    confirmAccount(username: string, code: string): Observable<any> {
        const confirm$ = Auth.confirmSignUp(username, code)
        return from(confirm$);
    }

    saveFirstUserPassword(payload: ChangeFirstPasswordPayload): Observable<any> {
      const changePassword$ = Auth.completeNewPassword(payload.user, payload.newPassword,{});
      return of(changePassword$);
    }



}
