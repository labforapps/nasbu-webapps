import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'core-models';
import { AuthService, PracticeService, SecurityService, SubscriptionService } from 'core-services';
import { CustomersService } from 'projects/core-services/src/public-api';
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
})
export class OnboardingComponent {

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  @Input() openMenu!: boolean;
  public checkCustomers:boolean = false;
  public checkSecurityUsers:boolean = false;
  public checkFirm:boolean = false;
  public checkCaseFile:boolean = false;
  public checkProfile:boolean = false;
  selectedSubscription!:any;
  subscriptionProfile!:Subscription;
  stepsCompleted:number = 0;

  constructor(public dialog: MatDialog,
              private authService:AuthService,
              private customersService:CustomersService,
              private securityService:SecurityService,
              private practiceService:PracticeService,
              private subscriptionService:SubscriptionService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();

    this.getCustomers();
    this.getSecurityUsers();
    this.getCaseFiles();
    this.getSubscriptionProfile();
  }

  getCustomers(){
    this.customersService.getCustomers(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.checkCustomers = data.length > 0 ? true : false;
      if(data.length > 0) this.stepsCompleted++;
    })
  }

  getSecurityUsers(){
    this.securityService.getSecurityUsers(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.checkSecurityUsers = data.length > 0 ? true : false;
      if(data.length > 0) this.stepsCompleted++;
    })
  }

  getCaseFiles(){
    this.practiceService.getCaseFiles(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.checkCaseFile = data.length > 0 ? true : false;
      if(data.length > 0) this.stepsCompleted++;
    })
  }

  getSubscriptionProfile(){
    this.subscriptionService.getSubscription(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.subscriptionProfile = data;
      this.checkProfile = data.addresses.length > 0 ? true : false;
      if(data.addresses.length > 0) this.stepsCompleted++;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['openMenu'] && changes['openMenu'].currentValue) {
      this.trigger.openMenu();
    }
  }

  ngAfterViewInit() {
    // Usar el trigger aquí porque en ngOnInit aún no está disponible
  }


}
