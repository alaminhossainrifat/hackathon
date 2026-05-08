import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface BloodDonor {
  id?: number;
  donorName: string;
  bloodGroup: 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' |
              'O_POSITIVE' | 'O_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE';
  area: string;
  phone: string;
  available?: boolean;
}

@Injectable({ providedIn: 'root' })
export class BloodBankService {
  private apiUrl = `${environment.apiUrl}/blood-bank`;

  constructor(private http: HttpClient) {}

  getByBloodGroup(group: string) {
    return this.http.get<BloodDonor[]>(`${this.apiUrl}/${group}`);
  }

  getByGroupAndArea(group: string, area: string) {
    return this.http.get<BloodDonor[]>(`${this.apiUrl}/${group}/${area}`);
  }

  create(data: BloodDonor) {
    return this.http.post<BloodDonor>(this.apiUrl, data);
  }

  toggleAvailability(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/toggle-availability`, {});
  }
}