import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription, SubscriptionMemberType } from 'core-models';
import { AuthService, PracticeService, SecurityService, SubscriptionService } from 'core-services';
import { CustomersService } from 'projects/core-services/src/public-api';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
})
export class OnboardingComponent {

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  @Input() openMenu!: boolean;
  @Output() completed = new EventEmitter<boolean>();
  public checkCustomers: boolean = false;
  public checkSecurityUsers: boolean = false;
  public checkFirm: boolean = false;
  public checkCaseFile: boolean = false;
  public checkProfile: boolean = false;
  public isLoading: boolean = true;
  selectedSubscription!: any;
  subscriptionProfile!: Subscription;
  stepsCompleted: number = 0;
  allStepsCompleted: boolean = true;
  subscriptionMemberType = SubscriptionMemberType;

  constructor(public dialog: MatDialog,
              private authService: AuthService,
              private customersService: CustomersService,
              private securityService: SecurityService,
              private practiceService: PracticeService,
              private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.checkAccountSetup();
  }

  checkAccountSetup(): void {
    const uuid = this.selectedSubscription?.ssid.uuid;
    forkJoin({
      customers: this.customersService.getCustomers(uuid),
      securityUsers: this.securityService.getSecurityUsers(uuid),
      caseFiles: this.practiceService.getCaseFiles(uuid),
      subscription: this.subscriptionService.getSubscription(uuid),
    }).subscribe({
      next: ({ customers, securityUsers, caseFiles, subscription }) => {
        const nonOwners = securityUsers.filter(x => x.subscription_member_type !== this.subscriptionMemberType.OWNER).length;

        this.checkCustomers = customers.length > 0;
        this.checkSecurityUsers = nonOwners > 0;
        this.checkCaseFile = caseFiles.length > 0;
        this.subscriptionProfile = subscription;
        this.checkProfile = subscription.addresses.length > 0;

        this.stepsCompleted = [this.checkCustomers, this.checkSecurityUsers, this.checkCaseFile, this.checkProfile]
          .filter(Boolean).length;
        this.allStepsCompleted = this.stepsCompleted === 4;
        this.isLoading = false;
        this.completed.emit(this.allStepsCompleted);
      },
      error: () => {
        this.isLoading = false;
        this.completed.emit(false);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openMenu'] && changes['openMenu'].currentValue) {
      this.trigger.openMenu();
    }
  }

  ngAfterViewInit() {}

}
