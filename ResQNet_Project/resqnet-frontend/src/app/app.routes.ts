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
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard';
import { ProfileComponent } from './profile/profile';
import { adminGuard } from './core/guards/admin-guard';
import { AdminUsersComponent } from './features/admin/admin-users/admin-users';
import { AdminDisastersComponent } from './features/admin/admin-disasters/admin-disasters';
import { AdminSafezonesComponent } from './features/admin/admin-safezones/admin-safezones';



export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },

  // SECURED ADMIN ROUTE
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      // NEW: Users management route
      { path: 'users', component: AdminUsersComponent },
      { path: 'disasters', component: AdminDisastersComponent },
      { path: 'safezones', component: AdminSafezonesComponent }
    ]
  },

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