import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CivicReportService, CivicReport } from '../../core/services/civic-report';

@Component({
  selector: 'app-civic-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './civic-reports.html',
  styleUrl: './civic-reports.css'
})
export class CivicReportsComponent implements OnInit {
  reports: CivicReport[] = [];
  loading = false;
  showForm = false;
  error = '';
  filterStatus = '';

  newReport: CivicReport = {
    title: '', description: '', reportType: 'ROAD_DAMAGE',
    location: '', reporterName: '', reporterPhone: ''
  };

  reportTypes = ['ROAD_DAMAGE', 'WATERLOGGING', 'POWER_OUTAGE', 'GAS_LEAK', 'FIRE', 'OTHER'];
  statuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];

  constructor(
    private civicReportService: CivicReportService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const obs = this.filterStatus
      ? this.civicReportService.getByStatus(this.filterStatus)
      : this.civicReportService.getAll();

    obs.subscribe({
      next: (data) => {
        this.reports = [...data];
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
    this.civicReportService.create(this.newReport).subscribe({
      next: () => { this.showForm = false; this.load(); this.resetForm(); },
      error: () => this.error = 'Failed to submit'
    });
  }

  updateStatus(report: CivicReport, status: string) {
    this.civicReportService.updateStatus(report.id!, status).subscribe(() => this.load());
  }

  resetForm() {
    this.newReport = {
      title: '', description: '', reportType: 'ROAD_DAMAGE',
      location: '', reporterName: '', reporterPhone: ''
    };
  }

  getStatusClass(status: string) {
    return {
      'PENDING': 'status-pending',
      'IN_PROGRESS': 'status-progress',
      'RESOLVED': 'status-resolved'
    }[status] || '';
  }

  getTypeIcon(type: string) {
    return {
      'ROAD_DAMAGE': '🛣️',
      'WATERLOGGING': '🌊',
      'POWER_OUTAGE': '⚡',
      'GAS_LEAK': '💨',
      'FIRE': '🔥',
      'OTHER': '📋'
    }[type] || '📋';
  }
}