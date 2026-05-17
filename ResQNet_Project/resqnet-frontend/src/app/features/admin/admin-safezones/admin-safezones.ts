import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, SafeZone } from '../../../core/services/admin';

@Component({
  selector: 'app-admin-safezones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-safezones.html',
  styleUrls: ['./admin-safezones.css']
})
export class AdminSafezonesComponent implements OnInit {
  safeZones: SafeZone[] = [];
  isLoading = false;
  showForm = false;

  newZone: SafeZone = {
    name: '',
    address: '',
    latitude: 23.8103, // Default Dhaka coordinates
    longitude: 90.4125,
    zoneType: 'SHELTER',
    capacity: 100
  };

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadSafeZones();
  }

  loadSafeZones() {
    this.isLoading = true;
    this.adminService.getSafeZones().subscribe({
      next: (data) => {
        this.safeZones = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  submitSafeZone() {
    if (!this.newZone.name || !this.newZone.address) {
      alert('Name and Address are required!');
      return;
    }

    this.adminService.createSafeZone(this.newZone).subscribe({
      next: () => {
        alert('✅ New Safe Zone Added Successfully!');
        this.showForm = false;
        this.resetForm();
        this.loadSafeZones();
      },
      error: () => alert('❌ Failed to add Safe Zone.')
    });
  }

  updateOccupancy(zone: SafeZone, event: any) {
    if (!zone.id) return;
    const newOccupancy = parseInt(event.target.value, 10);
    
    if (!isNaN(newOccupancy) && newOccupancy >= 0) {
      this.adminService.updateSafeZoneOccupancy(zone.id, newOccupancy).subscribe({
        next: () => {
           alert('✅ Occupancy Updated!');
           this.loadSafeZones();
        },
        error: () => alert('❌ Failed to update occupancy.')
      });
    }
  }

  toggleAvailability(zone: SafeZone) {
    if (!zone.id) return;
    this.adminService.toggleSafeZoneAvailability(zone.id).subscribe(() => this.loadSafeZones());
  }

  resetForm() {
    this.newZone = { name: '', address: '', latitude: 23.8103, longitude: 90.4125, zoneType: 'SHELTER', capacity: 100 };
  }
}