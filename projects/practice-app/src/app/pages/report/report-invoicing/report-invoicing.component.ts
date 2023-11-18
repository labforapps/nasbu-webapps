import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomersService, ReportsService, SecurityService } from 'core-services';
import { Customer, SecurityUser,ReportInvoicingPayload,ReportFormat, BillingType, InvoiceStatus,DaysPeriod,invoiceStatusDescription } from 'core-models';
import { HelpersService } from '../../../services/helpers.service';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-report-invoicing',
  templateUrl: './report-invoicing.component.html',
  styleUrls: ['./report-invoicing.component.scss']
})
export class ReportInvoicingComponent implements OnInit {

  selectedSubscription!:any;
  customers!:Customer[];
  securityUsers!:SecurityUser[];
  reportFormatEnum = ReportFormat;
  billingTypeEnum = BillingType;
  invoiceStatusEnum = InvoiceStatus;
  daysPeriod = DaysPeriod
  reportPayload!:ReportInvoicingPayload;
  showHeaderMessage:boolean = true;
  clientOption!:number;
  lawyerOption!:number;
  billingTypeOption!:number;
  invoiceStatusOption!:number;

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
      status:       null,
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

    this.reportService.getReportInvoices(this.reportPayload).subscribe(data => {

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

  getRadioGroupValue(radioGroup: MatRadioGroup): string {
    return radioGroup ? radioGroup.value : '';
  }

}
