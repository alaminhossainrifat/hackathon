import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { DashboardComponent } from './features/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';
import { MapComponent } from './features/map/map';
import { DisastersComponent } from './features/disasters/disasters';
import { SafezonesComponent } from './features/safezones/safezones';
import { DoctorsComponent } from './features/doctors/doctors';
import { AmbulancesComponent } from './features/ambulances/ambulances';
import { BloodBankComponent } from './features/blood-bank/blood-bank';
import { MissingPersonsComponent } from './features/missing-persons/missing-persons';
import { CivicReportsComponent } from './features/civic-reports/civic-reports';
import { SosComponent } from './features/sos/sos';
import { ResqbotComponent } from './features/resqbot/resqbot';
import { HomeComponent } from './features/home/home';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Guest accessible
  { path: 'map', component: MapComponent },
  { path: 'disasters', component: DisastersComponent },
  { path: 'safezones', component: SafezonesComponent },
  { path: 'resqbot', component: ResqbotComponent },

  // Protected
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'doctors', component: DoctorsComponent, canActivate: [authGuard] },
  { path: 'ambulances', component: AmbulancesComponent, canActivate: [authGuard] },
  { path: 'blood-bank', component: BloodBankComponent, canActivate: [authGuard] },
  { path: 'missing-persons', component: MissingPersonsComponent, canActivate: [authGuard] },
  { path: 'civic-reports', component: CivicReportsComponent, canActivate: [authGuard] },
  { path: 'sos', component: SosComponent, canActivate: [authGuard] },
];