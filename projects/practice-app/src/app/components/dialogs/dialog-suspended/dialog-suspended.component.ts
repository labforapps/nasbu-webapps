import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'core-models';
import { SubscriptionService } from 'core-services';

@Component({
  selector: 'app-dialog-suspended',
  templateUrl: './dialog-suspended.component.html',
  styleUrls: ['./dialog-suspended.component.scss']
})
export class DialogSuspendedComponent {

  retrying = false;
  retryFeedback: { type: 'success' | 'error'; message: string } | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public subscription: Subscription,
    private dialogRef: MatDialogRef<DialogSuspendedComponent>,
    private subscriptionService: SubscriptionService
  ) {}

  onPay(): void {
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
  }
}
