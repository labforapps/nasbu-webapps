import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SubscriptionOnboarding, Subscription, SubscriptionPayload, SubscriptionBillingFee, OnboardingTokenizationSessionResult, SubscriptionPaymentMethod, SubscriptionPaymentMethodPayload, CreateSubscriptionPaymentGateway, SubscriptionPaymentGateway, SubscriptionBillingInvoice, ChangePlanRequest } from 'core-models';
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
         if(subscriptionPayload.logoFile){
          return this.uploadImage(item.uuid,subscriptionPayload.logoFile);
         }
         return of(item)
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

  getSubscriptionBillingFeeById(subscription:string,uuid:string):Observable<SubscriptionBillingFee>{
    const serverUrl = `${this.config.serverUrl}/subscription/billing_fees/${uuid}/?subscription=${subscription}`;
    return this.httpClient.get<SubscriptionBillingFee>(serverUrl);
  }

  createSubscriptionBillingFee(subscription:string,subscriptionBillingFeePayload:SubscriptionBillingFee):Observable<SubscriptionBillingFee>{
    const serverUrl = `${this.config.serverUrl}/subscription/billing_fees/?subscription=${subscription}`;
    return this.httpClient.post<SubscriptionBillingFee>(serverUrl,subscriptionBillingFeePayload);
  }

  updateSubscriptionBillingFee(subscription:string,uuid:string,subscriptionBillingFeePayload:SubscriptionBillingFee):Observable<SubscriptionBillingFee>{
    const serverUrl = `${this.config.serverUrl}/subscription/billing_fees/${uuid}/?subscription=${subscription}`;
    return this.httpClient.put<SubscriptionBillingFee>(serverUrl,subscriptionBillingFeePayload);
  }

  saveSubscriptionBillingFee(subscriptionBillingFee:SubscriptionBillingFee){

    let saveOperation$: Observable<SubscriptionBillingFee>;
    const payload: SubscriptionBillingFee = { ...subscriptionBillingFee };
    if (subscriptionBillingFee.uuid != null && subscriptionBillingFee.uuid !== '') {
      saveOperation$ = this.updateSubscriptionBillingFee(subscriptionBillingFee.subscription,subscriptionBillingFee.uuid,payload);
    } else {
      saveOperation$ = this.createSubscriptionBillingFee(payload.subscription, payload);
    }
    return saveOperation$;

  }

  deleteSubscriptionBillingFee(subscription:string,uuid:string){
    const serverUrl = `${this.config.serverUrl}/subscription/billing_fees/${uuid}/?subscription=${subscription}`;
    return this.httpClient.delete<SubscriptionBillingFee>(serverUrl);
  }

  getSubscriptionPaymentMethods(subscription: string): Observable<SubscriptionPaymentMethod[]> {
    const serverUrl = `${this.config.serverUrl}/subscription/payment_methods/?subscription=${subscription}`;
    return this.httpClient.get<SubscriptionPaymentMethod[]>(serverUrl);
  }

  createPaymentMethodTokenizationSession(subscriptionId: string): Observable<OnboardingTokenizationSessionResult> {
    const serverUrl = `${this.config.serverUrl}/subscription/payment_methods/tokenization_session/?subscription=${subscriptionId}`;
    return this.httpClient.get<OnboardingTokenizationSessionResult>(serverUrl);
  }

  createSubscriptionPaymentMethod(payload: SubscriptionPaymentMethodPayload): Observable<SubscriptionPaymentMethod> {
    const serverUrl = `${this.config.serverUrl}/subscription/payment_methods/`;
    return this.httpClient.post<SubscriptionPaymentMethod>(serverUrl, payload);
  }

  setSubscriptionPaymentMethodAsDefault(subscription: string, paymentMethodId: string): Observable<SubscriptionPaymentMethod> {
    const serverUrl = `${this.config.serverUrl}/subscription/payment_methods/${paymentMethodId}/set_as_default/?subscription=${subscription}`;
    return this.httpClient.get<SubscriptionPaymentMethod>(serverUrl);
  }

  getSubscriptionPaymentGateway(subscription: string): Observable<SubscriptionPaymentGateway[]> {
    const serverUrl = `${this.config.serverUrl}/subscription/payment_gateways/?subscription=${subscription}`;
    return this.httpClient.get<SubscriptionPaymentGateway[]>(serverUrl);
  }

  createSubscriptionPaymentGateway(payload:CreateSubscriptionPaymentGateway): Observable<SubscriptionPaymentGateway> {
    const serverUrl = `${this.config.serverUrl}/subscription/payment_gateways/?subscription=${payload.subscription}`;
    return this.httpClient.post<SubscriptionPaymentGateway>(serverUrl,payload);
  }

  updateSubscriptionPaymentGateway(payload:CreateSubscriptionPaymentGateway): Observable<SubscriptionPaymentGateway> {
    const serverUrl = `${this.config.serverUrl}/subscription/payment_gateways/${payload.uuid}/?subscription=${payload.subscription}`;
    return this.httpClient.put<SubscriptionPaymentGateway>(serverUrl,payload);
  }

  saveSubscriptionPaymentGateway(subscriptionPaymentGateway:CreateSubscriptionPaymentGateway){

    let saveOperation$: Observable<SubscriptionPaymentGateway>;
    const payload: CreateSubscriptionPaymentGateway = { ...subscriptionPaymentGateway };
    if (subscriptionPaymentGateway.uuid != null && subscriptionPaymentGateway.uuid !== '') {
      saveOperation$ = this.updateSubscriptionPaymentGateway(payload);
    } else {
      saveOperation$ = this.createSubscriptionPaymentGateway(payload);
    }
    return saveOperation$;

  }


  deleteSubscriptionPaymentGateway(subscription: string,uuid:string): Observable<SubscriptionPaymentGateway> {
    const serverUrl = `${this.config.serverUrl}/subscription/payment_gateways/${uuid}?subscription=${subscription}`;
    return this.httpClient.delete<SubscriptionPaymentGateway>(serverUrl);
  }

  getSubscriptionBillingInvoice(subscription:string):Observable<SubscriptionBillingInvoice[]>{
    const serverUrl = `${this.config.serverUrl}/subscription/me/${subscription}/billing_invoices?subscription=${subscription}`;
    return this.httpClient.get<SubscriptionBillingInvoice[]>(serverUrl);
  }

  subscriptionChangePlanRequest(payload:ChangePlanRequest){
    const serverUrl = `${this.config.serverUrl}/subscription/change_plan_request/?subscription=${payload.subscription}`;
    return this.httpClient.post<ChangePlanRequest>(serverUrl,payload);
  }


}
