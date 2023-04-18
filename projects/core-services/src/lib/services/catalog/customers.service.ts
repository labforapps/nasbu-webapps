import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Customer,CustomerIntakeRequest } from 'core-models';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(
    @Inject('config') private config: any,
    private httpClient: HttpClient
  ) {}

  getCustomers(subscription: string): Observable<Customer[]> {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/?subscription=${subscription}`;
    return this.httpClient.get<Customer[]>(serverUrl);
  }

  getCustomerById(subscription: string, uuid: string): Observable<Customer> {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${uuid}/?subscription=${subscription}`;
    return this.httpClient.get<Customer>(serverUrl);
  }

  createCustomer(body: Customer): Observable<Customer> {
    console.log(body);
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/`;
    return this.httpClient.post<Customer>(serverUrl, body);
  }

  updateCustomer(subscription: string, uuid: string, body: Customer) {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${uuid}/?subscription=${subscription}`;
    return this.httpClient.patch<any>(serverUrl, body);
  }

  deleteCustomer(subscription: string, uuid: string): Observable<Customer> {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${uuid}/?subscription=${subscription}`;
    return this.httpClient.delete<Customer>(serverUrl);
  }

  createCustomerIntakeRequest(
    body: CustomerIntakeRequest
  ): Observable<CustomerIntakeRequest> {
    console.log(body);
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers_intake_requests/`;
    return this.httpClient.post<CustomerIntakeRequest>(serverUrl, body);
  }

  createCustomerIntake(body: Customer): Observable<Customer[]> {
    console.log(body);
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers_intake_requests/complete_request/`;
    return this.httpClient.post<Customer[]>(serverUrl, body);
  }

  validateRequest(token: string): Observable<any[]> {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers_intake_requests/validate_request/?t=${token}`;
    return this.httpClient.get<any[]>(serverUrl);
  }

  getCustomersAvailableForLink(subscription: string) {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/customers_available_for_link/?subscription=${subscription}`;
    return this.httpClient.get<Customer[]>(serverUrl);
  }

  linkToCustomer(subscription: string, uuid: string, body: Customer) {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${uuid}/link_to_customer/?subscription=${subscription}`;
    return this.httpClient.put<any>(serverUrl, body);
  }

  saveCustomer(customerPayload: Customer): Observable<Customer> {
    let saveOperation$: Observable<Customer>;
    const payload: Customer = { ...customerPayload };
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
    console.log('Form Data',formData);
    return this.httpClient.put<any>(serverUrl, formData);
  }

  getCaseFiles(subscription: string, uuid: string): Observable<Customer[]> {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${uuid}/case_files/?subscription=${subscription}`;
    return this.httpClient.get<Customer[]>(serverUrl);
  }
}
