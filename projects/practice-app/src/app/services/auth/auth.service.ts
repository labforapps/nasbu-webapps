import { Injectable } from '@angular/core';
import { AuthService as CoreAuthService } from 'core-services';
import { Observable } from 'rxjs';
import { ISignUpResult, CognitoUser } from 'amazon-cognito-identity-js';
import { UserSignupPayload } from 'core-models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private coreAuth: CoreAuthService) { }

  signin(username: string, password: string): Observable<CognitoUser> {
      return this.coreAuth.signin(username, password);
  }

  signUp(userSignupPayload: UserSignupPayload): Observable<ISignUpResult> {
      return this.coreAuth
                .signup(userSignupPayload);
  }
}
