import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  constructor(public authService: AuthService) {}

  features = [
    { icon: '🚨', title: 'Disaster Alerts', desc: 'Real-time disaster warnings', route: '/disasters', guest: true },
    { icon: '🗺️', title: 'Live Map', desc: 'Interactive disaster map', route: '/map', guest: true },
    { icon: '🏠', title: 'Safe Zones', desc: 'Find nearest shelter', route: '/safezones', guest: true },
    { icon: '🤖', title: 'ResQBot AI', desc: 'AI disaster assistant', route: '/resqbot', guest: true },
    { icon: '🆘', title: 'SOS Alert', desc: 'Emergency SOS button', route: '/sos', guest: false },
    { icon: '🚑', title: 'Ambulance', desc: 'Find nearest ambulance', route: '/ambulances', guest: false },
    { icon: '👨‍⚕️', title: 'Doctors', desc: 'Connect with doctors', route: '/doctors', guest: false },
    { icon: '🩸', title: 'Blood Bank', desc: 'Find blood donors', route: '/blood-bank', guest: false },
    { icon: '🔍', title: 'Missing Persons', desc: 'Report missing people', route: '/missing-persons', guest: false },
    { icon: '🏙️', title: 'Civic Reports', desc: 'Report city issues', route: '/civic-reports', guest: false },
  ];
}