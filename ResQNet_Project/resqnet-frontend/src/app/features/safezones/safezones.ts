import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SafezoneService, SafeZone } from '../../core/services/safezone';

@Component({
  selector: 'app-safezones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './safezones.html',
  styleUrl: './safezones.css'
})
export class SafezonesComponent implements OnInit {
  safezones: SafeZone[] = [];
  loading = false;
  showForm = false;
  error = '';

  newZone: SafeZone = {
    name: '', address: '', zoneType: 'SHELTER',
    capacity: 0, currentOccupancy: 0,
    latitude: 0, longitude: 0, contactNumber: ''
  };

  zoneTypes = ['SHELTER', 'HOSPITAL', 'SCHOOL', 'MOSQUE', 'OTHER'];

  constructor(
    private safezoneService: SafezoneService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.safezoneService.getAll().subscribe({
      next: (data) => {
        this.safezones = [...data];
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

  create() {
    this.safezoneService.create(this.newZone).subscribe({
      next: () => { this.showForm = false; this.load(); this.resetForm(); },
      error: () => this.error = 'Failed to create'
    });
  }

  toggle(zone: SafeZone) {
    this.safezoneService.toggleAvailability(zone.id!).subscribe(() => this.load());
  }

  resetForm() {
    this.newZone = {
      name: '', address: '', zoneType: 'SHELTER',
      capacity: 0, currentOccupancy: 0,
      latitude: 0, longitude: 0, contactNumber: ''
    };
  }

  getOccupancyPercent(zone: SafeZone) {
    if (!zone.capacity) return 0;
    return Math.round((zone.currentOccupancy / zone.capacity) * 100);
  }
}