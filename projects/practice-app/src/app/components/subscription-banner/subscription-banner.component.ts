import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PlanFeature, ResponseGeneralReport, Subscription, SubscriptionBillingInvoice, SubscriptionStatus } from 'core-models';
import { SubscriptionService } from 'core-services';

type BannerState = 'feature_limit' | 'payment_final_warning' | 'payment_pending' | 'trial_ending' | 'welcome' | null;

const WELCOME_FLAG = 'nasbu_welcome_shown';

@Component({
  selector: 'app-subscription-banner',
  templateUrl: './subscription-banner.component.html',
  styleUrls: ['./subscription-banner.component.scss']
})
export class SubscriptionBannerComponent {

  @Input() subscription!: Subscription;
  @Input() pendingInvoice?: SubscriptionBillingInvoice;
  @Input() isOwner: boolean = false;
  @Input() usageReport?: ResponseGeneralReport;
  @Input() planFeatures?: PlanFeature[];

  dismissed = false;
  retrying = false;
  retryFeedback: { type: 'success' | 'error'; message: string } | null = null;

  constructor(
    private router: Router,
    private subscriptionService: SubscriptionService
  ) {}

  get bannerState(): BannerState {
    if (this.dismissed) return null;
    if (this.isOwner && this.featureLimitReached) return 'feature_limit';
    if (this.subscription?.status === SubscriptionStatus.DELAYED) {
      return (this.pendingInvoice?.total_attempts_count ?? 0) >= 2
        ? 'payment_final_warning'
        : 'payment_pending';
    }
    if (this.trialDaysRemaining !== null && this.trialDaysRemaining <= 5) return 'trial_ending';
    if (!localStorage.getItem(WELCOME_FLAG)) return 'welcome';
    return null;
  }

  get bannerClass(): string {
    const map: Record<string, string> = {
      feature_limit:         'c-subscription-banner--warning',
      payment_final_warning: 'c-subscription-banner--danger',
      payment_pending:       'c-subscription-banner--warning',
      trial_ending:          'c-subscription-banner--warning',
      welcome:               'c-subscription-banner--success',
    };
    return this.bannerState ? map[this.bannerState] : '';
  }

  get bannerMessage(): string {
    switch (this.bannerState) {
      case 'feature_limit':
        return `Has alcanzado el límite de ${this.featureLimitReached?.name} en tu plan actual`;
      case 'payment_final_warning':
        return 'Último aviso. Si no realizas el pago del balance pendiente perderás acceso';
      case 'payment_pending':
        return `No se pudo cobrar tu suscripción. Se realizará otro intento el ${this.formatDate(this.pendingInvoice?.collect_at)}`;
      case 'trial_ending':
        return this.trialDaysRemaining === 0
          ? 'Tu prueba gratuita termina hoy. Elige un plan para continuar'
          : `Tu prueba gratuita termina en ${this.trialDaysRemaining} día${this.trialDaysRemaining === 1 ? '' : 's'}. Elige un plan para continuar`;
      case 'welcome':
        return '¡Bienvenido a Nasbu! Gracias por ser parte de nuestra comunidad';
      default:
        return '';
    }
  }

  get bannerCta(): string | null {
    switch (this.bannerState) {
      case 'feature_limit':         return 'Cambiar plan';
      case 'payment_final_warning': return 'Pagar ahora';
      case 'payment_pending':       return 'Reintentar cobro';
      case 'trial_ending':          return 'Elegir plan';
      default:                      return null;
    }
  }

  get featureLimitReached(): { name: string } | null {
    if (!this.usageReport || !this.planFeatures) return null;
    const usageMap: Record<string, number> = {
      users:      this.usageReport.total_users,
      docs:       this.usageReport.total_documents_count,
      case_files: this.usageReport.total_case_files_count,
      tasks:      this.usageReport.total_tasks,
    };
    for (const pf of this.planFeatures) {
      const usage = usageMap[pf.feature.code];
      if (usage !== undefined && pf.quantity > 0 && usage >= pf.quantity) {
        return { name: pf.feature.name };
      }
    }
    return null;
  }

  get trialDaysRemaining(): number | null {
    if (!this.subscription?.expiration_date) return null;
    const diff = new Date(this.subscription.expiration_date).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days >= 0 ? days : null;
  }

  onCtaClick(): void {
    switch (this.bannerState) {
      case 'payment_final_warning':
        this.router.navigate(['/configuration/plans']);
        break;
      case 'feature_limit':
      case 'trial_ending':
        this.router.navigate(['/configuration/plans']);
        break;
      case 'payment_pending':
        if (this.retrying) return;
        this.retrying = true;
        this.retryFeedback = null;
        this.subscriptionService.retryPendingCharge(this.subscription.uuid).subscribe({
          next: () => {
            this.retrying = false;
            this.retryFeedback = { type: 'success', message: 'Reintento procesado. Tu acceso se actualizará en breve.' };
          },
          error: () => {
            this.retrying = false;
            this.retryFeedback = { type: 'error', message: 'No se pudo procesar. Intenta de nuevo o contacta soporte.' };
          }
        });
        break;
    }
  }

  dismissWelcome(): void {
    localStorage.setItem(WELCOME_FLAG, 'true');
    this.dismissed = true;
  }

  private formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
