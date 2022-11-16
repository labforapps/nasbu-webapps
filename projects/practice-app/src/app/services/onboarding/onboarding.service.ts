import { Injectable } from '@angular/core';
import { Plan, SubscriptionOnboarding, UserSignupPayload } from 'core-models';
import { CoreService, SubscriptionService } from 'core-services';
import { ISignUpResult, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor(private coreService: CoreService,
              private authService: AuthService,
              private subscriptionService: SubscriptionService) { }

  getPlans(): Observable<Plan[]> {
    return this.coreService.getPlans();
  }

  createUserAndAccount(userSignupPayload: UserSignupPayload): Observable<any> {
    return this.authService
               .signUp(userSignupPayload)
               .pipe(
                   switchMap((cognitoUser: ISignUpResult) => {
                       console.log('Cognito user: ', cognitoUser);
                       const subscriptionOnboardingPayload: SubscriptionOnboarding = {
                           plan: userSignupPayload.subscriptionInfo.plan,
                           period: userSignupPayload.subscriptionInfo.period,
                           free_trial: userSignupPayload.subscriptionInfo.free_trial,
                           uuid: cognitoUser.userSub
                       };
                       console.log('subscriptionOnboardingPayload: ', subscriptionOnboardingPayload);
                       return this.subscriptionService.createSubscriptionOnboarding(subscriptionOnboardingPayload);
                   })
               );
}
}
