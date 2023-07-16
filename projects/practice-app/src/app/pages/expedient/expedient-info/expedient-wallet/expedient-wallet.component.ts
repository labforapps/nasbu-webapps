import { Component, Input, OnInit } from '@angular/core';
import { CaseFile } from 'core-models';

@Component({
  selector: 'app-expedient-wallet',
  templateUrl: './expedient-wallet.component.html',
  styleUrls: ['./expedient-wallet.component.scss']
})
export class ExpedientWalletComponent implements OnInit {

  @Input() caseFile!:CaseFile

  constructor() { }
  ngOnInit(): void {
    console.log(this.caseFile);
  }

}
