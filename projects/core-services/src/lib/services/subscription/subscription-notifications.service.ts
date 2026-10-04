import { Inject, Injectable } from '@angular/core';
import { WebsocketService } from '../application/websocket.service';
import { AuthService } from '../security/auth.service';
import { EMPTY, Observable, catchError, filter, interval, map, merge, switchMap, tap, withLatestFrom } from 'rxjs';
import { SubscriptionNotificaction, NotificationPreferences, NotificationPreference } from 'core-models';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionNotificationsService {

  private serverUrl!: string;
  private wsNotificationsUrl!: string;

  /** Plan B: cada cuanto se consulta la bandeja mientras el WebSocket no esta conectado. */
  pollingIntervalMs = 60000;

  constructor(@Inject('config') private config: any,
              private websocketService: WebsocketService,
              private authService: AuthService,
              private toastrService: ToastrService,
              private httpClient: HttpClient) {
        this.wsNotificationsUrl = config.notificationsWebSocketUrl;
  }

  getPreferences(subscriptionId: string): Observable<NotificationPreferences> {
    return this.httpClient.get<NotificationPreferences>(
      `${this.config.serverUrl}/subscription/notification_preferences/`,
      { params: { subscription: subscriptionId } });
  }

  savePreferences(subscriptionId: string, preferences: NotificationPreference[]): Observable<NotificationPreferences> {
    return this.httpClient.patch<NotificationPreferences>(
      `${this.config.serverUrl}/subscription/notification_preferences/`, {
        subscription: subscriptionId,
        // El dashboard es obligatorio: solo se envia la preferencia de email.
        preferences: preferences.map(({ code, email }) => ({ code, email }))
      });
  }

  /**
   * Avisos de la bandeja: los pendientes al entrar, los que llegan en vivo por el WebSocket y,
   * mientras el WebSocket no este conectado, una consulta periodica (plan B).
   */
  getNotifications(subscriptionId: string): Observable<SubscriptionNotificaction[]> {
      return merge(
        this.getInboxSafely(subscriptionId),
        this.getOnlineNotifications(subscriptionId),
        this.getFallbackNotifications(subscriptionId)
      );
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

  private getOnlineNotifications(subscriptionId: string): Observable<SubscriptionNotificaction[]> {
    if (!this.wsNotificationsUrl || !subscriptionId) {
      return EMPTY;
    }
    // El token viaja en la query (un WebSocket del navegador no puede enviar cabeceras) y se
    // pide en cada intento de conexion para que nunca este vencido.
    const url$ = () => this.authService.getCognitoAccessToken().pipe(
      map((token: string) =>
        `${this.wsNotificationsUrl}?subscriptionId=${encodeURIComponent(subscriptionId)}&token=${encodeURIComponent(token)}`)
    );
    return this.websocketService.connect(url$).pipe(
      tap((notification: SubscriptionNotificaction) =>
        this.toastrService.info(notification?.title || 'Tienes una nueva notificación')),
      map((notification: SubscriptionNotificaction) => [notification])
    );
  }

  private getFallbackNotifications(subscriptionId: string): Observable<SubscriptionNotificaction[]> {
    if (!subscriptionId) {
      return EMPTY;
    }
    return interval(this.pollingIntervalMs).pipe(
      withLatestFrom(this.websocketService.connected$),
      filter(([, connected]) => !connected),
      switchMap(() => this.getInboxSafely(subscriptionId))
    );
  }

  /**
   * Bandeja por REST sin propagar errores: si la consulta falla (por ejemplo un 403), el
   * stream sigue vivo y el WebSocket no se cierra.
   */
  private getInboxSafely(subscriptionId: string): Observable<SubscriptionNotificaction[]> {
    return this.getLatestsNotifications(subscriptionId).pipe(catchError(() => EMPTY));
  }
}
