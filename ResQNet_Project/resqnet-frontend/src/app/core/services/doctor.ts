import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Doctor {
  id?: number;
  name: string;
  specialization: string;
  area: string;
  phone: string;
  consultType: 'IN_PERSON' | 'ONLINE' | 'BOTH';
  available?: boolean;
}

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/doctors`;

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Doctor[]>(this.apiUrl); }
  create(data: Doctor) { return this.http.post<Doctor>(this.apiUrl, data); }
  toggleAvailability(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/toggle-availability`, {});
  }
  getByArea(area: string) {
    return this.http.get<Doctor[]>(`${this.apiUrl}/area/${area}`);
  }
}