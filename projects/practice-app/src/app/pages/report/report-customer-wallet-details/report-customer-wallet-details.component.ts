import { Component, OnInit } from '@angular/core';
import { CaseFile, Customer, ReportCustomerWalletDetails, ReportFormat,DaysPeriod } from 'core-models';
import { AuthService, CustomersService, PracticeService, ReportsService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-report-customer-wallet-details',
  templateUrl: './report-customer-wallet-details.component.html',
  styleUrls: ['./report-customer-wallet-details.component.scss']
})
export class ReportCustomerWalletDetailsComponent implements OnInit {

  selectedSubscription!:any;
  customers!:Customer[];
  caseFiles!:CaseFile[];
  reportPayload!:ReportCustomerWalletDetails
  reportFormatEnum = ReportFormat;
  showHeaderMessage:boolean = true;
  clientOption:number = 2;
  caseFileOption:number = 2;
  caseFileStatusOption:number = 2;
  daysPeriod = DaysPeriod

  constructor(private customerService:CustomersService,
              private authService:AuthService,
              private practiceService:PracticeService,
              private helpersService:HelpersService,
              private reportService:ReportsService
  ) {
  }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getCustomers()
    this.getCaseFiles()
    this.setReportPayload()
  }

  setReportPayload(){
    this.reportPayload = {
      subscription: this.selectedSubscription?.ssid.uuid,
      report_name:  'customer_wallet_details',
      case_file:    null,
      customer:     null,
      period:       null,
      format:       this.reportFormatEnum.HTML,
      start_date:   this.helpersService.getDateRange().startDate,
      end_date:     this.helpersService.getDateRange().endDate
    }
  }

  getCustomers(){
    this.customerService.getCustomers(this.selectedSubscription?.ssid.uuid).subscribe({
      next: (data) => {
        this.customers = data
      }
    })
  }

  getCaseFiles(){
    this.practiceService.getCaseFiles(this.selectedSubscription?.ssid.uuid).subscribe({
      next: (data) => {
        this.caseFiles = data
      }
    })
  }

  onSelectDateRange(event:MatSelectChange){
    const dateRange = this.helpersService.getDateRange(event.value)
    this.reportPayload.start_date = dateRange.startDate
    this.reportPayload.end_date = dateRange.endDate
  }

  hideHeaderMessage(){
    this.showHeaderMessage = false
  }

  cleanFilters(){
    this.setReportPayload();

    this.clientOption = 2;
    this.caseFileOption = 2;
    this.caseFileStatusOption = 2;
  }

  exportReport(){

    this.reportPayload.start_date = this.reportPayload.start_date ? this.helpersService.returnDateFormatted(this.reportPayload.start_date || '','YYYY-MM-DD') : null
    this.reportPayload.end_date = this.reportPayload.end_date ? this.helpersService.returnDateFormatted(this.reportPayload.end_date || '','YYYY-MM-DD') : null

    if(!this.reportPayload.start_date || !this.reportPayload.end_date){
      this.helpersService.showMessageRequiredFields()
      return;
    }

    this.reportService.getReportCustomerWalletDetails(this.reportPayload).subscribe(data => {

      if(this.reportPayload.format === this.reportFormatEnum.HTML){
        this.helpersService.openNewTabWithHtml(data)
      }
      else{
        this.helpersService.downloadDocument(data);
      }

    })
  }

}
