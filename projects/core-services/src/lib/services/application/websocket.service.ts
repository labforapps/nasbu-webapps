import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket!: WebSocket;

  constructor() {}

  getWebSocketMessagesStream(url: string): Observable<any> {
      const messagesSubject = new Subject<any>();
      this.connect(url, messagesSubject);
      return messagesSubject.asObservable();
  }

  // Conectar a la URL del WebSocket
  private connect(url: string, subject: Subject<any>): void {
      if (this.socket) {
        this.socket.close();
      }

      this.socket = new WebSocket(url);

      // Evento de apertura de conexión
      this.socket.onopen = (event) => {
        console.log('Conectado al WebSocket');
      };

      // Evento de recepción de mensajes
      this.socket.onmessage = (event) => {
        console.log('Message: ', event);
        subject.next(JSON.parse(event.data)); // Emite el mensaje recibido
      };

      // Evento de cierre de conexión
      this.socket.onclose = (event) => {
        console.log('WebSocket cerrado', event);
      };

      // Manejo de errores
      this.socket.onerror = (error) => {
        console.error('Error en WebSocket', error);
      };
  }

  // Enviar un mensaje a través del WebSocket
  sendMessage(message: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket no está conectado.');
    }
  }

  // Cerrar la conexión WebSocket
  private disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

}
