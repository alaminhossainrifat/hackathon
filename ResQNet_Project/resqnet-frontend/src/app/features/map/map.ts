import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import * as L from 'leaflet';
import { DisasterService, Disaster } from '../../core/services/disaster';
import { SafezoneService, SafeZone } from '../../core/services/safezone';
import { AmbulanceService, Ambulance } from '../../core/services/ambulance';
import { SosService, SosAlert } from '../../core/services/sos';

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
    private safezoneService: SafezoneService,
    private ambulanceService: AmbulanceService,
    private sosService: SosService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initMap();
    this.loadDisasters();
    this.loadSafeZones();
    this.loadAmbulances();
    this.loadSosAlerts();
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

  private loadSafeZones() {
    this.safezoneService.getAll().subscribe({
      next: (zones) => {
        zones.forEach(z => {
          if (z.latitude && z.longitude) {
            L.marker([z.latitude, z.longitude], {
              icon: L.divIcon({
                className: '',
                html: `<div style="
                background: #00b09b;
                color: white;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                🏠 ${z.zoneType}
              </div>`,
                iconAnchor: [0, 0]
              })
            })
              .addTo(this.map)
              .bindPopup(`
            <b>🏠 ${z.name}</b><br>
            Type: ${z.zoneType}<br>
            Address: ${z.address}<br>
            Capacity: ${z.currentOccupancy}/${z.capacity}<br>
            Contact: ${z.contactNumber}<br>
            Status: ${z.available ? '🟢 Available' : '🔴 Unavailable'}
          `);
          }
        });
      }
    });
  }

  private loadAmbulances() {
    this.ambulanceService.getAll().subscribe({
      next: (ambulances) => {
        ambulances.forEach(a => {
          if (a.currentLatitude && a.currentLongitude) {
            L.marker([a.currentLatitude, a.currentLongitude], {
              icon: L.divIcon({
                className: '',
                html: `<div style="
                background: #f7971e;
                color: white;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                🚑 ${a.vehicleNumber}
              </div>`,
                iconAnchor: [0, 0]
              })
            })
              .addTo(this.map)
              .bindPopup(`
            <b>🚑 ${a.vehicleNumber}</b><br>
            Driver: ${a.driverName}<br>
            Phone: ${a.driverPhone}<br>
            Area: ${a.area}<br>
            Status: ${a.status}
          `);
          }
        });
      }
    });
  }

  private loadSosAlerts() {
  this.sosService.getActive().subscribe({
    next: (alerts) => {
      alerts.forEach(a => {
        if (a.latitude && a.longitude) {
          L.marker([a.latitude, a.longitude], {
            icon: L.divIcon({
              className: '',
              html: `<div style="
                background: #ff4444;
                color: white;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
                box-shadow: 0 0 10px #ff444488;
                animation: pulse 1s infinite;">
                🆘 SOS
              </div>`,
              iconAnchor: [0, 0]
            })
          })
          .addTo(this.map)
          .bindPopup(`
            <b>🆘 SOS Alert</b><br>
            Name: ${a.senderName}<br>
            Phone: ${a.senderPhone}<br>
            Message: ${a.message}<br>
            Time: ${a.createdAt}
          `);
        }
      });
    }
  });
}
}