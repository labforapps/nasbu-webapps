import { Component, Input, OnInit } from '@angular/core';
import { Summary, SummaryDetail } from 'core-models';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.scss']
})
export class IndicatorsComponent implements OnInit {

  dashboardInfo = {};
  @Input() accountSummary!:Summary[];

  constructor() { }

  ngOnInit(): void {
  }

  get emptyIndicators() {
    return this.accountSummary.length === 0;
  }

  get sectionPracticeCaseFiles():SummaryDetail {
    return this.accountSummary[0].detail;
  }

  get sectionAccountingInvoices():SummaryDetail {
    return this.accountSummary[1].detail;
  }

  get sectionAccountingPayments():SummaryDetail {
    return this.accountSummary[2].detail;
  }

  get sectionPracticeTasks():SummaryDetail {
    return this.accountSummary[3].detail;
  }

}
