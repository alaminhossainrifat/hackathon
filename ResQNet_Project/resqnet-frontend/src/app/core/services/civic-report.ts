import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface CivicReport {
  id?: number;
  title: string;
  description: string;
  reportType: 'ROAD_DAMAGE' | 'WATERLOGGING' | 'POWER_OUTAGE' | 'GAS_LEAK' | 'FIRE' | 'OTHER';
  status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  location: string;
  reporterName: string;
  reporterPhone: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class CivicReportService {
  private apiUrl = `${environment.apiUrl}/civic-reports`;

  constructor(private http: HttpClient) { }

  getAll() { return this.http.get<CivicReport[]>(this.apiUrl); }
  create(data: CivicReport) { return this.http.post<CivicReport>(this.apiUrl, data); }
  updateStatus(id: number, status: string) {
    return this.http.put(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }
  getByStatus(status: string) {
    return this.http.get<CivicReport[]>(`${this.apiUrl}/status/${status}`);
  }
  getByType(type: string) {
    return this.http.get<CivicReport[]>(`${this.apiUrl}/type/${type}`);
  }
}