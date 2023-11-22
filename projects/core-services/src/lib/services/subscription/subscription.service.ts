import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SubscriptionOnboarding, Subscription, SubscriptionPayload, SubscriptionBillingFee, OnboardingTokenizationSessionResult, SubscriptionPaymentMethod } from 'core-models';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(@Inject('config') private config: any,
              private httpClient: HttpClient) { }

  getOnboardingPmTokenSession(uuid: string): Observable<OnboardingTokenizationSessionResult> {
    const serverUrl = `${this.config.serverUrl}/subscription/onboarding/tokenization_session/`;
    const payload = {uuid};
    return this.httpClient.post<OnboardingTokenizationSessionResult>(serverUrl, payload);
  }

  getSubscription(uuid:string): Observable<Subscription> {
    const serverUrl = `${this.config.serverUrl}/subscription/me/${uuid}/`;
    return this.httpClient.get<Subscription>(serverUrl);
  }

  createSubscriptionOnboarding(payload: any): Observable<Subscription> {
      const serverUrl: string = `${this.config.serverUrl}/subscription/onboarding/`;
      return this.httpClient.post<Subscription>(serverUrl, payload);
  }

  updateSubscription(subscriptionPayload: SubscriptionPayload,uuid:string): Observable<Subscription> {

    const serverUrl = `${this.config.serverUrl}/subscription/me/${uuid}/`;
    const updateOperation$ = this.httpClient.put<Subscription>(serverUrl,subscriptionPayload);

    return updateOperation$.pipe(
      switchMap((item: Subscription) => {
          return this.uploadImage(item.uuid,subscriptionPayload.logoFile);

      })
    );
  }

  uploadImage(subscription:string,image:File){
    const serverUrl = `${this.config.serverUrl}/subscription/me/${subscription}/upload_image/?subscription=${subscription}`;
    const formData = new FormData();
    formData.append('file', image);
    formData.append('subscription', subscription);
    return this.httpClient.put<any>(serverUrl,formData);
  }

  getSubscriptionBillingFee(subscription:string):Observable<SubscriptionBillingFee[]>{
    const serverUrl = `${this.config.serverUrl}/subscription/billing_fees/?subscription=${subscription}`;
    return this.httpClient.get<SubscriptionBillingFee[]>(serverUrl);
  }

  createSubscriptionBillingFee(subscription:string,subscriptionBillingFeePayload:SubscriptionBillingFee):Observable<SubscriptionBillingFee>{
    const serverUrl = `${this.config.serverUrl}/subscription/billing_fees/?subscription=${subscription}`;
    return this.httpClient.post<SubscriptionBillingFee>(serverUrl,subscriptionBillingFeePayload);
  }

  getSubscriptionBillingFeeById(subscription:string,uuid:string):Observable<SubscriptionBillingFee>{
    const serverUrl = `${this.config.serverUrl}/subscription/billing_fees/${uuid}/?subscription=${subscription}`;
    return this.httpClient.get<SubscriptionBillingFee>(serverUrl);
  }

  updateSubscriptionBillingFee(subscription:string,uuid:string,subscriptionBillingFeePayload:SubscriptionBillingFee):Observable<SubscriptionBillingFee>{
    const serverUrl = `${this.config.serverUrl}/subscription/billing_fees/${uuid}/?subscription=${subscription}`;
    return this.httpClient.put<SubscriptionBillingFee>(serverUrl,subscriptionBillingFeePayload);
  }

  deleteSubscriptionBillingFee(subscription:string,uuid:string){
    const serverUrl = `${this.config.serverUrl}/subscription/billing_fees/${uuid}/?subscription=${subscription}`;
    return this.httpClient.delete<SubscriptionBillingFee>(serverUrl);
  }

  getSubscriptionPaymentMethods(subscription: string): Observable<SubscriptionPaymentMethod[]> {
    const serverUrl = `${this.config.serverUrl}/subscription/payment_methods/?subscription=${subscription}`;
    return this.httpClient.get<SubscriptionPaymentMethod[]>(serverUrl);
  }

  createPaymentMethodTokenizationSession(): Observable<OnboardingTokenizationSessionResult> {
    const serverUrl = `${this.config.serverUrl}/subscription/payment_methods/tokenization_session/`;
    return this.httpClient.get<OnboardingTokenizationSessionResult>(serverUrl);
  }



}
