import { Inject, Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { catchError, from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { UserSignupPayload, UserInfo, UserSubscription, SelectedSubscription, ForgotPasswordSubmit, CurrentUserInfo,ChangeFirstPasswordPayload, SubscriptionStatus } from 'core-models';
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
        return this.loadUserInfo();
    }

    /**
     * Vuelve a pedir `/security/me/` aunque ya haya datos en memoria.
     *
     * `fetchUserInfo` devuelve lo cacheado durante toda la sesión, así que un cambio de
     * plan no se reflejaba en los permisos hasta volver a iniciar sesión (NAS-073).
     * Conserva la suscripción seleccionada.
     */
    refreshUserInfo(): Observable<UserInfo> {
        const currentSubscriptionId = this.getUserInfoFromLocalStorage()?.ssid?.uuid;
        return this.loadUserInfo(currentSubscriptionId);
    }

    private loadUserInfo(preferredSubscriptionId?: string): Observable<UserInfo> {
        const serverUrl: string = `${this.config.serverUrl}/security/me/`;
        return this.httpClient
                   .get<UserInfo>(serverUrl)
                   .pipe(
                      tap((userInfo: UserInfo) => this.selectedUserInfo = userInfo),
                      tap(() => {
                          this.storeUserInfoInLocalStorage(preferredSubscriptionId);
                      })
                   );
    }

    /**
     * Selecciona la suscripcion indicada si el usuario pertenece a ella. Lo usan los
     * enlaces de las notificaciones (?ssid=), que pueden ser de otra suscripcion.
     */
    selectSubscription(subscriptionId: string): boolean {
        const belongs = !!this.selectedUserInfo?.subscriptions
            .some((item: UserSubscription) => item.subscription?.uuid === subscriptionId);
        if (belongs) {
            this.storeUserInfoInLocalStorage(subscriptionId);
        }
        return belongs;
    }

    storeUserInfoInLocalStorage(preferredSubscriptionId?: string): void {
        const subscriptions: UserSubscription[] = this.selectedUserInfo.subscriptions;
        const firstSubscription: UserSubscription = subscriptions
            .find((item: UserSubscription) => item.subscription?.uuid === preferredSubscriptionId) || subscriptions[0];
        const allPermissions = this.getAllPermisions(this.selectedUserInfo);
        // El estado y la URL de checkout viajan aparte para que el SubscriptionGuard
        // pueda cortar el paso de un alta sin pagar sin tener que salir a la red.
        const ssid: SelectedSubscription = {
            ssid: firstSubscription.subscription,
            mt: firstSubscription.member_type,
            permissions: allPermissions,
            status: firstSubscription.subscription?.status,
            checkoutUrl: firstSubscription.subscription?.first_checkout_url
        };
        localStorage.setItem('ssid', JSON.stringify(ssid));
    }

    /**
     * Suscripcion cuyo pago quedo sin completar, si la hay.
     *
     * En el alta por redirect la cuenta de Cognito se confirma antes de tokenizar la
     * tarjeta, asi que se puede llegar hasta aca con la suscripcion todavia en 'Z'.
     */
    getPendingPaymentSubscription(): SelectedSubscription | null {
        const selected = this.getUserInfoFromLocalStorage();

        return selected?.status === SubscriptionStatus.PENDING_TOKENIZATION ? selected : null;
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
        // Cognito rechaza el string vacio en los atributos marcados como required en el
        // esquema del pool ("The attribute X is required"), y Required es inmutable una
        // vez creado el pool. El formulario de alta no pide ninguno de estos cuatro
        // datos, asi que van con placeholders: solo estan para cumplir el esquema.
        // birthdate ademas tiene constraint de largo exacto 10, de ahi el YYYY-MM-DD.
        const attributes: { [key: string]: string } = {
            profile: '',
            picture: '-',
            gender: '-',
            birthdate: '1900-01-01',
            address: '-',
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
           'custom:onb_in_progress': '1',                // other custom attributes
        };

        // El requestId solo existe en el modo lightbox, donde la tarjeta se tokeniza
        // antes del signup. En el modo redirect la clave tiene que estar AUSENTE: es
        // justamente su ausencia lo que le dice al backend que arme la sesion de
        // tokenizacion y devuelva la URL de checkout.
        //
        // No alcanza con `pm_request_id?.toString()`: eso deja la clave en el objeto
        // con valor undefined, y Amplify la manda igual como {Name, Value: undefined}.
        if (payload.subscriptionInfo.pm_request_id) {
            attributes['custom:onb_pm_request_id'] = payload.subscriptionInfo.pm_request_id.toString();
        }

        const signup$ = Auth.signUp({
            username: payload.email,
            password: payload.password,
            attributes,
        });

       // Auth.updateUserAttributes()

        return from(signup$);
    }

    signOut(): Observable<any> {
        const signOut$ = Auth.signOut();
        return from(signOut$).pipe(
          tap(() => {
            localStorage.clear();
          })
        );
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

    /**
     * Cambia la contrasena del usuario con sesion iniciada. Cognito exige la actual y
     * responde NotAuthorizedException si no coincide.
     */
    changePassword(oldPassword: string, newPassword: string): Observable<string> {
        return from(Auth.currentAuthenticatedUser()).pipe(
            switchMap((user: CognitoUser) => from(Auth.changePassword(user, oldPassword, newPassword)))
        );
    }

    /**
     * Access token de Cognito (no el id token). Es el que valida el WebSocket de
     * notificaciones en $connect.
     */
    getCognitoAccessToken(): Observable<string> {
        return from(Auth.currentSession()).pipe(
            map((session: CognitoUserSession) => session.getAccessToken().getJwtToken())
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
