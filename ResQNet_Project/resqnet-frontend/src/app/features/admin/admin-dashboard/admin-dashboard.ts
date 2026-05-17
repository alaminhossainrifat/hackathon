import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminMetrics, SosAlert } from '../../../core/services/admin';

interface TableSosData {
  id: number;
  name: string;
  phone: string;
  location: string;
  status: string;
  time: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {

  // Updated stats structure to match the backend DTO
  stats = [
    { title: 'Total Users', value: 0, icon: '👥', color: '#00b09b' },
    { title: 'Total Volunteers', value: 0, icon: '🤝', color: '#f7971e' },
    { title: 'Active SOS Alerts', value: 0, icon: '🚨', color: '#ff4444' },
    { title: 'Active Safe Zones', value: 0, icon: '🏠', color: '#28a745' }
  ];

  recentSos: TableSosData[] = [];

  constructor(
    private adminService: AdminService, // Inject only the AdminService
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  // Fetch both Metrics and SOS data inside a single method
  private loadDashboardData() {

    // 1. Load Metrics (Phase 2)
    this.adminService.getMetrics().subscribe({
      next: (data: AdminMetrics) => {
        this.stats[0].value = data.totalUsers;
        this.stats[1].value = data.totalVolunteers;
        this.stats[2].value = data.totalActiveSos;
        this.stats[3].value = data.totalActiveSafeZones;

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load metrics:', err)
    });

    // 2. Load SOS Requests (Phase 4)
    this.adminService.getAllSosAlerts().subscribe({
      next: (data: SosAlert[]) => {

        if (data && data.length > 0) {

          // Map the latest SOS data into the table format
          this.recentSos = data.map(sos => {

            const locationStr =
              (sos.latitude != null && sos.longitude != null)
                ? `${sos.latitude.toFixed(4)}, ${sos.longitude.toFixed(4)}`
                : 'GPS Unavailable';

            let formattedTime = 'Just now';

            if (sos.createdAt) {
              const dateObj = new Date(sos.createdAt);

              if (!isNaN(dateObj.getTime())) {
                formattedTime = dateObj.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                });
              }
            }

            return {
              id: sos.id,
              name: sos.senderName || 'Unknown',
              phone: sos.senderPhone || 'N/A',
              location: locationStr,
              status: sos.status || 'ACTIVE',
              time: formattedTime
            };
          });

        } else {
          this.recentSos = [];
        }

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load SOS alerts:', err)
    });
  }

  // 3. Resolve SOS Action (Phase 4)
  resolveSosAlert(sosId: number) {

    if (confirm('Are you sure you want to mark this emergency as RESOLVED?')) {

      this.adminService.updateSosStatus(sosId, 'RESOLVED').subscribe({
        next: () => {
          alert('✅ SOS Status updated to RESOLVED!');

          // Reload dashboard data after updating the status
          this.loadDashboardData();
        },

        error: (err) => {
          console.error(err);
          alert('❌ Failed to update status. Check console for details.');
        }
      });
    }
  }
}