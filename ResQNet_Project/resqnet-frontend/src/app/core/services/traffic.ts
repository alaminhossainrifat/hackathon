import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as L from 'leaflet';

@Injectable({ providedIn: 'root' })
export class TrafficService {
  private trafficLayer: L.TileLayer | null = null;
  private tomtomKey = environment.tomtomApiKey;

  getTrafficTileLayer(): L.TileLayer {
    return L.tileLayer(
      `https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png?key=${this.tomtomKey}`,
      {
        opacity: 0.7,
        attribution: '© TomTom Traffic'
      }
    );
  }

  getIncidentLayer(): L.TileLayer {
    return L.tileLayer(
      `https://api.tomtom.com/traffic/map/4/tile/incidents/s3/{z}/{x}/{y}.png?key=${this.tomtomKey}`,
      {
        opacity: 0.8,
        attribution: '© TomTom Incidents'
      }
    );
  }
}