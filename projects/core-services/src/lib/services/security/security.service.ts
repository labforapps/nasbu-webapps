import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CaseFile, Group,SecurityUser,Task,TaskType } from 'core-models';
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

  getSecurityGroups(subscription:string):Observable<Group[]>{
    const serverUrl = `${this.config.serverUrl}/security/groups/?subscription=${subscription}`;
    return this.httpClient.get<Group[]>(serverUrl);
  }

  createSecurityGroup(subscriptionPayload:Group,subscription:string):Observable<Group>{
    const serverUrl = `${this.config.serverUrl}/security/groups/?subscription=${subscription}`;
    return this.httpClient.post<Group>(serverUrl,subscriptionPayload);
  }

  getSecurityGroupById(uuid:string,subscription :string):Observable<Group>{
    const serverUrl = `${this.config.serverUrl}/security/groups/${uuid}/?subscription=${subscription}`;
    return this.httpClient.get<Group>(serverUrl);
  }

  updateSecurityGroup(groupPayload:Group,uuid:string,subscription:string):Observable<Group>{
    const serverUrl = `${this.config.serverUrl}/security/groups/${uuid}/?subscription=${subscription}`;
    return this.httpClient.put<Group>(serverUrl,groupPayload);
  }

  deleteSecurityGroup(uuid:string,subscription:string):Observable<Group>{
    const serverUrl = `${this.config.serverUrl}/security/groups/${uuid}/?subscription=${subscription}`;
    return this.httpClient.delete<Group>(serverUrl);
  }

  getSecurityUsers(subscription:string):Observable<SecurityUser[]>{
    const serverUrl = `${this.config.serverUrl}/security/users/?subscription=${subscription}`;
    return this.httpClient.get<SecurityUser[]>(serverUrl).pipe(
      map( (securityUsers:SecurityUser[]) => {
        return securityUsers.sort((a, b) => {

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


}
