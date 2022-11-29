import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogSendRegisterComponent } from '../dialog-send-register/dialog-send-register.component';
@Component({
  selector: 'app-dialog-new-costumer',
  templateUrl: './dialog-new-costumer.component.html',
  styleUrls: ['./dialog-new-costumer.component.scss'],
})
export class DialogNewCostumerComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  openDialogSendRegister() {
    this.dialog.open(DialogSendRegisterComponent);
  }
  ngOnInit(): void {}
}
