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
  
  // Layer Groups to categorize different types of markers
  private disasterLayer = L.layerGroup();
  private safeZoneLayer = L.layerGroup();
  private ambulanceLayer = L.layerGroup();
  private sosLayer = L.layerGroup();

  // Traffic and Incident layers from TomTom
  private trafficLayer: L.TileLayer | null = null;
  private incidentLayer: L.TileLayer | null = null;

  showTraffic = false;
  showIncidents = false;
  weather: WeatherData | null = null;
  weatherLoading = false;

  // Initial map coordinates (Dhaka, Bangladesh)
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
    // Destroy map instance to prevent memory leaks when component is destroyed
    if (this.map) this.map.remove();
  }

  private initMap() {
    // Create map instance
    this.map = L.map('map').setView([this.defaultLat, this.defaultLng], 7);
    
    // Default OpenStreetMap base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add all layer groups to the map initially
    this.disasterLayer.addTo(this.map);
    this.safeZoneLayer.addTo(this.map);
    this.ambulanceLayer.addTo(this.map);
    this.sosLayer.addTo(this.map);

    // Configuration for Layer Control UI
    const overlayMaps = {
      "🚨 Disasters": this.disasterLayer,
      "🏠 Safe Zones": this.safeZoneLayer,
      "🚑 Ambulances": this.ambulanceLayer,
      "🆘 SOS Alerts": this.sosLayer
    };

    // Add control panel to the map. Using {} for baseLayers to fix type error.
    L.control.layers({}, overlayMaps, { collapsed: false }).addTo(this.map);

    // Global click listener for weather updates
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.loadWeather(e.latlng.lat, e.latlng.lng);
    });
  }

  // ── Weather Data Management ─────────────────────────
  loadWeather(lat: number, lon: number) {
    this.weatherLoading = true;
    this.weatherService.getWeather(lat, lon).subscribe({
      next: (data) => {
        this.weather = this.weatherService.parseWeather(data);
        this.weatherLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Weather error:', err);
        this.weatherLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── Traffic Layer Toggles ───────────────────────────
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

  // ── Data Loaders (Added to specific Layer Groups) ───
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
            }).bindPopup(`<b>🚨 ${d.title}</b><br>Type: ${d.alertType}<br>Severity: ${d.severity}<br>Status: ${d.active ? '🟢 Active' : '🔴 Inactive'}`);
            
            // Marker added to layer group instead of direct map
            marker.addTo(this.disasterLayer);
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
            const marker = L.marker([z.latitude, z.longitude], {
              icon: L.divIcon({
                className: '',
                html: `<div style="background:#00b09b;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🏠 ${z.zoneType}</div>`,
                iconAnchor: [0, 0]
              })
            }).bindPopup(`<b>🏠 ${z.name}</b><br>Type: ${z.zoneType}<br>Address: ${z.address}<br>Capacity: ${z.currentOccupancy}/${z.capacity}`);
            
            marker.addTo(this.safeZoneLayer);
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
            const marker = L.marker([a.currentLatitude, a.currentLongitude], {
              icon: L.divIcon({
                className: '',
                html: `<div style="background:#f7971e;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🚑 ${a.vehicleNumber}</div>`,
                iconAnchor: [0, 0]
              })
            }).bindPopup(`<b>🚑 ${a.vehicleNumber}</b><br>Driver: ${a.driverName}<br>Status: ${a.status}`);
            
            marker.addTo(this.ambulanceLayer);
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
            const marker = L.marker([a.latitude, a.longitude], {
              icon: L.divIcon({
                className: '',
                html: `<div style="background:#ff4444;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:bold;white-space:nowrap;box-shadow:0 0 10px #ff444488;">🆘 SOS</div>`,
                iconAnchor: [0, 0]
              })
            }).bindPopup(`<b>🆘 SOS Alert</b><br>Name: ${a.senderName}<br>Message: ${a.message}`);
            
            marker.addTo(this.sosLayer);
          }
        });
      }
    });
  }
}