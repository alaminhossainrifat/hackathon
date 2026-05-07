export interface Disaster {
  id?: number;
  title: string;
  description: string;
  alertType: 'FLOOD' | 'CYCLONE' | 'EARTHQUAKE' | 'FIRE' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  latitude: number;
  longitude: number;
  active?: boolean;
  createdAt?: string;
}