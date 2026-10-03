import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'core-services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-confirmation',
  templateUrl: './account-confirmation.component.html',
  styleUrls: ['./account-confirmation.component.scss']
})
export class AccountConfirmationComponent implements OnInit {

  email!: string;
  code!: string;
  confirmed!: boolean;


  constructor(private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
      this.fetchParams();
  }

  fetchParams() {
      this.email = this.activatedRoute.snapshot.queryParams['email'];
      this.code = this.activatedRoute.snapshot.queryParams['code'];
      this.confirmAccount();
  }

  /**
   * Confirma la cuenta en Cognito. Es el flujo propio de Cognito, y dispara su trigger
   * PostConfirmation, que es quien cierra el alta del lado del backend.
   *
   * Confirmar la cuenta NO quiere decir que el alta este completa: en el registro por
   * redirect el mail de verificacion sale antes de tokenizar la tarjeta, asi que se
   * puede llegar hasta aca sin haber pagado. Por eso desde aca solo se va al login,
   * donde el SubscriptionGuard decide si se entra a la app o se vuelve al checkout.
   */
  confirmAccount() {
      this.authService
          .confirmAccount(this.email, this.code)
          .subscribe((response: any) => {
                this.confirmed = true;
          }, (error) => {
                this.navigateToSignin();
          });
  }

  navigateToSignin() {
      this.router.navigate(['/signin']);
  }

}
