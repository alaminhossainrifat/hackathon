export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role?: 'USER' | 'DOCTOR' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}