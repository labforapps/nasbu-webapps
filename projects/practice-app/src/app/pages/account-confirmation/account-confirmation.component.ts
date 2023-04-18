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
      this.navigateToSignin();
  }

}
