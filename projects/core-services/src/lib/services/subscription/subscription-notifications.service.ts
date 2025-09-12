import { Inject, Injectable } from '@angular/core';
import { WebsocketService } from '../application/websocket.service';
import { Observable, bufferTime, combineLatest, filter, merge, of, tap } from 'rxjs';
import { SubscriptionNotificaction } from 'core-models';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionNotificationsService {

  private serverUrl!: string;
  private wsNotificationsUrl!: string;

  constructor(@Inject('config') private config: any,
              private websocketService: WebsocketService,
              private toastrService: ToastrService,
              private httpClient: HttpClient) {
        this.wsNotificationsUrl = config.notificationsWebSocketUrl;
  }

  getNotifications(subscriptionId: string, userId: string): Observable<SubscriptionNotificaction[]> {
      const onlineNotifications$ = this.getOnlineNotifications(subscriptionId, userId);
      const latestsNotifications$ = this.getLatestsNotifications(subscriptionId);
      return merge(onlineNotifications$, latestsNotifications$);
  }

  markNotificationAsViewed(subscriptionId: string, notificationId: string): Observable<any> {
      const serverUrl: string = `${this.config.serverUrl}/subscription/notifications/mark_as_viewed?subscription=${subscriptionId}&notification_id=${notificationId}`;
      return this.httpClient.get<any>(serverUrl);
  }

  markAllNotificationAsViewed(subscriptionId: string): Observable<any> {
    const serverUrl: string = `${this.config.serverUrl}/subscription/notifications/mark_all_as_viewed?subscription=${subscriptionId}`;
    return this.httpClient.get<any>(serverUrl);
  }

  private getLatestsNotifications(subscriptionId: string): Observable<SubscriptionNotificaction[]> {
      const serverUrl: string = `${this.config.serverUrl}/subscription/notifications/?subscription=${subscriptionId}`;
      return this.httpClient.get<SubscriptionNotificaction[]>(serverUrl);
  }

  private getOnlineNotifications(subscriptionId: string, userId: string): Observable<SubscriptionNotificaction[]> {
    const finalUrl: string = `${this.wsNotificationsUrl}?subscriptionId=${subscriptionId}&userId=${userId}`;
    console.log('WS Url: ', finalUrl);
    return of([]);
    // return this.websocketService
    //            .getWebSocketMessagesStream(finalUrl)
    //            .pipe(
    //             bufferTime(10000),
    //             tap((events) => console.log('WS Events: ', events)),
    //             filter(events => events.length > 0),
    //             tap((notifications: any[]) => {
    //                 if (notifications.length > 1) {
    //                   this.toastrService.info(`Tienes ${notifications.length} notificaciones nuevas`);
    //                 } else {
    //                   this.toastrService.info(`Tienes una nueva notificación`);
    //                 }
    //             })
    //           );
  }


}
