import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

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
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  getWeather(lat: number, lon: number): Promise<any> {
    return fetch(
      `${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${environment.weatherApiKey}&units=metric`
    ).then(r => r.json());
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