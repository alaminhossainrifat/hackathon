import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AmbulanceService, Ambulance } from '../../core/services/ambulance';

@Component({
  selector: 'app-ambulances',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ambulances.html',
  styleUrl: './ambulances.css'
})
export class AmbulancesComponent implements OnInit {
  ambulances: Ambulance[] = [];
  loading = false;
  showForm = false;
  error = '';
  searchArea = '';

  newAmbulance: Ambulance = {
    vehicleNumber: '', driverName: '',
    driverPhone: '', area: '', status: 'AVAILABLE'
  };

  statuses = ['AVAILABLE', 'ON_DUTY', 'MAINTENANCE'];

  constructor(
    private ambulanceService: AmbulanceService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.ambulanceService.getAll().subscribe({
      next: (data) => {
        this.ambulances = [...data];
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

  search() {
    if (!this.searchArea.trim()) { this.load(); return; }
    this.loading = true;
    this.ambulanceService.getByArea(this.searchArea).subscribe({
      next: (data) => {
        this.ambulances = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Search failed';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  create() {
    this.ambulanceService.create(this.newAmbulance).subscribe({
      next: () => { this.showForm = false; this.load(); this.resetForm(); },
      error: () => this.error = 'Failed to create'
    });
  }

  updateStatus(ambulance: Ambulance, status: string) {
    this.ambulanceService.updateStatus(ambulance.id!, status).subscribe(() => this.load());
  }

  resetForm() {
    this.newAmbulance = { vehicleNumber: '', driverName: '', driverPhone: '', area: '', status: 'AVAILABLE' };
  }

  getStatusClass(status: string) {
    return {
      'AVAILABLE': 'status-available',
      'ON_DUTY': 'status-duty',
      'MAINTENANCE': 'status-maintenance'
    }[status] || '';
  }
}