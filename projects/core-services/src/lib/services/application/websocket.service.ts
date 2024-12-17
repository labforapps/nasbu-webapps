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

  private reconnect(url: string, subject: Subject<any>, retries = 5): void {
    if (retries === 0) {
      console.error('Se agotaron los intentos de reconexión.');
      return;
    }
    console.log(`Intentando reconectar (${retries} intentos restantes)...`);
    setTimeout(() => {
      this.connect(url, subject);
    }, 5000); // Esperar 5 segundos antes de reconectar
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
          setInterval(() => {
            if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ action: 'ping' }));
            }
          }, 30000);
      };

      // Evento de recepción de mensajes
      this.socket.onmessage = (event) => {
          console.log('Message: ', event);
          const data = JSON.parse(event.data);
          if (data.action === 'pong') {
              console.log('Pong recibido');
              return;
          }
          if (data.message === "Forbidden") {
            console.error("Error: Forbidden. Conexión cerrada.");
            this.socket.close();
            return;
          } 
          subject.next(JSON.parse(event.data)); // Emite el mensaje recibido
      };

      // Evento de cierre de conexión
      this.socket.onclose = (event) => {
        console.log('WebSocket cerrado', event);
        this.reconnect(url, subject);
      };

      // Manejo de errores
      this.socket.onerror = (error) => {
        console.error('Error en WebSocket', error);
        // Si el error indica un problema crítico como "403 Forbidden", cierra y reconecta
        if (this.socket.readyState === WebSocket.CLOSING || this.socket.readyState === WebSocket.CLOSED) {
          this.reconnect(url, subject);
        }
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
