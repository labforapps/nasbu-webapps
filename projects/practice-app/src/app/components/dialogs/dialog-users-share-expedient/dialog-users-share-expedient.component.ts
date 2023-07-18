import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CaseFile, CaseFileAccess, SecurityUser } from 'core-models';
import { PracticeService } from 'core-services';
import { CreateCollaboratorComponent } from '../../../pages/collaborator/create-collaborator/create-collaborator.component';

@Component({
  selector: 'app-dialog-users-share-expedient',
  templateUrl: './dialog-users-share-expedient.component.html',
  styleUrls: ['./dialog-users-share-expedient.component.scss']
})
export class DialogUsersShareExpedientComponent implements OnInit {

  securityUsers!:SecurityUser[];
  caseFile!:CaseFile;

  constructor(
              @Inject(MAT_DIALOG_DATA) public data: {users:SecurityUser[],caseFile:CaseFile},
              private practiceService:PracticeService,
              public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.securityUsers = this.data.users;
    this.caseFile = this.data.caseFile;
  }

  openCustomerDialog(){
    const dialogRef = this.dialog.open(CreateCollaboratorComponent,{
      panelClass: 'fullscreen',
      data: {
        modal:true
      }
  })

  dialogRef.afterClosed().subscribe((result:SecurityUser) => {
    if(result) this.securityUsers.push(result);
  });
}

  onSelectUser(securityUser:SecurityUser){

    const createCaseFileAccess:CaseFileAccess = {
      subscription:      this.caseFile.subscription,
      case_file:         this.caseFile.uuid || '',
      subscription_user: securityUser.uuid || '',
    }

    this.practiceService.createCaseFileAccess(createCaseFileAccess).subscribe(data => {
      console.log(data);
    })

  }

}
