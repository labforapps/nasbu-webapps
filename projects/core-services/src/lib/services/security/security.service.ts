import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CaseFile, Invoice, SecurityGroup,SecurityUser,Summary,Task } from 'core-models';
import { Observable, map, of, switchMap } from 'rxjs';
import { CommonService } from '../common';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(@Inject('config') private config: any,
              private httpClient: HttpClient,
              private commonService:CommonService,
              ) { }

  /**
   * Informa al backend un cambio de cuenta que ocurre en Cognito (hoy, la contrasena) para
   * que genere el aviso "Cambio importante en tu cuenta".
   */
  reportAccountEvent(subscription: string, type: 'password_changed'): Observable<void> {
    const serverUrl = `${this.config.serverUrl}/security/me/account_events/`;
    return this.httpClient.post<void>(serverUrl, { subscription, type });
  }

  getSecurityGroups(subscription:string):Observable<SecurityGroup[]>{
    const serverUrl = `${this.config.serverUrl}/security/groups/?subscription=${subscription}`;
    return this.httpClient.get<SecurityGroup[]>(serverUrl).pipe(
      map((securityGroups:SecurityGroup[]) => {
        return securityGroups.sort( (a,b) => {

          const nameA = a.name;
          const nameB = b.name;

          if(nameA < nameB){
            return -1;
          } else if(nameA > nameB){
            return 1;
          } else {
            return 0;
          }

        })
      })
    )
  }

  createSecurityGroup(subscriptionPayload:SecurityGroup,subscription:string):Observable<SecurityGroup>{
    const serverUrl = `${this.config.serverUrl}/security/groups/?subscription=${subscription}`;
    return this.httpClient.post<SecurityGroup>(serverUrl,subscriptionPayload);
  }

  getSecurityGroupById(uuid:string,subscription :string):Observable<SecurityGroup>{
    const serverUrl = `${this.config.serverUrl}/security/groups/${uuid}/?subscription=${subscription}`;
    return this.httpClient.get<SecurityGroup>(serverUrl);
  }

  updateSecurityGroup(groupPayload:SecurityGroup,uuid:string,subscription:string):Observable<SecurityGroup>{
    const serverUrl = `${this.config.serverUrl}/security/groups/${uuid}/?subscription=${subscription}`;
    return this.httpClient.put<SecurityGroup>(serverUrl,groupPayload);
  }

  deleteSecurityGroup(uuid:string,subscription:string):Observable<SecurityGroup>{
    const serverUrl = `${this.config.serverUrl}/security/groups/${uuid}/?subscription=${subscription}`;
    return this.httpClient.delete<SecurityGroup>(serverUrl);
  }

  getSecurityUsers(subscription:string):Observable<SecurityUser[]>{
    const serverUrl = `${this.config.serverUrl}/security/users/?subscription=${subscription}`;
    return this.httpClient.get<SecurityUser[]>(serverUrl).pipe(
      map( (securityUsers:SecurityUser[]) => {
        return securityUsers.sort((a, b) => {

          if (a.subscription_member_type === 'O' && b.subscription_member_type !== 'O') {
            return -1;
          }
          if (b.subscription_member_type === 'O' && a.subscription_member_type !== 'O') {
            return 1;
          }

          const nameA = a.user.first_name.toLowerCase();
          const nameB = b.user.first_name.toLowerCase();

          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        });
      })
    )
  }

  getSecurityUserById(subscription:string,uuid:string):Observable<SecurityUser>{
    const serverUrl = `${this.config.serverUrl}/security/users/${uuid}/?subscription=${subscription}`;
    return this.httpClient.get<SecurityUser>(serverUrl);
  }

  createSecurityUser(subscription:string,securityUserPayload:SecurityUser){
    const serverUrl = `${this.config.serverUrl}/security/users/?subscription=${subscription}`;
    return this.httpClient.post<SecurityUser>(serverUrl,securityUserPayload);
  }

  updateSecurityUser(subscription:string,securityUserPayload:SecurityUser,uuid:string){
    const serverUrl = `${this.config.serverUrl}/security/users/${uuid}/?subscription=${subscription}`;
    return this.httpClient.put<SecurityUser>(serverUrl,securityUserPayload);
  }

  deleteSecurityUser(subscription:string,uuid:string){
    const serverUrl = `${this.config.serverUrl}/security/users/${uuid}/?subscription=${subscription}`;
    return this.httpClient.delete<SecurityUser>(serverUrl);
  }

  saveSecurityUser(securityUserPayload: SecurityUser): Observable<SecurityUser> {
    let saveOperation$: Observable<SecurityUser>;
    const payload: SecurityUser = { ...securityUserPayload };
    if (securityUserPayload.uuid != null && securityUserPayload.uuid !== '') {
      saveOperation$ = this.updateSecurityUser(payload.subscription || '',payload,payload.uuid || '');
    } else {
      saveOperation$ = this.createSecurityUser(payload.subscription,payload);
    }
    return saveOperation$.pipe(
      switchMap((item: SecurityUser) => {
        if (securityUserPayload.image_url) {
          return this.uploadImage(payload.subscription || '',item.uuid || '', securityUserPayload.image_url);
        }
        return of(item);
      })
    );
  }


  uploadImage(subscription: string, uuid: string, image: any) {
    const serverUrl: string = `${this.config.serverUrl}/security/users/${uuid}/upload_image/?subscription=${subscription}`;
    const formData = new FormData();
    formData.append('file', image);
    formData.append('subscription', subscription);
    console.log('Form Data',formData);
    return this.httpClient.put<any>(serverUrl, formData);
  }

  getCaseFilesBySecurityUsers(subscription:string,uuid:string):Observable<CaseFile[]>{
    const serverUrl: string = `${this.config.serverUrl}/security/users/${uuid}/case_files?subscription=${subscription}`;
    return this.httpClient.get<CaseFile[]>(serverUrl);
  }

  getTasksBySecurityUsers(subscription:string,uuid:string):Observable<Task[]>{
    const serverUrl: string = `${this.config.serverUrl}/security/users/${uuid}/tasks?subscription=${subscription}`;
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

  getAccountSummary(subscription:string):Observable<Summary[]>{
    const serverUrl: string = `${this.config.serverUrl}/security/me/${subscription}/summary?subscription=${subscription}`;
    return this.httpClient.get<Summary[]>(serverUrl);
  }

  getInvoicesBySecurityUser(securityUser:SecurityUser):Observable<Invoice[]>{
    const serverUrl: string = `${this.config.serverUrl}/security/users/${securityUser.uuid}/invoices?subscription=${securityUser.subscription}`;
    return this.httpClient.get<Invoice[]>(serverUrl);
  }


}
