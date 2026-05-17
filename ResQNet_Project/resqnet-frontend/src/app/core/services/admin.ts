import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interface for Dashboard Metrics
export interface AdminMetrics {
  totalUsers: number;
  totalVolunteers: number;
  totalActiveSos: number;
  totalActiveSafeZones: number;
}

// Interface for User Data Management
export interface UserDTO {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'DOCTOR' | 'VOLUNTEER' | 'ADMIN';
}

// Interface for SOS Emergency Alerts
export interface SosAlert {
  id: number;
  userId: number;
  senderName: string;
  senderPhone: string;
  latitude: number;
  longitude: number;
  message: string;
  status: 'ACTIVE' | 'RESOLVED';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // --- Dashboard Metrics ---
  // Fetches aggregated system statistics
  getMetrics(): Observable<AdminMetrics> {
    return this.http.get<AdminMetrics>(`${this.apiUrl}/metrics`);
  }

  // --- User & Volunteer Management ---
  // Retrieves the complete list of registered users
  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/users`);
  }

  // Updates a specific user's role using request parameters
  updateUserRole(userId: number, role: string): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/users/${userId}/role`, null, {
      params: { role: role }
    });
  }

  // --- SOS Command Center ---
  // Fetches all incoming SOS emergency alerts sorted by newest first
  getAllSosAlerts(): Observable<SosAlert[]> {
    return this.http.get<SosAlert[]>(`${this.apiUrl}/sos`);
  }

  // Updates the status of an emergency SOS alert (ACTIVE to RESOLVED)
  updateSosStatus(sosId: number, status: string): Observable<SosAlert> {
    return this.http.put<SosAlert>(`${this.apiUrl}/sos/${sosId}/status`, null, {
      params: { status: status }
    });
  }
}