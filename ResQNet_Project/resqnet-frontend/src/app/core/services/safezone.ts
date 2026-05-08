import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface SafeZone {
  id?: number;
  name: string;
  address: string;
  zoneType: 'SHELTER' | 'HOSPITAL' | 'SCHOOL' | 'MOSQUE' | 'OTHER';
  capacity: number;
  currentOccupancy: number;
  available?: boolean;
  latitude: number;
  longitude: number;
  contactNumber: string;
}

@Injectable({ providedIn: 'root' })
export class SafezoneService {
  private apiUrl = `${environment.apiUrl}/safezones`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<SafeZone[]>(this.apiUrl);
  }

  create(data: SafeZone) {
    return this.http.post<SafeZone>(this.apiUrl, data);
  }

  updateOccupancy(id: number, occupancy: number) {
    return this.http.put(`${this.apiUrl}/${id}/occupancy?occupancy=${occupancy}`, {});
  }

  toggleAvailability(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/toggle-availability`, {});
  }
}