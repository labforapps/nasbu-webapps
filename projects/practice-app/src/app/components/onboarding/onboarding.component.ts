import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogIntakeComponent } from '../dialogs/dialog-intake/dialog-intake.component';
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
})
export class OnboardingComponent {
  constructor(public dialog: MatDialog) {}

  openDialogIntake(): void {
    this.dialog.open(DialogIntakeComponent, {
      panelClass: 'c-dialog-intake',
    });
  }
}
