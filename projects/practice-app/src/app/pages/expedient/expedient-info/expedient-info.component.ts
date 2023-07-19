import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CaseFile, CaseFileStatus, TypeCustomer } from 'core-models';
import { AuthService, PracticeService } from 'core-services';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DialogCloseExpedientComponent } from '../../../components/dialogs/dialog-close-expedient/dialog-close-expedient.component';

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
              private translateService:TranslateService,
              private router:Router,
              private toastr: ToastrService,
              public dialog: MatDialog,
              ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.caseFileId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.getCaseFiles();
    this.getQueryParamByUrl();
  }

  getQueryParamByUrl(){
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.selectedTabIndex =  Number(params.get('tab'));
    });
  }

  getCaseFiles(){
    this.practiceService.getCaseFileById(this.selectedSubscription?.ssid.uuid,this.caseFileId).subscribe(data => {
      this.caseFile = data;
    })
  }

  navigateToCustomer(){
    this.router.navigate(['customers/edit', this.caseFile.customer.uuid]);
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


}
