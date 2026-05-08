import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DisasterService, Disaster } from '../../core/services/disaster';

@Component({
  selector: 'app-disasters',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './disasters.html',
  styleUrl: './disasters.css'
})
export class DisastersComponent implements OnInit {
  disasters: Disaster[] = [];
  loading = false;
  showForm = false;
  error = '';

  newDisaster: Disaster = {
    title: '',
    description: '',
    alertType: 'FLOOD',
    severity: 'MEDIUM',
    location: '',
    latitude: 0,
    longitude: 0
  };

  alertTypes = ['FLOOD', 'CYCLONE', 'EARTHQUAKE', 'FIRE', 'OTHER'];
  severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  constructor(
    private disasterService: DisasterService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadDisasters(); }

  loadDisasters() {
    this.loading = true;
    this.disasterService.getAll().subscribe({
      next: (data) => {
        this.disasters = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createDisaster() {
    this.disasterService.create(this.newDisaster).subscribe({
      next: () => {
        this.showForm = false;
        this.loadDisasters();
        this.resetForm();
      },
      error: () => this.error = 'Failed to create'
    });
  }

  toggle(disaster: Disaster) {
    const action = disaster.active
      ? this.disasterService.deactivate(disaster.id!)
      : this.disasterService.activate(disaster.id!);
    action.subscribe(() => this.loadDisasters());
  }

  resetForm() {
    this.newDisaster = {
      title: '', description: '', alertType: 'FLOOD',
      severity: 'MEDIUM', location: '', latitude: 0, longitude: 0
    };
  }

  getSeverityClass(severity: string) {
    return {
      'LOW': 'badge-low',
      'MEDIUM': 'badge-medium',
      'HIGH': 'badge-high',
      'CRITICAL': 'badge-critical'
    }[severity] || '';
  }
}