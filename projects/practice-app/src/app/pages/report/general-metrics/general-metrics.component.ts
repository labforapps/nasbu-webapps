import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { ReportsService } from 'core-services';
import { ReportFormat,DaysPeriod, ReportGeneralMetricsPayload, ResponseGeneralReport } from 'core-models';
import { MatSelectChange } from '@angular/material/select';
import { HelpersService } from '../../../services/helpers.service';
@Component({
  selector: 'app-general-metrics',
  templateUrl: './general-metrics.component.html',
  styleUrls: ['./general-metrics.component.scss']
})
export class GeneralMetricsComponent implements OnInit {

  selectedSubscription!:any;
  reportFormatEnum = ReportFormat;
  daysPeriod = DaysPeriod

  reportPayload!:ReportGeneralMetricsPayload;
  responseGeneralReport!:ResponseGeneralReport;

  showHeaderMessage:boolean = true;

  constructor(private authService:AuthService,
              private reportService:ReportsService,
              private HelpersService:HelpersService) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.setReportPayload();

    const dateRange = this.HelpersService.getDateRange(this.daysPeriod[4].code);
    this.reportPayload.start_date = dateRange.startDate
    this.reportPayload.end_date = dateRange.endDate

    this.getGeneralReport()
  }

  setReportPayload(){
    this.reportPayload = {
      subscription: this.selectedSubscription?.ssid.uuid,
      report_name:  'general',
      period:       this.daysPeriod[4].code,
      format:       this.reportFormatEnum.JSON,
      start_date:   null,
      end_date:     null,
    }
  }

  onSelectDateRange(event:MatSelectChange){
    const dateRange = this.HelpersService.getDateRange(event.value);
    this.reportPayload.start_date = dateRange.startDate
    this.reportPayload.end_date = dateRange.endDate
    this.getGeneralReport()
  }

  getGeneralReport(){

    this.reportPayload.start_date = this.reportPayload.start_date ? this.HelpersService.returnDateFormatted(this.reportPayload.start_date || '','YYYY-MM-DD') : null
    this.reportPayload.end_date = this.reportPayload.end_date ? this.HelpersService.returnDateFormatted(this.reportPayload.end_date || '','YYYY-MM-DD') : null

    this.reportService.getReportGeneral(this.reportPayload).subscribe(data => {
      this.responseGeneralReport = data;
    })
  }


}
