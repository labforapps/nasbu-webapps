import { Injectable } from '@angular/core';
import { Plan, UserSignupPayload } from 'core-models';
import { AuthService, CoreService } from 'core-services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private coreService: CoreService,
              private authService: AuthService) { }

  getPlans(): Observable<Plan[]> {
      return this.coreService.getPlans();
  }

  createUserAndAccount(userSignupPayload: UserSignupPayload): Observable<any> {
       return this.authService
                  .signup(userSignupPayload);
  }

}
