import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CaseFile, CaseFileStatus } from 'core-models';
import { AuthService, PracticeService } from 'core-services';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

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

  constructor(private practiceService:PracticeService,
              private authService: AuthService,
              private activatedRoute:ActivatedRoute,
              private translateService:TranslateService,
              private router:Router,
              private toastr: ToastrService
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

  closeCaseFile(){

    Swal.fire({
      title: this.translateService.instant(
        'Are you sure to close this docket?'
      ),
      text: this.translateService.instant(
        'clients.table.buttons.actions_cannot_be_reversed'
      ),
      iconHtml: '<img src="assets/images/alert-delete.svg">',
      confirmButtonText: 'Close',
      showCancelButton: true,
      cancelButtonText: this.translateService.instant(
        'clients.client_intake.close_window'
      ),
      customClass: {
        popup: 'c-alert c-alert--delete',
      },
    }).then((result) => {
      if (result.isConfirmed) {

        this.caseFile.status = this.caseFileStatus.CLOSED;

        this.practiceService.updateCaseFileChangeStatus(this.caseFile).subscribe(data => {
          this.toastr.success('Ok',this.translateService.instant('successMessages.updated_successfully'))
        })
      }
    });

  }


}
