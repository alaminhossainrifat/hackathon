import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { WebsocketService } from '../../core/services/websocket';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  menuItems = [
    { label: '🗺️ Map', route: '/map' },
    { label: '🚨 Disasters', route: '/disasters' },
    { label: '🏠 Safe Zones', route: '/safezones' },
    { label: '👨‍⚕️ Doctors', route: '/doctors' },
    { label: '🚑 Ambulances', route: '/ambulances' },
    { label: '🩸 Blood Bank', route: '/blood-bank' },
    { label: '🔍 Missing Persons', route: '/missing-persons' },
    { label: '🏙️ Civic Reports', route: '/civic-reports' },
    { label: '🆘 SOS', route: '/sos' },
    { label: '🤖 ResQBot', route: '/resqbot' },
  ];

  notifications: string[] = [];
  private subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private wsService: WebsocketService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.wsService.connect();

    this.subs.push(
      this.wsService.disasterAlert$.subscribe(alert => {
        this.notifications.unshift(`🚨 New Disaster: ${alert.title} — ${alert.location}`);
        if (this.notifications.length > 5) this.notifications.pop();
        this.cdr.detectChanges();
      })
    );

    this.subs.push(
      this.wsService.sosAlert$.subscribe(sos => {
        this.notifications.unshift(`🆘 SOS Alert: ${sos.senderName} — ${sos.message}`);
        if (this.notifications.length > 5) this.notifications.pop();
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
    this.wsService.disconnect();
  }

  logout() {
    this.authService.logout();
  }
}