import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SosService, SosRequest, SosAlert } from '../../core/services/sos';

@Component({
  selector: 'app-sos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sos.html',
  styleUrl: './sos.css'
})
export class SosComponent implements OnInit {
  activeAlerts: SosAlert[] = [];
  loading = false;
  triggering = false;
  error = '';
  successAlert: SosAlert | null = null;
  showForm = false;

  sosRequest: SosRequest = {
    senderName: '',
    senderPhone: '',
    latitude: 0,
    longitude: 0,
    message: ''
  };

  constructor(
    private sosService: SosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadActive();
    this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.sosRequest.latitude = pos.coords.latitude;
        this.sosRequest.longitude = pos.coords.longitude;
        this.cdr.detectChanges();
      });
    }
  }

  loadActive() {
    this.loading = true;
    this.sosService.getActive().subscribe({
      next: (data) => {
        this.activeAlerts = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  trigger() {
    this.triggering = true;
    this.error = '';
    this.successAlert = null;
    this.sosService.trigger(this.sosRequest).subscribe({
      next: (res) => {
        this.successAlert = res;
        this.triggering = false;
        this.showForm = false;
        this.loadActive();
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to trigger SOS';
        this.triggering = false;
        this.cdr.detectChanges();
      }
    });
  }

  resolve(alert: SosAlert) {
    this.sosService.resolve(alert.id!).subscribe(() => {
      this.loadActive();
    });
  }

  resetForm() {
    this.sosRequest = {
      senderName: '', senderPhone: '',
      latitude: this.sosRequest.latitude,
      longitude: this.sosRequest.longitude,
      message: ''
    };
  }
}