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
  securityUsersTemp!:SecurityUser[];
  caseFile!:CaseFile;
  searchTerm: string = '';

  constructor(
              @Inject(MAT_DIALOG_DATA) public data: {users:SecurityUser[],caseFile:CaseFile},
              private practiceService:PracticeService,
              public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.securityUsersTemp = this.data.users;
    this.caseFile = this.data.caseFile;
    this.securityUsers = this.data.users.sort((a, b) => (this.isUserSelected(b) ? 1 : 0) - (this.isUserSelected(a) ? 1 : 0));
  }

  searchSecurityUser(){
    const searchTerm = this.searchTerm.trim().toLowerCase();

    const filteredArray = this.securityUsers.filter(item =>
      item.user.first_name.trim().toLowerCase().includes(searchTerm)
    );

    this.securityUsers = searchTerm ? filteredArray : this.securityUsersTemp
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

  isUserSelected(securityUser:SecurityUser){

    const securityUserFiltered = this.caseFile.case_file_user_access?.filter( x => x.subscription_user === securityUser.uuid) || [];
    if(securityUserFiltered?.length > 0) return true;
    return false;

   }

  onSelectUser(securityUser:SecurityUser){

    const createCaseFileAccess:CaseFileAccess = {
      subscription:      this.caseFile.subscription,
      case_file:         this.caseFile.uuid || '',
      subscription_user: securityUser.uuid || '',
    }

    this.practiceService.createCaseFileAccess(createCaseFileAccess).subscribe(data => {
      this.caseFile.case_file_user_access?.push(data);
    })

  }

  onRemoveUser(securityUser: SecurityUser) {
    const caseFileAccess: CaseFileAccess | undefined = this.caseFile.case_file_user_access?.find(x => x.subscription_user === securityUser.uuid);

    if (caseFileAccess) {
      this.practiceService.deleteCaseFileAccess(caseFileAccess).subscribe(data => {
        this.caseFile.case_file_user_access = this.caseFile.case_file_user_access?.filter(x => x.uuid != caseFileAccess.uuid);
      });
    }
  }


}
