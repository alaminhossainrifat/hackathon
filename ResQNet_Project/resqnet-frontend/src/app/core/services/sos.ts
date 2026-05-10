import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface SosRequest {
  senderName: string;
  senderPhone: string;
  latitude: number;
  longitude: number;
  message: string;
}

export interface SosAlert {
  id?: number;
  senderName: string;
  senderPhone: string;
  latitude: number;
  longitude: number;
  message: string;
  resolved?: boolean;
  nearestAmbulance?: any;
  nearestSafeZone?: any;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class SosService {
  private apiUrl = `${environment.apiUrl}/sos`;

  constructor(private http: HttpClient) {}

  trigger(data: SosRequest) {
    return this.http.post<SosAlert>(`${this.apiUrl}/trigger`, data);
  }

  getActive() {
    return this.http.get<SosAlert[]>(`${this.apiUrl}/active`);
  }

  resolve(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/resolve`, {});
  }
}