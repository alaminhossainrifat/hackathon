import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Ambulance {
  id?: number;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  area: string;
  status: 'AVAILABLE' | 'ON_DUTY' | 'MAINTENANCE';
  currentLatitude?: number;
  currentLongitude?: number;
}

@Injectable({ providedIn: 'root' })
export class AmbulanceService {
  private apiUrl = `${environment.apiUrl}/ambulances`;

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Ambulance[]>(this.apiUrl); }
  create(data: Ambulance) { return this.http.post<Ambulance>(this.apiUrl, data); }
  updateStatus(id: number, status: string) {
    return this.http.put(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }
  getByArea(area: string) {
    return this.http.get<Ambulance[]>(`${this.apiUrl}/area/${area}`);
  }
}