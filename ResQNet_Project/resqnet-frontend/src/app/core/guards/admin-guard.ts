import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Allow access only if the user is logged in and has the ADMIN role
  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  // Redirect normal users to the dashboard or homepage
  router.navigate(['/dashboard']);
  return false;
};