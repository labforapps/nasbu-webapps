import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CaseFile, CaseFileStatus, CaseFileWalletDetail,CaseFileWalletDetailType } from 'core-models';
import { PracticeService } from 'core-services';
import { DialogAddBalanceComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-add-balance/dialog-add-balance.component';

@Component({
  selector: 'app-expedient-wallet',
  templateUrl: './expedient-wallet.component.html',
  styleUrls: ['./expedient-wallet.component.scss']
})
export class ExpedientWalletComponent implements OnInit {

  @Input() caseFile!:CaseFile
  caseFileWalletDetail!:CaseFileWalletDetail[];
  caseFileWalletDetailCredit!:CaseFileWalletDetail[];
  caseFileWalletDetailDebit!:CaseFileWalletDetail[];
  caseFileWalletDetailType = CaseFileWalletDetailType;
  caseFileStatus = CaseFileStatus;

  constructor(private practiceService:PracticeService,
    public dialog: MatDialog,) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['caseFile'] && changes['caseFile'].currentValue) {
      this.getCaseFileWalletDetails()
    }
  }

  ngOnInit(): void {
    this.getCaseFileWalletDetails();
  }

  getCaseFileWalletDetails(){
    this.practiceService.getCaseFileWalletDetails(this.caseFile.subscription,this.caseFile.uuid || '').subscribe(data => {
     this.caseFileWalletDetail = data;
     this.caseFileWalletDetailCredit = this.caseFileWalletDetail.filter(x => x.type === this.caseFileWalletDetailType.CREDIT);
     this.caseFileWalletDetailDebit = this.caseFileWalletDetail.filter(x => x.type === this.caseFileWalletDetailType.DEBIT)
    })
   }


  openDialogAddBalance(caseFileWalletDetail?:CaseFileWalletDetail){
    const dialogRef = this.dialog.open(DialogAddBalanceComponent, {
      data: {
        caseFile: this.caseFile,
        caseFileWalletDetail: caseFileWalletDetail
      }
    });

    dialogRef.afterClosed().subscribe((result:CaseFileWalletDetail) => {

      if(result.uuid){
        const caseFileFiltered = this.caseFileWalletDetail.filter(x => x.uuid === result.uuid);

        if(caseFileFiltered.length > 0){
          this.caseFileWalletDetail = this.caseFileWalletDetail.filter(x => x.uuid !== result.uuid);
          this.caseFileWalletDetail.push(result);
          this.caseFileWalletDetailCredit = this.caseFileWalletDetail.filter(x => x.type === this.caseFileWalletDetailType.CREDIT);
        }
        else{
          this.caseFileWalletDetail.push(result);
          this.caseFileWalletDetailCredit = this.caseFileWalletDetail.filter(x => x.type === this.caseFileWalletDetailType.CREDIT);
        }
      }
    });

  }

  returnAmountCaseFileWalletDetails(type:CaseFileWalletDetailType){

      let caseFileWalletDetail!:CaseFileWalletDetail[];

      if(type === this.caseFileWalletDetailType.ALL) caseFileWalletDetail = this.caseFileWalletDetail;
      if(type === this.caseFileWalletDetailType.DEBIT) caseFileWalletDetail = this.caseFileWalletDetailDebit;
      if(type === this.caseFileWalletDetailType.CREDIT) caseFileWalletDetail = this.caseFileWalletDetailCredit;

      if(this.caseFileWalletDetail && this.caseFileWalletDetail.length > 0){
        return caseFileWalletDetail.reduce((sum, caseFileWalletDetail) => {
          return sum + Number(caseFileWalletDetail.amt);
        }, 0);
      }

      return 0;

  }

  deleteCaseFileWalletDetail(uuid:string){
    this.caseFileWalletDetail = this.caseFileWalletDetail.filter(x => x.uuid !== uuid);
    this.caseFileWalletDetailCredit = this.caseFileWalletDetail.filter(x => x.type === this.caseFileWalletDetailType.CREDIT);
  }

  updateCaseFileWalletDetail(caseFileWalletDetail:CaseFileWalletDetail){
    this.caseFileWalletDetail = this.caseFileWalletDetail.filter(x => x.uuid !== caseFileWalletDetail.uuid);
    this.caseFileWalletDetail.push(caseFileWalletDetail);
    this.caseFileWalletDetailCredit = this.caseFileWalletDetail.filter(x => x.type === this.caseFileWalletDetailType.CREDIT);
  }




}
