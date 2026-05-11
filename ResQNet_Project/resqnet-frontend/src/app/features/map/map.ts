import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import * as L from 'leaflet';
import { DisasterService, Disaster } from '../../core/services/disaster';
import { SafezoneService, SafeZone } from '../../core/services/safezone';
import { AmbulanceService, Ambulance } from '../../core/services/ambulance';
import { SosService, SosAlert } from '../../core/services/sos';
import { WeatherService, WeatherData } from '../../core/services/weather';
import { TrafficService } from '../../core/services/traffic';

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
  private trafficLayer: L.TileLayer | null = null;
  private incidentLayer: L.TileLayer | null = null;

  showTraffic = false;
  showIncidents = false;
  weather: WeatherData | null = null;
  weatherLoading = false;

  // Bangladesh center (Updated for explicit 'Dhaka' reading)
  private defaultLat = 23.8103;
  private defaultLng = 90.4125;

  constructor(
    private disasterService: DisasterService,
    private safezoneService: SafezoneService,
    private ambulanceService: AmbulanceService,
    private sosService: SosService,
    private weatherService: WeatherService,
    private trafficService: TrafficService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initMap();
    this.loadDisasters();
    this.loadSafeZones();
    this.loadAmbulances();
    this.loadSosAlerts();
    this.loadWeather(this.defaultLat, this.defaultLng);
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }

  private initMap() {
    this.map = L.map('map').setView([this.defaultLat, this.defaultLng], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Click → load weather at clicked location
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.loadWeather(e.latlng.lat, e.latlng.lng);
    });
  }

  // ── Weather ─────────────────────────────────────────
  loadWeather(lat: number, lon: number) {
    this.weatherLoading = true;
    this.weatherService.getWeather(lat, lon).then((data: any) => {
      this.weather = this.weatherService.parseWeather(data);
      this.weatherLoading = false;
      this.cdr.detectChanges();
    }).catch(() => {
      this.weatherLoading = false;
      this.cdr.detectChanges();
    });
  }

  // ── Traffic Toggle ───────────────────────────────────
  toggleTraffic() {
    this.showTraffic = !this.showTraffic;
    if (this.showTraffic) {
      this.trafficLayer = this.trafficService.getTrafficTileLayer();
      this.trafficLayer.addTo(this.map);
    } else {
      this.trafficLayer?.removeFrom(this.map);
      this.trafficLayer = null;
    }
  }

  toggleIncidents() {
    this.showIncidents = !this.showIncidents;
    if (this.showIncidents) {
      this.incidentLayer = this.trafficService.getIncidentLayer();
      this.incidentLayer.addTo(this.map);
    } else {
      this.incidentLayer?.removeFrom(this.map);
      this.incidentLayer = null;
    }
  }

  // ── Existing loaders (unchanged) ────────────────────
  private loadDisasters() {
    this.disasterService.getAll().subscribe({
      next: (disasters) => {
        disasters.forEach(d => {
          if (d.latitude && d.longitude) {
            const marker = L.marker([d.latitude, d.longitude], {
              icon: L.divIcon({
                className: '',
                html: `<div style="background:#e94560;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🚨 ${d.alertType}</div>`,
                iconAnchor: [0, 0]
              })
            }).addTo(this.map)
              .bindPopup(`<b>🚨 ${d.title}</b><br>Type: ${d.alertType}<br>Severity: ${d.severity}<br>Location: ${d.location}<br>Status: ${d.active ? '🟢 Active' : '🔴 Inactive'}`);
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
                html: `<div style="background:#00b09b;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🏠 ${z.zoneType}</div>`,
                iconAnchor: [0, 0]
              })
            }).addTo(this.map)
              .bindPopup(`<b>🏠 ${z.name}</b><br>Type: ${z.zoneType}<br>Address: ${z.address}<br>Capacity: ${z.currentOccupancy}/${z.capacity}<br>Contact: ${z.contactNumber}<br>Status: ${z.available ? '🟢 Available' : '🔴 Unavailable'}`);
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
                html: `<div style="background:#f7971e;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🚑 ${a.vehicleNumber}</div>`,
                iconAnchor: [0, 0]
              })
            }).addTo(this.map)
              .bindPopup(`<b>🚑 ${a.vehicleNumber}</b><br>Driver: ${a.driverName}<br>Phone: ${a.driverPhone}<br>Area: ${a.area}<br>Status: ${a.status}`);
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
                html: `<div style="background:#ff4444;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:bold;white-space:nowrap;box-shadow:0 0 10px #ff444488;">🆘 SOS</div>`,
                iconAnchor: [0, 0]
              })
            }).addTo(this.map)
              .bindPopup(`<b>🆘 SOS Alert</b><br>Name: ${a.senderName}<br>Phone: ${a.senderPhone}<br>Message: ${a.message}<br>Time: ${a.createdAt}`);
          }
        });
      }
    });
  }
}