import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SubscriptionOnboarding } from 'core-models';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(@Inject('config') private config: any,
              private httpClient: HttpClient) { }

  createSubscriptionOnboarding(payload: SubscriptionOnboarding): Observable<any> {
      const serverUrl: string = this.config.serverUrl;
      return this.httpClient.post<any>(serverUrl, payload);
  }

}
