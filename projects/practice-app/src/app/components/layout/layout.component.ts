import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogIntakeComponent } from '../dialogs/dialog-intake/dialog-intake.component';
import { DialogSuspendedComponent } from '../dialogs/dialog-suspended/dialog-suspended.component';
import { CurrentUserInfo, PlanFeature, ResponseGeneralReport, SelectedSubscription, Subscription, SubscriptionBillingInvoice, SubscriptionBillingInvoiceStatus, SubscriptionMemberType, SubscriptionStatus } from 'core-models';
import { ReportsService, SubscriptionService } from 'core-services';
import { ReportFormat } from 'core-models';
import { forkJoin } from 'rxjs';
import { OnboardingService } from '../../services/onboarding/onboarding.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  @ViewChild(MatDrawer)
  sidenav!: MatDrawer;
  currentUser!: CurrentUserInfo;
  public openMenu!: boolean;
  selectedSubscription!: SelectedSubscription | null;
  subscriptionMemberType = SubscriptionMemberType;

  subscription!: Subscription;
  pendingInvoice?: SubscriptionBillingInvoice;
  usageReport?: ResponseGeneralReport;
  planFeatures: PlanFeature[] = [];

  constructor(
    private observer: BreakpointObserver,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private dialog: MatDialog,
    private subscriptionService: SubscriptionService,
    private reportsService: ReportsService,
    private onboardingService: OnboardingService
  ) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.addPermissions();

    this.authService.getCurrentUserInfo().subscribe(data => {
      this.currentUser = data;

      if (this.selectedSubscription?.mt !== this.subscriptionMemberType.OWNER) {
        this.loadChatbot();
      }

      if (localStorage.getItem(`first_login_${this.currentUser.username}`) === 'true') {
        this.openDialogIntake();
      }
    });

    const uuid = this.selectedSubscription?.ssid?.uuid;
    if (uuid) {
      forkJoin({
        subscription: this.subscriptionService.getSubscription(uuid),
        invoices: this.subscriptionService.getSubscriptionBillingInvoice(uuid)
      }).subscribe(({ subscription, invoices }) => {
        this.subscription = subscription;
        this.pendingInvoice = invoices.find(
          i => i.status === SubscriptionBillingInvoiceStatus.PENDING
        );

        if (
          subscription.status === SubscriptionStatus.SUSPENDED ||
          subscription.status === SubscriptionStatus.EXPIRED
        ) {
          this.dialog.open(DialogSuspendedComponent, {
            data: subscription,
            disableClose: true,
            panelClass: 'c-dialog-suspended-panel',
            width: '480px',
          });
        }
      });

      if (this.selectedSubscription?.mt === SubscriptionMemberType.OWNER) {
        forkJoin({
          report: this.reportsService.getReportGeneral({
            subscription: uuid,
            report_name: 'general_metrics',
            period: null,
            format: ReportFormat.JSON,
            start_date: null,
            end_date: null
          }),
          plans: this.onboardingService.getPlans()
        }).subscribe(({ report, plans }) => {
          this.usageReport = report;
          const currentPlan = plans.find(p => p.uuid === this.subscription?.plan);
          this.planFeatures = currentPlan?.features ?? [];
        });
      }
    }
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
        this.cdRef.detectChanges();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

  openDialogIntake(): void {
    const dialogRef = this.dialog.open(DialogIntakeComponent, {
      panelClass: 'c-dialog-intake',
    });

    dialogRef.afterClosed().subscribe(data => {
      if (localStorage.getItem(`first_login_${this.currentUser.username}`) === 'true') {
        localStorage.setItem(`first_login_${this.currentUser.username}`, 'false');
        this.openMenu = true;
      }
    });
  }

  onOnboardingCompleted(allDone: boolean): void {
    if (allDone) {
      this.loadChatbot();
    }
  }

  private loadChatbot(): void {
    if (document.getElementById('nasbu-chatbot-script')) return;

    (window as any)['NASBUChatbotConfig'] = {
      webhookUrl: 'https://aiborinquen.app.n8n.cloud/webhook/nasbu-chatbot',
      title: 'Asistente NASBU',
      subtitle: 'En línea',
      greeting: '¡Hola! Soy el asistente virtual de NASBU. ¿En qué puedo ayudarte hoy?',
      primaryColor: '#2563eb',
      position: 'right',
      zIndex: 9999,
    };

    const script = document.createElement('script');
    script.id = 'nasbu-chatbot-script';
    script.src = '/assets/js/ncb.js';
    document.body.appendChild(script);
  }

  get showTourGear(): boolean {
    if (this.selectedSubscription) {}
    return false;
  }
}
