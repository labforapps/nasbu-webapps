import { Injectable } from '@angular/core';
import { Plan, UserSignupPayload } from 'core-models';
import { CoreService } from 'core-services';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor(private coreService: CoreService,
              private authService: AuthService) { }

  getPlans(): Observable<Plan[]> {
    return this.coreService.getPlans();
  }

  createUserAndAccount(userSignupPayload: UserSignupPayload): Observable<any> {
      return this.authService
              .signUp(userSignupPayload);
  }
}
