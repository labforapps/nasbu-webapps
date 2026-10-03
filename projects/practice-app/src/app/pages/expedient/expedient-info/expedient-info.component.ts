import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseFile, CaseFileStatus, TypeCustomer, modules } from 'core-models';
import { AuthService, PracticeService } from 'core-services';
import * as moment from 'moment';
import { DialogCloseExpedientComponent } from '../../../components/dialogs/dialog-close-expedient/dialog-close-expedient.component';

/** Orden de las pestanas de expedient-info.component.html. */
export const EXPEDIENT_TABS: { [name: string]: number } = {
  documents: 0, notes: 1, tasks: 2, invoicing: 3, wallet: 4, info: 5
};

@Component({
  selector: 'app-expedient-info',
  templateUrl: './expedient-info.component.html',
  styleUrls: ['./expedient-info.component.scss']
})
export class ExpedientInfoComponent implements OnInit {

  public caseFile!:CaseFile;
  private selectedSubscription!:any;
  private caseFileId!:string;
  selectedTabIndex:number = 0;
  caseFileStatus = CaseFileStatus;
  typeCustomer = TypeCustomer;

  constructor(private practiceService:PracticeService,
              private authService: AuthService,
              private activatedRoute:ActivatedRoute,
              private router:Router,
              public dialog: MatDialog,
              ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.caseFileId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.getCaseFileById();
    this.getQueryParamByUrl();
  }

  getQueryParamByUrl(){
    this.activatedRoute.queryParamMap.subscribe(params => {
      const tab = params.get('tab') || '0';
      // Acepta el indice (enlaces existentes) o el nombre de la pestana (notificaciones).
      this.selectedTabIndex = tab in EXPEDIENT_TABS ? EXPEDIENT_TABS[tab] : (Number(tab) || 0);
    });
  }

  getCaseFileById(){
    this.practiceService.getCaseFileById(this.selectedSubscription?.ssid.uuid,this.caseFileId).subscribe(data => {
      this.caseFile = data;
    })
  }

  navigateToCustomer(){
    this.router.navigate(['client-profile', this.caseFile.customer.uuid]);
  }

  navigateToUser(){
    this.router.navigate(['user/edit', this.caseFile.assigned_to.uuid]);
  }

  returnDateFormatted(dateCaseFile: string | undefined) {
    const date = moment(dateCaseFile);
    const formattedDate = date.locale('es').format('D MMM. YYYY');

    return formattedDate;
  }

  openCloseExpedientDialog(){
    const dialogRef = this.dialog.open(DialogCloseExpedientComponent,{
      data: {
        caseFile: this.caseFile
      }
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      // if(result) this.caseFile.status = this.caseFileStatus.CLOSED;
    });
  }

  navigateToEditClient(id: string) {
    this.router.navigate(['client-profile', id]);
  }


}
