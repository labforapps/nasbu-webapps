import { Component, Input, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { AuthService, CoreService, SubscriptionService } from 'core-services';
import { Plan, Subscription, SubscriptionBillingInvoice, SubscriptionBillingInvoiceStatus } from 'core-models';
import * as moment from 'moment'
import { Router } from '@angular/router';
import { HelpersService } from 'projects/practice-app/src/app/services/helpers.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  displayedColumns: string[] = ['select', 'period', 'status','start_date','end_date','amount','action'];
  dataSource = new MatTableDataSource<SubscriptionBillingInvoice>();
  selection = new SelectionModel<SubscriptionBillingInvoice>(true, []);
  @Input() subscription!:Subscription;
  showSubscriptionBillingHistory:boolean = false
  selectedPlan!:Plan | undefined
  subscriptionBillingInvoices!:SubscriptionBillingInvoice[]
  subscriptionBillingInvoiceStatus = SubscriptionBillingInvoiceStatus

  constructor(private coreService:CoreService,
              private router:Router,
              private subscriptionService:SubscriptionService,
              private helperService:HelpersService) { }

  ngOnInit(): void {
    this.getPlans()
    this.getSubscriptionBillingInvoices()
  }

  getPlans(){
    this.coreService.getPlans().subscribe(data => {
      this.selectedPlan = data.find(x => x.uuid === this.subscription.plan)
    })
  }

  getSubscriptionBillingInvoices(){
    this.subscriptionService.getSubscriptionBillingInvoice(this.subscription.uuid).subscribe({
      next: (data) => {
        this.subscriptionBillingInvoices = data
        this.dataSource.data = data
      }
    })
  }

  returnExpiredDate(){
    return moment(new Date(this.subscription.effective_date)).add(30, 'd').toDate()
  }

  viewSubscriptionBillingHistory(){
    this.showSubscriptionBillingHistory = true
  }

  viewSubscriptionPlan(){
    this.showSubscriptionBillingHistory = false
  }

  downloadPdf(subscriptionBillingInvoice:SubscriptionBillingInvoice){
   this.subscriptionService.downloadSubscriptionBillingInvoice(subscriptionBillingInvoice).subscribe({
    next: (data) => this.helperService.downloadDocument(data)
   })
  }

  returnMonthDateDescription(date:string){
    return formatDate(date,'MMMM','es-ES')
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
