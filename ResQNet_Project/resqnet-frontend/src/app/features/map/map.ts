import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import * as L from 'leaflet';
import { DisasterService, Disaster } from '../../core/services/disaster';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class MapComponent implements OnInit, OnDestroy {
  private map!: L.Map;
  private markers: L.Marker[] = [];

  constructor(
    private disasterService: DisasterService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initMap();
    this.loadDisasters();
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }

  private initMap() {
    this.map = L.map('map').setView([23.8103, 90.4125], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private loadDisasters() {
    this.disasterService.getAll().subscribe({
      next: (disasters) => {
        disasters.forEach(d => {
          if (d.latitude && d.longitude) {
            const marker = L.marker([d.latitude, d.longitude], {
              icon: L.divIcon({
                className: '',
                html: `<div style="
                  background: #e94560;
                  color: white;
                  padding: 4px 8px;
                  border-radius: 6px;
                  font-size: 12px;
                  font-weight: bold;
                  white-space: nowrap;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                  🚨 ${d.alertType}
                </div>`,
                iconAnchor: [0, 0]
              })
            })
            .addTo(this.map)
            .bindPopup(`
              <b>🚨 ${d.title}</b><br>
              Type: ${d.alertType}<br>
              Severity: ${d.severity}<br>
              Location: ${d.location}<br>
              Status: ${d.active ? '🟢 Active' : '🔴 Inactive'}
            `);
            this.markers.push(marker);
          }
        });
      }
    });
  }
}