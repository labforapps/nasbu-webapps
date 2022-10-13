import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddRoleComponent } from '../../../components/dialogs/dialog-add-role/dialog-add-role.component';
@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  openDialogNewRole(){
    this.dialog.open(DialogAddRoleComponent);
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
