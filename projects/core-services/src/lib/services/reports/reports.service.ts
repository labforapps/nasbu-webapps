import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportCaseFilePayload, ReportCustomerWalletDetails, ReportFormat, ReportGeneralMetricsPayload, ReportInvoicingPayload, ReportPaymentsPayload, ResponseGeneralReport } from 'core-models';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  reportFormat = ReportFormat

  constructor(@Inject('config') private config: any,
                      private http: HttpClient) { }


  getReportInvoices(body:ReportInvoicingPayload): Observable<any> {

    const responseType = body.format === this.reportFormat.HTML ? {responseType: 'text' as 'json'} : {responseType: 'blob' as 'json'} ;
    const serverUrl = `${this.config.serverUrl}/reports/invoices/`;
    return this.http.post(serverUrl,body,responseType);
  }

  getReportCaseFiles(body:ReportCaseFilePayload): Observable<any> {

    const responseType = body.format === this.reportFormat.HTML ? {responseType: 'text' as 'json'} : {responseType: 'blob' as 'json'} ;
    const serverUrl = `${this.config.serverUrl}/reports/case_files/`;
    return this.http.post(serverUrl,body,responseType);
  }

  getReportPayments(body:ReportPaymentsPayload): Observable<any> {

    const responseType = body.format === this.reportFormat.HTML ? {responseType: 'text' as 'json'} : {responseType: 'blob' as 'json'} ;
    const serverUrl = `${this.config.serverUrl}/reports/payments/`;
    return this.http.post(serverUrl,body,responseType);
  }

  getReportGeneral(body:ReportGeneralMetricsPayload): Observable<ResponseGeneralReport> {
    const serverUrl = `${this.config.serverUrl}/reports/general/`;
    return this.http.post<ResponseGeneralReport>(serverUrl,body);
  }

  getReportCustomerWalletDetails(body:ReportCustomerWalletDetails): Observable<ReportCustomerWalletDetails> {
    const responseType = body.format === this.reportFormat.HTML ? {responseType: 'text' as 'json'} : {responseType: 'blob' as 'json'} ;
    const serverUrl = `${this.config.serverUrl}/reports/customer_wallet_details/`;
    return this.http.post<ReportCustomerWalletDetails>(serverUrl,body,responseType);
  }
}
