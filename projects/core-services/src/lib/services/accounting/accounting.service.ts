import { Injectable,Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BillingCharge, Invoice,InvoicePayload, Payment,InvoiceStatus, sendDocument } from 'core-models';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  InvoiceStatus = InvoiceStatus;

  constructor(@Inject('config') private config: any,
  private httpClient: HttpClient) { }

  getInvoices(subscription:string):Observable<Invoice[]>{
    const serverUrl = `${this.config.serverUrl}/accounting/invoices/?subscription=${subscription}`;
    return this.httpClient.get<Invoice[]>(serverUrl).pipe(
      switchMap((invoices:Invoice[]) => {

        invoices.forEach(x => {
          if(x.status === this.InvoiceStatus.PENDING){
            const expiredDate = new Date(x.inv_exp_date + 'T00:00:00').getTime();
            const currentDate = new Date().getTime();
            x.status = expiredDate < currentDate ? this.InvoiceStatus.EXPIRED : this.InvoiceStatus.PENDING;

            const differenceInMilliseconds = expiredDate - currentDate;
            const differenceInDays = differenceInMilliseconds / (24 * 60 * 60 * 1000);

            x.days_late = Math.round(differenceInDays * -1);

          }
        })

        return of(invoices.sort((a, b) => {
          let dateA = new Date(a.inv_date || '').getTime();
          let dateB = new Date(b.inv_date || '').getTime();
          return dateB - dateA;
      }))
      })
    );
  }

  getInvoiceById(subscription:string,uuid:string):Observable<Invoice>{
    const serverUrl = `${this.config.serverUrl}/accounting/invoices/${uuid}/?subscription=${subscription}`;
    return this.httpClient.get<Invoice>(serverUrl);
  }

  createInvoice(invoice:InvoicePayload):Observable<Invoice>{
    const serverUrl = `${this.config.serverUrl}/accounting/invoices/?subscription=${invoice.subscription}`;
    return this.httpClient.post<Invoice>(serverUrl,invoice);
  }

  updateInvoice(invoice:InvoicePayload):Observable<Invoice>{
    const serverUrl = `${this.config.serverUrl}/accounting/invoices/${invoice.uuid}/?subscription=${invoice.subscription}`;
    return this.httpClient.put<Invoice>(serverUrl,invoice);
  }

  saveInvoice(invoice: InvoicePayload): Observable<Invoice> {
    let saveOperation$: Observable<Invoice>;
    const payload: InvoicePayload = { ...invoice };
    if (invoice.uuid != null && invoice.uuid !== '') {
      saveOperation$ = this.updateInvoice(payload);
    } else {
      saveOperation$ = this.createInvoice( payload);
    }
    return saveOperation$;
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

  sendInvoice(document:sendDocument):Observable<sendDocument>{
    const serverUrl = `${this.config.serverUrl}/accounting/invoices/${document.uuid}/resend_invoice/?subscription=${document.subscription}`;
    return this.httpClient.put<sendDocument>(serverUrl,document);
  }

  sendPayment(document:sendDocument):Observable<sendDocument>{
    const serverUrl = `${this.config.serverUrl}/accounting/payments/${document.uuid}/resend_payment/?subscription=${document.subscription}`;
    return this.httpClient.put<sendDocument>(serverUrl,document);
  }

}
