import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseFile } from 'core-models';
import { AuthService, PracticeService } from 'core-services';
import * as moment from 'moment';

@Component({
  selector: 'app-expedient-info',
  templateUrl: './expedient-info.component.html',
  styleUrls: ['./expedient-info.component.scss']
})
export class ExpedientInfoComponent implements OnInit {

  public caseFile!:CaseFile;
  private selectedSubscription!:any;
  private caseFileId!:string;

  constructor(private practiceService:PracticeService,
              private authService: AuthService,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.caseFileId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.getCaseFiles();
  }

  getCaseFiles(){
    this.practiceService.getCaseFileById(this.selectedSubscription?.ssid.uuid,this.caseFileId).subscribe(data => {
      this.caseFile = data;
    })
  }

  returnDateFormatted(dateCaseFile: string | undefined) {
    const date = moment(dateCaseFile);
    const formattedDate = date.locale('es').format('D MMM. YYYY');

    return formattedDate;
  }

}
