import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Plan } from 'core-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(@Inject('config') private config: any,
              private httpClient: HttpClient) { }

  getPlans(): Observable<Plan[]> {
      const serverUrl: string = `${this.config.serverUrl}/core/plans/`;
      return this.httpClient.get<Plan[]>(serverUrl);
  }


}
