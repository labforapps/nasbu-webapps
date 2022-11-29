import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogRecoveryComponent } from '../dialog-recovery/dialog-recovery.component';

@Component({
  selector: 'app-dialog-send-register',
  templateUrl: './dialog-send-register.component.html',
  styleUrls: ['./dialog-send-register.component.scss'],
})
export class DialogSendRegisterComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  openDialogRecovery() {
    this.dialog.open(DialogRecoveryComponent);
  }
  ngOnInit(): void {}
}
