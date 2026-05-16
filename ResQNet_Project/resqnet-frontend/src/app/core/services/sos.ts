import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SosRequest {
  senderName: string;
  senderPhone: string;
  latitude: number;
  longitude: number;
  message: string;
}

// Added to match the Backend SosResponse DTO precisely
export interface SosResponse {
  sosId: number;
  message: string;
  nearest: {
    ambulanceArea?: string;
    ambulancePhone?: string;
    safeZoneName?: string;
    safeZoneAddress?: string;
  };
}

export interface SosAlert {
  id?: number;
  status: string;
  senderName: string;
  senderPhone: string;
  latitude: number;
  longitude: number;
  message: string;
  resolved?: boolean;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class SosService {
  private apiUrl = `${environment.apiUrl}/sos`;

  constructor(private http: HttpClient) {}

  // Trigger SOS, expects SosResponse from backend
  trigger(data: SosRequest): Observable<SosResponse> {
    return this.http.post<SosResponse>(`${this.apiUrl}/trigger`, data);
  }

  // Get active SOS alerts
  getActive(): Observable<SosAlert[]> {
    return this.http.get<SosAlert[]>(`${this.apiUrl}/active`);
  }

  // Resolve an active SOS alert
  resolve(id: number): Observable<SosAlert> {
    return this.http.put<SosAlert>(`${this.apiUrl}/${id}/resolve`, {});
  }
}