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
  filteredCustomers: Customer[] = [];
  filteredCaseFiles: CaseFile[] = [];
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
        this.customers = data;
        this.filteredCustomers = data;
      }
    })
  }

  getCaseFiles(){
    this.practiceService.getCaseFiles(this.selectedSubscription?.ssid.uuid).subscribe({
      next: (data) => {
        this.caseFiles = data;
        this.filteredCaseFiles = data;
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

  onCustomerChange(customerUuid: string | null) {
    if (!customerUuid) {
      this.filteredCaseFiles = this.caseFiles;
    } else {
      this.filteredCaseFiles = this.caseFiles.filter(cf => cf.customer.uuid === customerUuid);
      if (this.reportPayload.case_file && !this.filteredCaseFiles.find(cf => cf.uuid === this.reportPayload.case_file)) {
        this.reportPayload.case_file = null;
      }
    }
  }

  onCaseFileChange(caseFileUuid: string | null) {
    if (!caseFileUuid) {
      this.filteredCustomers = this.customers;
    } else {
      const selected = this.caseFiles.find(cf => cf.uuid === caseFileUuid);
      if (selected) {
        this.filteredCustomers = this.customers.filter(c => c.uuid === selected.customer.uuid);
        this.reportPayload.customer = selected.customer.uuid ?? null;
      }
    }
  }

  onSelectAllCustomers() {
    this.reportPayload.customer = null;
    this.filteredCaseFiles = this.caseFiles;
  }

  onSelectAllCaseFiles() {
    this.reportPayload.case_file = null;
    this.filteredCustomers = this.customers;
  }

  cleanFilters(){
    this.setReportPayload();

    this.clientOption = 2;
    this.caseFileOption = 2;
    this.caseFileStatusOption = 2;
    this.filteredCustomers = this.customers;
    this.filteredCaseFiles = this.caseFiles;
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
