import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomersService, ReportsService, SecurityService } from 'core-services';
import { Customer, SecurityUser,ReportFormat, BillingType, InvoiceStatus,DaysPeriod,
         invoiceStatusDescription, ReportPaymentsPayload } from 'core-models';
import { HelpersService } from '../../../services/helpers.service';
import { MatSelectChange } from '@angular/material/select';
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
  daysPeriod = DaysPeriod;
  reportPayload!:ReportPaymentsPayload;
  showHeaderMessage:boolean = true;
  clientOption:number = 2;
  billingTypeOption:number = 1;

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

  onSelectDateRange(event:MatSelectChange){
    const dateRange = this.HelpersService.getDateRange(event.value)
    this.reportPayload.start_date = dateRange.startDate
    this.reportPayload.end_date = dateRange.endDate
  }

  exportReport(){

    this.reportPayload.start_date = this.reportPayload.start_date ? this.HelpersService.returnDateFormatted(this.reportPayload.start_date || '','YYYY-MM-DD') : null
    this.reportPayload.end_date = this.reportPayload.end_date ? this.HelpersService.returnDateFormatted(this.reportPayload.end_date || '','YYYY-MM-DD') : null

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
    this.exportReport();
  }


}
