import { Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private client!: Client;

  disasterAlert$ = new Subject<any>();
  sosAlert$ = new Subject<any>();

  connect() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl) as any,
      onConnect: () => {
        console.log('WebSocket connected ✅');

        this.client.subscribe('/topic/disasters', msg => {
          console.log('DISASTER MSG:', msg.body);  // ADD
          const data = JSON.parse(msg.body);
          this.disasterAlert$.next(data);
        });

        this.client.subscribe('/topic/sos', msg => {
          console.log('SOS MSG:', msg.body);  // ADD
          const data = JSON.parse(msg.body);
          this.sosAlert$.next(data);
        });
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      }
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) this.client.deactivate();
  }


}