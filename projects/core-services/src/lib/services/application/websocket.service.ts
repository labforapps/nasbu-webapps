import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

export interface WebSocketOptions {
  /** Intentos de reconexion tras un cierre anormal antes de rendirse. */
  maxRetries?: number;
  /** Espera del primer reintento; se duplica en cada intento. */
  baseDelayMs?: number;
  /** Intervalo del ping que mantiene viva la conexion en API Gateway. */
  pingIntervalMs?: number;
}

/**
 * Conexion al WebSocket de notificaciones (API Gateway).
 *
 * El socket se abre al suscribirse y se cierra al desuscribirse. Cada intento pide la URL
 * de nuevo (con un token fresco) porque API Gateway valida el token en $connect. Si el
 * handshake se rechaza, el navegador solo informa un cierre anormal: por eso los reintentos
 * son limitados y, mientras no hay conexion, `connected$` permite usar un plan B.
 */
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private readonly connectedSubject = new BehaviorSubject<boolean>(false);
  readonly connected$ = this.connectedSubject.asObservable();

  connect(urlFactory: () => Observable<string>, options: WebSocketOptions = {}): Observable<any> {
    const { maxRetries = 5, baseDelayMs = 2000, pingIntervalMs = 30000 } = options;

    return new Observable<any>(subscriber => {
      let socket: WebSocket | null = null;
      let pingTimer: any;
      let retryTimer: any;
      let urlSubscription: Subscription | undefined;
      let attempts = 0;
      let stopped = false;

      const scheduleRetry = () => {
        if (stopped || attempts >= maxRetries) {
          return;
        }
        const delay = baseDelayMs * Math.pow(2, attempts);
        attempts++;
        retryTimer = setTimeout(open, delay);
      };

      const open = () => {
        urlSubscription = urlFactory().pipe(take(1)).subscribe({
          next: (url: string) => {
            if (stopped) {
              return;
            }
            socket = this.createSocket(url);
            socket.onopen = () => {
              attempts = 0;
              this.connectedSubject.next(true);
              pingTimer = setInterval(() => {
                if (socket?.readyState === WebSocket.OPEN) {
                  socket.send(JSON.stringify({ action: 'ping' }));
                }
              }, pingIntervalMs);
            };
            socket.onmessage = (event: MessageEvent) => {
              let data: any;
              try {
                data = JSON.parse(event.data);
              } catch {
                return;
              }
              if (data?.action === 'pong') {
                return;
              }
              if (data?.message === 'Forbidden') {
                // API Gateway rechazo la conexion: no tiene sentido reintentar.
                stopped = true;
                socket?.close(1000);
                return;
              }
              subscriber.next(data);
            };
            socket.onclose = (event: CloseEvent) => {
              clearInterval(pingTimer);
              socket = null;
              this.connectedSubject.next(false);
              if (event.code !== 1000) {
                scheduleRetry();
              }
            };
          },
          error: () => scheduleRetry()
        });
      };

      open();

      return () => {
        stopped = true;
        clearTimeout(retryTimer);
        clearInterval(pingTimer);
        urlSubscription?.unsubscribe();
        socket?.close(1000);
        socket = null;
        this.connectedSubject.next(false);
      };
    });
  }

  /** Punto de extension para las pruebas. */
  protected createSocket(url: string): WebSocket {
    return new WebSocket(url);
  }
}
