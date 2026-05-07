export interface SosRequest {
  senderName: string;
  senderPhone: string;
  latitude: number;
  longitude: number;
  message: string;
}

export interface SosResponse {
  id: number;
  nearestAmbulance: any;
  nearestSafeZone: any;
  distance: number;
}