import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Disaster {
  id?: number;
  title: string;
  description: string;
  alertType: 'FLOOD' | 'CYCLONE' | 'EARTHQUAKE' | 'FIRE' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  latitude: number;
  longitude: number;
  active?: boolean;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class DisasterService {
  private apiUrl = `${environment.apiUrl}/disasters`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Disaster[]>(this.apiUrl);
  }

  create(data: Disaster) {
    return this.http.post<Disaster>(this.apiUrl, data);
  }

  activate(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivate(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/deactivate`, {});
  }
}