import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) { }

  register(data: { name: string; email: string; password: string; phone: string }) {
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, { responseType: 'text' })
      .pipe(tap(res => localStorage.setItem('token', res)));
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Method to decode the JWT token and extract the user role
  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      // Decode the middle part (Payload) of the token from Base64
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role; // The backend sends the data with the key 'role'
    } catch (e) {
      return null;
    }
  }

  // Method to check whether the user is an admin
  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }
}