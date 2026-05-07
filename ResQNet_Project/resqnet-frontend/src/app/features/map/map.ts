import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class MapComponent implements OnInit, OnDestroy {
  private map!: L.Map;

  ngOnInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }

  private initMap() {
    this.map = L.map('map').setView([23.8103, 90.4125], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Sample disaster marker
    L.marker([23.8103, 90.4125])
      .addTo(this.map)
      .bindPopup('<b>🚨 Sample Alert</b><br>Dhaka, Bangladesh')
      .openPopup();
  }
}