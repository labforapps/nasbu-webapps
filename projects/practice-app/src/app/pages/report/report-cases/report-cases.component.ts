import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomersService, PracticeService, ReportsService, SecurityService } from 'core-services';
import { Customer, SecurityUser,ReportFormat,DaysPeriod,invoiceStatusDescription, CaseFile, ReportCaseFilePayload, CaseFileStatus } from 'core-models';
import { HelpersService } from '../../../services/helpers.service';
import { MatSelectChange } from '@angular/material/select';
@Component({
  selector: 'app-report-cases',
  templateUrl: './report-cases.component.html',
  styleUrls: ['./report-cases.component.scss']
})
export class ReportCasesComponent implements OnInit {

  selectedSubscription!:any;
  customers!:Customer[];
  securityUsers!:SecurityUser[];
  caseFiles!:CaseFile[];
  reportFormatEnum = ReportFormat;
  caseFileStatusEnum = CaseFileStatus
  daysPeriod = DaysPeriod
  reportPayload!:ReportCaseFilePayload;
  showHeaderMessage:boolean = true;


  constructor(private authService:AuthService,
              private customerService:CustomersService,
              private securityService:SecurityService,
              private reportService:ReportsService,
              private HelpersService:HelpersService,
              private practiceService:PracticeService) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getCustomers();
    this.getSecurityUsers();
    this.getCaseFiles();

    this.setReportPayload();
  }

  setReportPayload(){
    this.reportPayload = {
      subscription: this.selectedSubscription?.ssid.uuid,
      report_name:  'general',
      case_file:    null,
      customer:     null,
      lawyer:       null,
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

  getCaseFiles(){
    this.practiceService.getCaseFiles(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.caseFiles = data;
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


    this.reportService.getReportCaseFiles(this.reportPayload).subscribe(data => {

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
