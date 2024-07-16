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
  loading:boolean = true;

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

          setTimeout(() => {
            window.close();
          }, 20000);
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
                   else{
                    this.loading = false
                    this.completed = false
                   }
              }, (error) => {
                  this.loading = false
                  this.completed = false
                  console.log('Error: ', error);
                  this.toastrService.error('Error validating pg checkout request.');
              });
      }
      else{
        this.loading = false
        this.completed = false
      }
  }

  updatePaymentCheckoutRequest() {
    this.accountingService
        .updatePaymentCheckoutRequest(this.token)
        .subscribe((pgCheckoutRequestResponse: any) => {
            this.completed = true;
            this.loading = false
            setTimeout(() => {
                window.close();
            }, 20000);
        }, (error) => {
            this.loading = false
            this.completed = false
            console.log('Error: ', error);
            this.toastrService.error('Error completing PG Checkout request.')
        })
  }

}
