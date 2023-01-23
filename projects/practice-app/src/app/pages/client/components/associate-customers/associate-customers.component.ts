import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogListComponent } from '../../../../components/dialogs/dialog-list/dialog-list.component';
import { CustomersService } from 'core-services';

@Component({
  selector: 'app-associate-customers',
  templateUrl: './associate-customers.component.html',
  styleUrls: ['./associate-customers.component.scss'],
})
export class AssociateCustomersComponent implements OnInit {
  constructor(public dialog: MatDialog,
              private customerService:CustomersService) {}

  ngOnInit(): void {}
  openDialogList() {
    this.dialog.open(DialogListComponent);
  }
}
