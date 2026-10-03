import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { NotificationCategory, NotificationCode, NotificationPreference } from 'core-models';
import { SubscriptionNotificationsService } from 'core-services';
import { AuthService } from '../../../services/auth/auth.service';

/**
 * Preferencias de notificaciones del usuario en la suscripcion seleccionada.
 *
 * El dashboard es obligatorio; el interruptor de cada aviso controla el email y se guarda
 * al cambiarlo, como en la maqueta (no hay boton de guardar).
 */
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  readonly categories: NotificationCategory[] = ['tasks', 'cases', 'clients', 'billing', 'documents', 'team', 'account'];
  preferences: NotificationPreference[] = [];
  subscriptionId = '';
  loaded = false;
  private saving = new Set<NotificationCode>();
  private requests = new Subscription();

  constructor(private notifications: SubscriptionNotificationsService,
              private auth: AuthService,
              private toastr: ToastrService,
              private translate: TranslateService) {}

  ngOnInit(): void {
    this.subscriptionId = this.auth.getUserInfoFromLocalStorage()?.ssid?.uuid || '';
    this.load();
  }

  ngOnDestroy(): void { this.requests.unsubscribe(); }

  rows(category: NotificationCategory): NotificationPreference[] {
    return this.preferences.filter(row => row.category === category);
  }

  isSaving(row: NotificationPreference): boolean {
    return this.saving.has(row.code);
  }

  load(): void {
    if (!this.subscriptionId) { return; }
    this.requests.add(this.notifications.getPreferences(this.subscriptionId).subscribe({
      next: result => {
        this.preferences = result.preferences.map(row => ({ ...row }));
        this.loaded = true;
      },
      error: () => this.toastr.error(this.translate.instant('notificationPreferences.loadError'))
    }));
  }

  toggleEmail(row: NotificationPreference, email: boolean): void {
    const previous = row.email;
    row.email = email;
    this.saving.add(row.code);
    this.requests.add(this.notifications.savePreferences(this.subscriptionId, [row]).subscribe({
      next: () => this.saving.delete(row.code),
      error: () => {
        // Si no se guarda, el interruptor vuelve a su estado real.
        row.email = previous;
        this.saving.delete(row.code);
        this.toastr.error(this.translate.instant('notificationPreferences.saveError'));
      }
    }));
  }
}
