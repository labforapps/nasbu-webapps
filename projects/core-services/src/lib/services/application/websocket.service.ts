import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket!: WebSocket;
  private pingInterval!: any;

  constructor() {}

  getWebSocketMessagesStream(url: string): Observable<any> {
    const messagesSubject = new Subject<any>();
    this.connect(url, messagesSubject);
    return messagesSubject.asObservable();
  }

  private reconnect(url: string, subject: Subject<any>, retries = 5, delay = 5000): void {
    if (retries === 0) {
      console.error('Se agotaron los intentos de reconexión.');
      return;
    }
    console.log(`Intentando reconectar (${retries} intentos restantes, esperando ${delay}ms)...`);
    setTimeout(() => {
      this.connect(url, subject);
      this.reconnect(url, subject, retries - 1, delay * 2);
    }, delay);
  }

  private connect(url: string, subject: Subject<any>): void {
    if (this.socket) {
      this.socket.close();
    }

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('Conectado al WebSocket');
      this.pingInterval = setInterval(() => {
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ action: 'ping' }));
        } else {
          console.warn('El WebSocket no está abierto para enviar ping.');
        }
      }, 30000);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Mensaje recibido:', data);

      if (data.message === 'Forbidden') {
        console.error('Error: Forbidden. No se intentará reconectar.');
        this.disconnect();
        return;
      }

      if (data.action === 'pong') {
        console.log('Pong recibido');
        return;
      }

      subject.next(data);
    };

    this.socket.onclose = (event) => {
      console.log(`WebSocket cerrado: Código ${event.code}, Razón: ${event.reason || 'Ninguna'}`);
      clearInterval(this.pingInterval);
      if (event.code !== 1000) {
        this.reconnect(url, subject);
      }
    };

    this.socket.onerror = (error) => {
      console.error('Error en WebSocket:', error);
      if (this.socket.readyState === WebSocket.CLOSING || this.socket.readyState === WebSocket.CLOSED) {
        this.reconnect(url, subject);
      }
    };
  }

  sendMessage(message: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket no está conectado.');
    }
  }

  private disconnect(): void {
    if (this.socket) {
      clearInterval(this.pingInterval);
      this.socket.close();
    }
  }
}
