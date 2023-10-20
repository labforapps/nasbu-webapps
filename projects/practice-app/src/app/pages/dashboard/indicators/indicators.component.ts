import { Component, Input, OnInit } from '@angular/core';
import { CaseFile, CaseFileStatus, Invoice, Payment,Task, TaskStatus } from 'core-models';
import * as moment from 'moment';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.scss']
})
export class IndicatorsComponent implements OnInit {

  dashboardInfo = {};

  @Input() caseFiles!:CaseFile[];
  caseFileStatus = CaseFileStatus;
  @Input() invoices!:Invoice[];
  @Input() payments!:Payment[];
  @Input() tasks!:Task[];
  taskStatus = TaskStatus;

  constructor() { }

  ngOnInit(): void {
  }

  get emptyIndicators() {
    return (!this.caseFiles || this.caseFiles.length == 0) && (!this.invoices || this.invoices.length == 0)
    && (!this.payments || this.payments.length == 0)  && (!this.tasks || this.tasks.length == 0)
  }

  get openCaseFiles(){
    return this.caseFiles ? this.caseFiles.filter(x => x.status === this.caseFileStatus.OPEN).length : 0;
  }

  get closedCaseFiles(){
    return this.caseFiles ? this.caseFiles.filter(x => x.status === this.caseFileStatus.CLOSED).length : 0;
  }

  get totalBilled(){
    return this.invoices ?  this.invoices.filter(item => {
      const invoiceDate = moment(item.inv_date);
      return invoiceDate.isSame(moment(), 'month');
  })
  .reduce((accumulator, current) => accumulator + parseFloat(current.net_amt), 0) : 0;

  }

  get totalAmountCollected(){
      return this.payments ?  this.payments.filter(item => {
        const invoiceDate = moment(item.payment_date);
        return invoiceDate.isSame(moment(), 'month');
    })
    .reduce((accumulator, current) => accumulator + parseFloat(current.total_amt), 0) : 0;
  }

  get completedTasks() {
    return this.tasks ? this.tasks.filter(x => {
      const taskDate = moment(x.created_at)
      return x.status === this.taskStatus.CLOSED && taskDate.isSame(moment(), 'month')
    }).length : 0;
  }

  get pendingTasks() {
    return this.tasks ? this.tasks.filter(x => {
      const taskDate = moment(x.created_at)
      return x.status === this.taskStatus.OPEN && taskDate.isSame(moment(), 'month')
    }).length : 0;
  }

  get overdueTasks() {
    return this.tasks ? this.tasks.filter(x => {
      const taskDate = moment(x.created_at)
      return x.overdue === true && taskDate.isSame(moment(), 'month')
    }).length : 0;
  }

}
