import { Component, Input, OnInit } from '@angular/core';
import { CaseFile, CaseFileWalletDetail,CaseFileWalletDetailType } from 'core-models';
import { PracticeService } from 'core-services';

@Component({
  selector: 'app-expedient-wallet',
  templateUrl: './expedient-wallet.component.html',
  styleUrls: ['./expedient-wallet.component.scss']
})
export class ExpedientWalletComponent implements OnInit {

  @Input() caseFile!:CaseFile
  caseFileWalletDetail!:CaseFileWalletDetail[];
  caseFileWalletDetailType = CaseFileWalletDetailType;

  constructor(private practiceService:PracticeService,) { }

  ngOnInit(): void {
    this.getCaseFileWalletDetails();
  }

  getCaseFileWalletDetails(){
    this.practiceService.getCaseFileWalletDetails(this.caseFile.subscription,this.caseFile.uuid || '').subscribe(data => {
     this.caseFileWalletDetail = data;
    })
   }

   get allWalletDetails(): CaseFileWalletDetail[] {
    if (this.caseFileWalletDetail) {
      return this.caseFileWalletDetail;
    }
    return [];
  }

  get creditWalletDetails(): CaseFileWalletDetail[] {
    if (this.caseFileWalletDetail) {
      return this.caseFileWalletDetail.filter((x) => x.type === this.caseFileWalletDetailType.CREDIT);
    }

    return [];
  }

  get debitWalletDetails(): CaseFileWalletDetail[] {
    if (this.caseFileWalletDetail) {
      return this.caseFileWalletDetail.filter((x) => x.type === this.caseFileWalletDetailType.DEBIT);
    }

    return [];
  }

}
