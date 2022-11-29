import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogListComponent } from '../../../components/dialogs/dialog-list/dialog-list.component';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss'],
})
export class CreateClientComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  ngOnInit(): void {}
  openDialogList() {
    this.dialog.open(DialogListComponent);
  }
}
