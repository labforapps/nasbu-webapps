import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SubscriptionOnboarding, Subscription, SubscriptionPayload } from 'core-models';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(@Inject('config') private config: any,
              private httpClient: HttpClient) { }

  getSubscription(uuid:string): Observable<Subscription> {
    const serverUrl = `${this.config.serverUrl}/subscription/${uuid}/`;
    return this.httpClient.get<Subscription>(serverUrl);
  }

  createSubscriptionOnboarding(payload: SubscriptionOnboarding): Observable<Subscription> {
      const serverUrl: string = `${this.config.serverUrl}/subscription/onboarding/`;
      return this.httpClient.post<Subscription>(serverUrl, payload);
  }

  updateSubscription(subscriptionPayload: SubscriptionPayload,uuid:string): Observable<Subscription> {

    const serverUrl = `${this.config.serverUrl}/subscription/${uuid}/`;
    const updateOperation$ = this.httpClient.put<Subscription>(serverUrl,subscriptionPayload);

    return updateOperation$.pipe(
      switchMap((item: Subscription) => {
        if (subscriptionPayload.logoFile) {
          return this.uploadImage(item.uuid);
        }
        return of(item);
      })
    );
  }

  uploadImage(uuid:string){
    const serverUrl = `${this.config.serverUrl}/subscription/${uuid}/upload_image/`;
    return this.httpClient.get<any>(serverUrl);
  }
}
