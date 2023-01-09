import { Component, OnInit } from '@angular/core';
import {CustomersService,AuthService} from 'core-services';
import {Customer} from 'core-models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit {

  customerId!:string;
  customer!:Customer;
  selectedSubscription:any;

  constructor(private customerService:CustomersService,
              private authService:AuthService,
              private ActivatedRoute:ActivatedRoute) { }

  ngOnInit(): void {

    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();

    this.customerId = this.ActivatedRoute.snapshot.paramMap.get('id') || '';

    this.customerService
      .getCustomerById(this.selectedSubscription?.ssid.uuid, this.customerId)
      .subscribe((data) => {
        console.log(data);
        this.customer = data;
      });

  }

}
