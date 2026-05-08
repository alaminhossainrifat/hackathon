import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface MissingPerson {
  id?: number;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  lastSeenLocation: string;
  description: string;

  reporterName: string;
  reporterPhone: string;

  status?: 'MISSING' | 'FOUND';
  reportedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class MissingPersonService {
  private apiUrl = `${environment.apiUrl}/missing-persons`;

  constructor(private http: HttpClient) { }

  getAll() { return this.http.get<MissingPerson[]>(this.apiUrl); }
  create(data: MissingPerson) { return this.http.post<MissingPerson>(this.apiUrl, data); }
  markFound(id: number) { return this.http.put(`${this.apiUrl}/${id}/found`, {}); }
  searchByName(name: string) { return this.http.get<MissingPerson[]>(`${this.apiUrl}/search/name/${name}`); }
  searchByLocation(loc: string) { return this.http.get<MissingPerson[]>(`${this.apiUrl}/search/location/${loc}`); }
}