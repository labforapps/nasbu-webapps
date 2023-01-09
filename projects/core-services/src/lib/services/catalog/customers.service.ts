import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from 'core-models';

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

  getCustomerById(subscription: string, id: string): Observable<Customer> {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${id}/?subscription=${subscription}`;
    return this.httpClient.get<Customer>(serverUrl);
  }

  createCustomer(body: Customer): Observable<Customer[]> {
    console.log(body);
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/`;
    return this.httpClient.post<Customer[]>(serverUrl, body);
  }

  updateCustomer(subscription: string, id: string,body:Customer){
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${id}/?subscription=${subscription}`;
    return this.httpClient.patch<any>(serverUrl,body);
  }

  deleteCustomer(subscription: string, id: string): Observable<Customer> {
    const serverUrl: string = `${this.config.serverUrl}/catalog/customers/${id}/?subscription=${subscription}`;
    return this.httpClient.delete<Customer>(serverUrl);
  }
}
