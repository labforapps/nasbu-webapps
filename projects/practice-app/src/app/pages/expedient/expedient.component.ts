import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewExpedientComponent } from '../../components/dialogs/dialog-new-expedient/dialog-new-expedient.component';
import { CaseFile } from 'projects/core-models/src/lib/models/practice/practice';
import { AuthService, CustomersService, PracticeService, SecurityService } from 'core-services';
import { CaseFileStatus, Customer, SecurityUser } from 'core-models';

@Component({
  selector: 'app-expedient',
  templateUrl: './expedient.component.html',
  styleUrls: ['./expedient.component.scss']
})
export class ExpedientComponent implements OnInit {

  caseFiles!:CaseFile[];
  openCaseFiles!:CaseFile[];
  closedCaseFiles!:CaseFile[];
  selectedSubscription!: any;
  customers!:Customer[];
  securityUsers!:SecurityUser[];
  caseFileStatus = CaseFileStatus

  constructor(public dialog: MatDialog,
              private practiceService:PracticeService,
              private authService: AuthService,
              private customerService:CustomersService,
              private securityService:SecurityService) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getCaseFiles();
    this.getCustomers();
    this.getSecurityUsers();
  }

  getCaseFiles(){
    this.practiceService.getCaseFiles(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.caseFiles = data.sort((a, b) => {
        let dateA = new Date(a.created_at || '').getTime();
        let dateB = new Date(b.created_at || '').getTime();
        return dateB - dateA;
    });;

    this.openCaseFiles = this.caseFiles.filter((x) => x.status === this.caseFileStatus.OPEN);
    this.closedCaseFiles = this.caseFiles.filter((x) => x.status === this.caseFileStatus.CLOSED);;
    })
  }

  getCustomers(){
    this.customerService.getCustomers(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.customers = data;
    })
  }

  getSecurityUsers(){
    this.securityService.getSecurityUsers(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.securityUsers = data;
    })
  }

  openDialogNewExpedient(){
    const dialogRef = this.dialog.open(DialogNewExpedientComponent);

    dialogRef.afterClosed().subscribe((result:CaseFile) => {
      this.getCaseFiles();
    });
  }




}
