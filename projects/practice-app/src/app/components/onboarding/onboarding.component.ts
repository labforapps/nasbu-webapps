import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogIntakeComponent } from '../dialogs/dialog-intake/dialog-intake.component';
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}
  openDialogIntake() {
    this.dialog.open(DialogIntakeComponent, {
      panelClass: 'c-dialog-intake',
    });
  }
}
