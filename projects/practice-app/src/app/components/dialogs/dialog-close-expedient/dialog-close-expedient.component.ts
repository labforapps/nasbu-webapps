import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CaseFile, CaseFileStatus } from 'core-models';
import { PracticeService } from 'core-services';

@Component({
  selector: 'app-dialog-close-expedient',
  templateUrl: './dialog-close-expedient.component.html',
  styleUrls: ['./dialog-close-expedient.component.scss']
})
export class DialogCloseExpedientComponent implements OnInit {

  public pageStep: number = 1;
  caseFile!:CaseFile;
  caseFileStatus = CaseFileStatus

  constructor(private practiceService:PracticeService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogCloseExpedientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {caseFile:CaseFile},
    private translateService:TranslateService) { }

  ngOnInit(): void {
    this.caseFile = this.data.caseFile;
  }

  closeExpedient(){
    this.caseFile.status = this.caseFileStatus.CLOSED;
    this.practiceService.updateCaseFileChangeStatus(this.caseFile).subscribe(data => {
      this.pageStep = 2;
    })
  }

  closeDialog(){

  }

}
