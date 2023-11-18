import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomersService, ReportsService, SecurityService } from 'core-services';
import { Customer, SecurityUser,ReportInvoicingPayload,ReportFormat, BillingType, InvoiceStatus,DaysPeriod,invoiceStatusDescription, ReportPaymentsPayload } from 'core-models';
import { HelpersService } from '../../../services/helpers.service';
@Component({
  selector: 'app-report-income',
  templateUrl: './report-income.component.html',
  styleUrls: ['./report-income.component.scss']
})
export class ReportIncomeComponent implements OnInit {

  selectedSubscription!:any;
  customers!:Customer[];
  securityUsers!:SecurityUser[];
  reportFormatEnum = ReportFormat;
  billingTypeEnum = BillingType;
  invoiceStatusEnum = InvoiceStatus;
  daysPeriod = DaysPeriod

  reportPayload!:ReportPaymentsPayload;

  showHeaderMessage:boolean = true;

  constructor(private authService:AuthService,
              private customerService:CustomersService,
              private securityService:SecurityService,
              private reportService:ReportsService,
              private HelpersService:HelpersService) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getCustomers();
    this.getSecurityUsers();

    this.setReportPayload();
  }

  setReportPayload(){
    this.reportPayload = {
      subscription: this.selectedSubscription?.ssid.uuid,
      report_name:  'general',
      customer:     null,
      lawyer:       null,
      billing_type: null,
      period:       null,
      format:       this.reportFormatEnum.HTML,
      start_date:   null,
      end_date:     null,
    }
  }

  getCustomers() {
    this.customerService.getCustomers(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.customers = data;
    })
  }

  getSecurityUsers(){
    this.securityService.getSecurityUsers(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.securityUsers = data;
    })
  }

  exportReport(){

    this.reportService.getReportPayments(this.reportPayload).subscribe(data => {

      if(this.reportPayload.format === this.reportFormatEnum.HTML){
        this.HelpersService.openNewTabWithHtml(data)
      }
      else{
        this.HelpersService.downloadDocument(data);
      }

    })
  }

  returnInvoiceStatusDescription(invoiceStatus:string){
    return invoiceStatusDescription.get(invoiceStatus)
  }

  hideHeaderMessage(){
    this.showHeaderMessage = false
  }

  cleanFilters(){
    this.setReportPayload();
  }


}
