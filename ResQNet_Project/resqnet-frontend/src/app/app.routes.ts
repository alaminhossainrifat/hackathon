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




export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'map', component: MapComponent, canActivate: [authGuard] },
  { path: 'disasters', component: DisastersComponent, canActivate: [authGuard] },
  { path: 'safezones', component: SafezonesComponent, canActivate: [authGuard] },
  { path: 'doctors', component: DoctorsComponent, canActivate: [authGuard] },
  { path: 'ambulances', component: AmbulancesComponent, canActivate: [authGuard] },
  { path: 'blood-bank', component: BloodBankComponent, canActivate: [authGuard] },
  { path: 'missing-persons', component: MissingPersonsComponent, canActivate: [authGuard] },
];