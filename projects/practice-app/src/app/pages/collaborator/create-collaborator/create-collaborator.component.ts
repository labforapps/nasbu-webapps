import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewRoleComponent } from '../../../components/dialogs/dialog-new-role/dialog-new-role.component';

@Component({
  selector: 'app-create-collaborator',
  templateUrl: './create-collaborator.component.html',
  styleUrls: ['./create-collaborator.component.scss']
})
export class CreateCollaboratorComponent implements OnInit {

  openDialogNewRole(){
    this.dialog.open(DialogNewRoleComponent);
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
