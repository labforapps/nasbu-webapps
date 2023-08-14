import { Injectable,Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BillingCharge, Invoice,InvoicePayload, Payment } from 'core-models';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  constructor(@Inject('config') private config: any,
  private httpClient: HttpClient) { }

  getInvoices(subscription:string):Observable<Invoice[]>{
    const serverUrl = `${this.config.serverUrl}/accounting/invoices/?subscription=${subscription}`;
    return this.httpClient.get<Invoice[]>(serverUrl);
  }

  getInvoiceById(subscription:string):Observable<Invoice[]>{
    const serverUrl = `${this.config.serverUrl}/accounting/invoices/?subscription=${subscription}`;
    return this.httpClient.get<Invoice[]>(serverUrl);
  }

  createInvoice(invoice:InvoicePayload):Observable<Invoice[]>{
    const serverUrl = `${this.config.serverUrl}/accounting/invoices/?subscription=${invoice.subscription}`;
    return this.httpClient.post<Invoice[]>(serverUrl,invoice);
  }

  updateInvoice(subscription:string):Observable<Invoice[]>{
    const serverUrl = `${this.config.serverUrl}/accounting/invoices/?subscription=${subscription}`;
    return this.httpClient.get<Invoice[]>(serverUrl);
  }

  deleteInvoice(subscription:string,uuid:string):Observable<Invoice[]>{
    const serverUrl = `${this.config.serverUrl}/accounting/invoices/${uuid}/?subscription=${subscription}`;
    return this.httpClient.delete<Invoice[]>(serverUrl);
  }

  getInvoicePayments(subscription:string,uuid:string):Observable<Payment[]>{
    const serverUrl = `${this.config.serverUrl}/accounting/invoices/${uuid}/payments/?subscription=${subscription}`;
    return this.httpClient.get<Payment[]>(serverUrl);
  }

  createPayment(subscription:string,payload:Payment):Observable<Payment>{
    const serverUrl = `${this.config.serverUrl}/accounting/payments/?subscription=${subscription}`;
    return this.httpClient.post<Payment>(serverUrl,payload);
  }

  deletePayment(subscription:string,uuid:string):Observable<Payment>{
    const serverUrl = `${this.config.serverUrl}/accounting/payments/${uuid}/?subscription=${subscription}`;
    return this.httpClient.delete<Payment>(serverUrl);
  }

  getPendingBillingCharges(subscription:string):Observable<BillingCharge[]>{
    const serverUrl = `${this.config.serverUrl}/accounting/billing_charges/pendings/?subscription=${subscription}`;
    return this.httpClient.get<BillingCharge[]>(serverUrl);
  }

}
