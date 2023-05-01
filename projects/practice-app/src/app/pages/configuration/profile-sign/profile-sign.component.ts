import { Component, OnInit } from '@angular/core';
import { Subscription } from 'core-models';
import { AuthService, SubscriptionService } from 'core-services';

@Component({
  selector: 'app-profile-sign',
  templateUrl: './profile-sign.component.html',
  styleUrls: ['./profile-sign.component.scss']
})
export class ProfileSignComponent implements OnInit {

  subscription!:Subscription;
  selectedSubscription!:any;

  constructor(private subscriptionService:SubscriptionService,
              private authService: AuthService,
    ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getSubscriptionInformation();
  }

  getSubscriptionInformation(){
    this.subscriptionService.getSubscription(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      console.log(data);
      this.subscription = data;
    })
  }

}
