import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  id?: number;
  userId?: number;
  name: string;
  phone: string;
  bloodGroup: string;
  medicalConditions: string;
  emergencyContact1: string;
  emergencyContact2: string;
  isVolunteer: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) { }

  // Fetch profile. The JWT interceptor automatically attaches the Bearer token.
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl);
  }

  // Update profile. The JWT interceptor automatically attaches the Bearer token.
  updateProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.apiUrl, profile);
  }

  // Fetch SOS history for the dynamically authenticated user
  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`);
  }
}