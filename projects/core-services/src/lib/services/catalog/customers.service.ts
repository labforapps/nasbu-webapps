import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { CaseFile, Customer,CustomerIntakeRequest,CustomerIntakeValidateRequest, TypeCustomer,Task,TaskType, Invoice, InvoiceStatus, CustomerWalletSummary, CustomerPayload } from 'core-models';
import { CommonService } from '../common';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {

  typeCustomer = TypeCustomer
  InvoiceStatus = InvoiceStatus;

  constructor(
    @Inject('config') private config: any,
    private httpClient: HttpClient,
    private commonService:CommonService,
  ) {}

  getCustomers(subscription: string): Observable<Customer[]> {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/?subscription=${subscription}`;
    return this.httpClient.get<Customer[]>(serverUrl).pipe(
      map((customers:Customer[]) => {
        return customers.sort((a, b) => {
          const companyNameA = a.company_name || '';
          const companyNameB = b.company_name || '';

          const nameA = a.type === this.typeCustomer.person && companyNameA === '' ? a.first_name.toLowerCase() : companyNameA.toLowerCase();
          const nameB = b.type === this.typeCustomer.person && companyNameB === '' ? b.first_name.toLowerCase() : companyNameB.toLowerCase();

          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        });
      })
    );
  }

  getCustomerById(subscription: string, uuid: string): Observable<Customer> {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${uuid}/?subscription=${subscription}`;
    return this.httpClient.get<Customer>(serverUrl);
  }

  createCustomer(body: CustomerPayload): Observable<Customer> {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/`;
    return this.httpClient.post<Customer>(serverUrl, body);
  }

  updateCustomer(subscription: string, uuid: string, body: CustomerPayload) {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${uuid}/?subscription=${subscription}`;
    return this.httpClient.patch<any>(serverUrl, body);
  }

  deleteCustomer(subscription: string, uuid: string): Observable<Customer> {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${uuid}/?subscription=${subscription}`;
    return this.httpClient.delete<Customer>(serverUrl);
  }

  createCustomerIntakeRequest(body: CustomerIntakeRequest): Observable<CustomerIntakeRequest> {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers_intake_requests/`;
    return this.httpClient.post<CustomerIntakeRequest>(serverUrl, body);
  }

  createCustomerIntake(body: Customer): Observable<Customer[]> {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers_intake_requests/complete_request/`;
    return this.httpClient.post<Customer[]>(serverUrl, body);
  }

  completeCompanyRequest(body: any,subscription:string): Observable<Customer[]> {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers_intake_requests/complete_company_request/?subscription=${subscription}`;
    return this.httpClient.post<Customer[]>(serverUrl, body);
  }

  validateRequest(token: string): Observable<CustomerIntakeValidateRequest> {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers_intake_requests/validate_request/?t=${token}`;
    return this.httpClient.get<CustomerIntakeValidateRequest>(serverUrl);
  }

  getCustomersAvailableForLink(subscription: string) {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/customers_available_for_link/?subscription=${subscription}`;
    return this.httpClient.get<Customer[]>(serverUrl);
  }

  linkToCustomer(subscription: string, uuid: string, body: Customer) {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${uuid}/link_to_customer/?subscription=${subscription}`;
    return this.httpClient.put<any>(serverUrl, body);
  }

  saveCustomer(customerPayload: CustomerPayload): Observable<Customer> {
    let saveOperation$: Observable<Customer>;
    const payload: CustomerPayload = { ...customerPayload };
    if (customerPayload.uuid != null && customerPayload.uuid !== '') {
      saveOperation$ = this.updateCustomer(payload.subscription || '',payload.uuid || '', payload);
    } else {
      saveOperation$ = this.createCustomer(payload);
    }
    return saveOperation$.pipe(
      switchMap((item: Customer) => {
        if (customerPayload.image) {
          return this.uploadImage(payload.subscription || '',item.uuid || '', customerPayload.image);
        }
        return of(item);
      })
    );
  }

  uploadImage(subscription: string, uuid: string, image: any) {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${uuid}/upload_image/?subscription=${subscription}`;
    const formData = new FormData();
    formData.append('file', image);
    formData.append('subscription', subscription);
    return this.httpClient.put<any>(serverUrl, formData);
  }

  getCaseFilesByCustomer(subscription:string,uuid:string):Observable<CaseFile[]>{
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${uuid}/case_files?subscription=${subscription}`;
    return this.httpClient.get<CaseFile[]>(serverUrl);
  }

  getTasksByCustomer(subscription:string,uuid:string):Observable<Task[]>{
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${uuid}/tasks?subscription=${subscription}`;
    return this.httpClient.get<Task[]>(serverUrl).pipe(
      switchMap((tasks: Task[]) => {
            return of(tasks.sort((a, b) => {
              let dateA = new Date(a.created_at || '').getTime();
              let dateB = new Date(b.created_at || '').getTime();
              return dateB - dateA;
          }));
      })
    );
  }

  getInvoicesByCustomer(customer:Customer){
    const serverUrl = `${this.config.serverUrl}/catalog/customers/${customer.uuid}/invoices?subscription=${customer.subscription}`;
    return this.httpClient.get<Invoice[]>(serverUrl).pipe(
      switchMap((invoices:Invoice[]) => {

        invoices.forEach(x => {
          if(x.status === this.InvoiceStatus.PENDING){
            const expiredDate = new Date(x.inv_exp_date + 'T00:00:00').getTime();
            const currentDate = new Date().getTime();
            x.status = expiredDate < currentDate ? this.InvoiceStatus.EXPIRED : this.InvoiceStatus.PENDING;
          }
        })

        return of(invoices.sort((a, b) => {
          let dateA = new Date(a.created_at || '').getTime();
          let dateB = new Date(b.created_at || '').getTime();
          return dateB - dateA;
      }))
      })
    );
  }

  getWalletSummaryByCustomerId(subscription:string,uuid:string){
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${uuid}/wallet_summary?subscription=${subscription}`;
    return this.httpClient.get<CustomerWalletSummary>(serverUrl);
  }


}
