import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  city: string;
  windSpeed: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private http: HttpClient) { }

  // data call from proxy
  getWeather(lat: number | string, lon: number | string): Observable<any> {
    return this.http.get(`${environment.proxyUrl}/weather?lat=${lat}&lon=${lon}`);
  }

  parseWeather(data: any): WeatherData {
    return {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      city: data.name,
      windSpeed: data.wind.speed
    };
  }
}