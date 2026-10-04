import { discardPeriodicTasks, fakeAsync, flush, tick } from '@angular/core/testing';
import { of, Subscription } from 'rxjs';
import { WebsocketService } from './websocket.service';

class FakeSocket {
  static instances: FakeSocket[] = [];
  readyState = 0;
  sent: string[] = [];
  closedWith?: number;
  onopen: any; onmessage: any; onclose: any;

  constructor(public url: string) { FakeSocket.instances.push(this); }
  send(data: string) { this.sent.push(data); }
  close(code = 1000) { this.closedWith = code; this.readyState = 3; }

  open() { this.readyState = 1; this.onopen?.(); }
  receive(data: any) { this.onmessage?.({ data: JSON.stringify(data) }); }
  drop(code = 1006) { this.readyState = 3; this.onclose?.({ code }); }
}

class TestableWebsocketService extends WebsocketService {
  protected override createSocket(url: string): WebSocket {
    return new FakeSocket(url) as unknown as WebSocket;
  }
}

describe('WebsocketService', () => {
  let service: TestableWebsocketService;
  let subscription: Subscription;
  let received: any[];
  let tokens: number;
  const urlFactory = () => of(`wss://ws.test?token=t${++tokens}`);
  const last = () => FakeSocket.instances[FakeSocket.instances.length - 1];
  const start = () => {
    subscription = service.connect(urlFactory, { maxRetries: 2, baseDelayMs: 1000, pingIntervalMs: 30000 })
      .subscribe(message => received.push(message));
  };
  const finish = () => {
    subscription.unsubscribe();
    discardPeriodicTasks();
    flush();
  };

  beforeEach(() => {
    FakeSocket.instances = [];
    tokens = 0;
    received = [];
    service = new TestableWebsocketService();
  });

  it('emits messages, ignores pongs and reports the connection state', fakeAsync(() => {
    let connected = false;
    service.connected$.subscribe(value => connected = value);
    start();
    last().open();
    expect(connected).toBeTrue();
    last().receive({ action: 'pong' });
    last().receive({ uuid: 'n1', title: 'Nueva tarea asignada' });
    expect(received).toEqual([{ uuid: 'n1', title: 'Nueva tarea asignada' }]);
    finish();
    expect(connected).toBeFalse();
  }));

  it('pings while connected', fakeAsync(() => {
    start();
    last().open();
    tick(30000);
    expect(last().sent).toEqual([JSON.stringify({ action: 'ping' })]);
    finish();
  }));

  it('reconnects with a fresh URL after an abnormal close and stops after the retry limit', fakeAsync(() => {
    start();
    last().drop();
    tick(1000);
    expect(FakeSocket.instances.length).toBe(2);
    expect(last().url).toContain('token=t2');
    last().drop();
    tick(2000);
    expect(FakeSocket.instances.length).toBe(3);
    last().drop();
    tick(60000);
    expect(FakeSocket.instances.length).toBe(3);
    finish();
  }));

  it('resets the retry budget once a reconnection succeeds', fakeAsync(() => {
    start();
    last().drop();
    tick(1000);
    last().open();
    last().drop();
    tick(1000);
    expect(FakeSocket.instances.length).toBe(3);
    finish();
  }));

  it('does not retry when API Gateway forbids the connection', fakeAsync(() => {
    start();
    last().receive({ message: 'Forbidden' });
    last().drop(1000);
    tick(60000);
    expect(FakeSocket.instances.length).toBe(1);
    finish();
  }));

  it('closes the socket when unsubscribed', fakeAsync(() => {
    start();
    const socket = last();
    socket.open();
    finish();
    expect(socket.closedWith).toBe(1000);
    tick(60000);
    expect(FakeSocket.instances.length).toBe(1);
  }));
});
