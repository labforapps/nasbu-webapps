import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Group } from 'core-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(@Inject('config') private config: any,
              private httpClient: HttpClient) { }

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

}
