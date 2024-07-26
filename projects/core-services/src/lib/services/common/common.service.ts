import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Country,Occupation, PaymentGateway, TaskType } from 'core-models';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    @Inject('config') private config: any,
    private httpClient: HttpClient
  ) {}

  getCountries(): Observable<Country[]> {
    const serverUrl: string = `${this.config.serverUrl}/common/countries/`;
    return this.httpClient.get<Country[]>(serverUrl).pipe(
      map((countries:Country[]) => {
        return countries.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }
      });
      })
    );
  }

   getOccupations(): Observable<Occupation[]> {
    const serverUrl: string = `${this.config.serverUrl}/common/occupations/`;
    return this.httpClient.get<Occupation[]>(serverUrl);
  }

  getTaskTypes():Observable<TaskType[]>{
    const serverUrl: string = `${this.config.serverUrl}/common/task_types/`;
    return this.httpClient.get<TaskType[]>(serverUrl);
  }

  createTaskType(payload:TaskType):Observable<TaskType>{
    const serverUrl: string = `${this.config.serverUrl}/common/task_types/`;
    return this.httpClient.post<TaskType>(serverUrl,payload);
  }

  deleteTaskType(payload:TaskType):Observable<TaskType>{
    const serverUrl: string = `${this.config.serverUrl}/common/task_types/${payload.uuid}`;
    return this.httpClient.delete<TaskType>(serverUrl);
  }

  getPaymentGateways(): Observable<PaymentGateway[]> {
    const serverUrl: string = `${this.config.serverUrl}/common/payment_gateways/`;
    return this.httpClient.get<PaymentGateway[]>(serverUrl);
  }

}
