import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, DisasterAlert } from '../../../core/services/admin';

@Component({
  selector: 'app-admin-disasters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-disasters.html',
  styleUrls: ['./admin-disasters.css']
})
export class AdminDisastersComponent implements OnInit {
  disasters: DisasterAlert[] = [];
  isLoading = false;
  showForm = false;

  newDisaster: DisasterAlert = {
    title: '',
    description: '',
    alertType: 'FLOOD',
    severity: 'HIGH',
    location: ''
  };

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadDisasters();
  }

  loadDisasters() {
    this.isLoading = true;
    this.adminService.getAllDisasters().subscribe({
      next: (data) => {
        this.disasters = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  submitDisaster() {
    if (!this.newDisaster.title || !this.newDisaster.location) {
      alert('Please fill out the required fields!');
      return;
    }

    this.adminService.createDisaster(this.newDisaster).subscribe({
      next: () => {
        alert('✅ New Disaster Alert Broadcasted Successfully!');
        this.showForm = false;
        this.resetForm();
        this.loadDisasters();
      },
      error: () => alert('❌ Failed to create alert.')
    });
  }

  toggleStatus(disaster: DisasterAlert) {
    if (!disaster.id) return;
    
    if (disaster.active) {
      this.adminService.deactivateDisaster(disaster.id).subscribe(() => this.loadDisasters());
    } else {
      this.adminService.activateDisaster(disaster.id).subscribe(() => this.loadDisasters());
    }
  }

  resetForm() {
    this.newDisaster = { title: '', description: '', alertType: 'FLOOD', severity: 'HIGH', location: '' };
  }
}