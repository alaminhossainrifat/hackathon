import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as L from 'leaflet';

@Injectable({ providedIn: 'root' })
export class TrafficService {
  private proxyUrl = `${environment.apiUrl}/proxy`; 

  getTrafficTileLayer(): L.TileLayer {
    return L.tileLayer(
      `${this.proxyUrl}/tomtom-traffic/{z}/{x}/{y}.png`, // Backend Proxy Root
      {
        opacity: 0.7,
        attribution: '© TomTom Traffic'
      }
    );
  }

  getIncidentLayer(): L.TileLayer {
    return L.tileLayer(
      `${this.proxyUrl}/tomtom-incidents/{z}/{x}/{y}.png`, // Backend Proxy Root
      {
        opacity: 0.8,
        attribution: '© TomTom Incidents'
      }
    );
  }
}