import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SubscriptionOnboarding, Subscription, SubscriptionPayload, SubscriptionBillingFee, OnboardingTokenizationSessionResult, SubscriptionPaymentMethod, SubscriptionPaymentMethodPayload, CreateSubscriptionPaymentGateway, SubscriptionPaymentGateway, SubscriptionBillingInvoice, ChangePlanRequest, ResumeTokenizationResult } from 'core-models';
import { Observable, map, of, switchMap } from 'rxjs';
import { CoreService } from '../core';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(@Inject('config') private config: any,
              private httpClient: HttpClient,
              private coreService: CoreService) { }

  getOnboardingPmTokenSession(uuid: string): Observable<OnboardingTokenizationSessionResult> {
    const serverUrl = `${this.config.serverUrl}/subscription/onboarding/tokenization_session/`;
    const payload = {uuid};
    return this.httpClient.post<OnboardingTokenizationSessionResult>(serverUrl, payload);
  }

  getSubscription(uuid:string): Observable<Subscription> {
    const serverUrl = `${this.config.serverUrl}/subscription/me/${uuid}/`;
    return this.httpClient.get<Subscription>(serverUrl);
  }

  getAvailableModules(subscriptionUuid: string): Observable<string[]> {
    return this.getSubscription(subscriptionUuid).pipe(
      switchMap(sub => this.coreService.getPlans().pipe(
        map(plans => plans.find(p => p.uuid === sub.plan)?.available_modules?.map(am => am.module) ?? [])
      ))
    );
  }

  createSubscriptionOnboarding(payload: any): Observable<Subscription> {
      const serverUrl: string = `${this.config.serverUrl}/subscription/onboarding/`;
      return this.httpClient.post<Subscription>(serverUrl, payload);
  }

  /**
   * Cierra el alta en modo redirect, al volver de PlaceToPay: guarda la tarjeta
   * tokenizada, activa la suscripcion y dispara el primer cobro.
   *
   * Es idempotente del lado del backend (tiene guard por estado), lo cual importa
   * porque el AuthInterceptor reintenta toda request fallida dos veces.
   */
  confirmOnboardingTokenization(subscriptionId: string): Observable<Subscription> {
      const serverUrl: string = `${this.config.serverUrl}/subscription/onboarding/confirm_tokenization/`;
      return this.httpClient.post<Subscription>(serverUrl, { subscription_id: subscriptionId });
  }

  /**
   * Revierte un alta que quedo a medio tokenizar, para no dejar suscripciones ni
   * usuarios de Cognito huerfanos. Tambien idempotente.
   */
  cancelOnboardingTokenization(subscriptionId: string): Observable<any> {
      const serverUrl: string = `${this.config.serverUrl}/subscription/onboarding/cancel_tokenization/`;
      return this.httpClient.post(serverUrl, { subscription_id: subscriptionId });
  }

  /**
   * Devuelve una URL de checkout nueva para un alta que quedo pendiente de pago.
   *
   * Es la salida del usuario que confirmo su cuenta sin llegar a tokenizar la tarjeta:
   * en vez de quedarse con una cuenta bloqueada, vuelve a PlaceToPay. No sirve
   * reutilizar el `first_checkout_url` guardado porque esa sesion vence a los 30 min.
   */
  resumeOnboardingTokenization(subscriptionId: string): Observable<ResumeTokenizationResult> {
      const serverUrl: string = `${this.config.serverUrl}/subscription/onboarding/resume_tokenization/`;
      return this.httpClient.post<ResumeTokenizationResult>(serverUrl, { subscription_id: subscriptionId });
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

  deleteSubscriptionPaymentMethod(subscription: string,uuid:string): Observable<any> {
    const serverUrl = `${this.config.serverUrl}/subscription/payment_methods/${uuid}?subscription=${subscription}`;
    return this.httpClient.delete<any>(serverUrl);
  }

  getSubscriptionBillingInvoice(subscription:string):Observable<SubscriptionBillingInvoice[]>{
    const serverUrl = `${this.config.serverUrl}/subscription/me/${subscription}/billing_invoices?subscription=${subscription}`;
    return this.httpClient.get<SubscriptionBillingInvoice[]>(serverUrl);
  }

  subscriptionChangePlanRequest(payload:ChangePlanRequest){
    const serverUrl = `${this.config.serverUrl}/subscription/change_plan_request/?subscription=${payload.subscription}`;
    return this.httpClient.post<ChangePlanRequest>(serverUrl,payload);
  }

  downloadSubscriptionBillingInvoice(subscriptionBillingInvoice:SubscriptionBillingInvoice){
    const serverUrl = `${this.config.serverUrl}/subscription/me/${subscriptionBillingInvoice.subscription}/download_billing_invoice?subscription=${subscriptionBillingInvoice.subscription}&invoice_id=${subscriptionBillingInvoice.uuid}`;
    return this.httpClient.get(serverUrl,{ responseType: 'blob' });
  }

  retryPendingCharge(subscriptionUuid: string): Observable<any> {
    const serverUrl = `${this.config.serverUrl}/subscription/me/${subscriptionUuid}/retry_pending_charge/`;
    return this.httpClient.post<any>(serverUrl, {});
  }

}
