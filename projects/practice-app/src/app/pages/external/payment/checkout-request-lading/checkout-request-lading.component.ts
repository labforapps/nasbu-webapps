import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AccountingService } from 'core-services';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout-request-lading',
  templateUrl: './checkout-request-lading.component.html',
  styleUrls: ['./checkout-request-lading.component.scss']
})
export class CheckoutRequestLadingComponent implements OnInit {

  token$!: Subscription;
  token!: string;
  completed: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private toastrService: ToastrService,
              private accountingService: AccountingService) { }

  ngOnInit(): void {
      this.token$ = this.activatedRoute
          .queryParams
          .subscribe((params: Params) => {
              this.token = params['token'];
              this.validateCheckoutRequestToken();
          })
  }

  ngOnDestroy(): void {
      if (this.token$) {
          this.token$.unsubscribe();
      }
  }

  validateCheckoutRequestToken() {
      if (this.token) {
          this.accountingService
              .validatePaymentCheckoutRequest(this.token)
              .subscribe((response: any) => {
                   if (response.is_valid) {
                      this.updatePaymentCheckoutRequest();
                   }
              }, (error) => {
                  console.log('Error: ', error);
                  this.toastrService.error('Error validating pg checkout request.');
              });
      }
  }

  updatePaymentCheckoutRequest() {
    this.accountingService
        .updatePaymentCheckoutRequest(this.token)
        .subscribe((pgCheckoutRequestResponse: any) => {
            this.completed = true;
            setTimeout(() => {
                window.close();
            }, 20000);
        }, (error) => {
            console.log('Error: ', error);
            this.toastrService.error('Error completing PG Checkout request.')
        })
  }

}
