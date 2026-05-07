import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
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

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
  }
}