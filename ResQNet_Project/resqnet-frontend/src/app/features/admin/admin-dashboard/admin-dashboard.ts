import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmbulanceService } from '../../../core/services/ambulance';
import { DisasterService } from '../../../core/services/disaster';
import { SafezoneService } from '../../../core/services/safezone';
import { SosService } from '../../../core/services/sos';


interface TableSosData {
  id: string;
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
  
  stats = [
    { title: 'Active Disasters', value: 0, icon: '🚨', color: '#e94560' },
    { title: 'Active SOS', value: 0, icon: '🆘', color: '#ff4444' },
    { title: 'Safe Zones', value: 0, icon: '🏠', color: '#00b09b' },
    { title: 'Total Ambulances', value: 0, icon: '🚑', color: '#f7971e' }
  ];

  recentSos: TableSosData[] = [];

  constructor(
    private disasterService: DisasterService,
    private sosService: SosService,
    private safezoneService: SafezoneService,
    private ambulanceService: AmbulanceService,
    private cdr: ChangeDetectorRef // Force UI updates for asynchronous data
  ) {}

  ngOnInit() {
    this.loadRealStats();
    this.loadRealSosRequests();
  }

  private loadRealStats() {
    // Fetch and count active disasters
    this.disasterService.getAll().subscribe({
      next: (data: any[]) => {
        this.stats[0].value = data.filter(d => d.active === true || d.active === 'true').length;
        this.cdr.detectChanges(); // Trigger change detection
      }
    });

    // Fetch and count active SOS alerts
    this.sosService.getActive().subscribe({
      next: (data: any[]) => {
        this.stats[1].value = data.length;
        this.cdr.detectChanges(); // Trigger change detection
      }
    });

    // Fetch and count all safe zones
    this.safezoneService.getAll().subscribe({
      next: (data: any[]) => {
        this.stats[2].value = data.length;
        this.cdr.detectChanges(); // Trigger change detection
      }
    });

    // Fetch and count all registered ambulances
    this.ambulanceService.getAll().subscribe({
      next: (data: any[]) => {
        this.stats[3].value = data.length;
        this.cdr.detectChanges(); // Trigger change detection
      }
    });
  }

  private loadRealSosRequests() {
    // Fetch active SOS requests and map to table format
    this.sosService.getActive().subscribe({
      next: (data: any[]) => {
        if (data && data.length > 0) {
          // Display top 5 recent requests
          this.recentSos = data.slice(0, 5).map(sos => {
            
            // Safely format coordinates or fallback to placeholder
            const locationStr = (sos.latitude != null && sos.longitude != null) 
              ? `${sos.latitude.toFixed(4)}, ${sos.longitude.toFixed(4)}` 
              : 'GPS Unavailable';

            // Parse backend LocalDateTime string to readable format
            let formattedTime = 'Just now';
            if (sos.createdAt) {
               const dateObj = new Date(sos.createdAt);
               if (!isNaN(dateObj.getTime())) {
                 formattedTime = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
               }
            }

            return {
              id: sos.id ? `#${sos.id}` : `#${Math.floor(Math.random() * 1000)}`,
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
        this.cdr.detectChanges(); // Trigger change detection for table render
      }
    });
  }
}