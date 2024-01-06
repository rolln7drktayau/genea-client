import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService:AuthService = inject(AuthService);
  const router: Router = inject(Router);
  console.log('Guard => Can connect ? ', authService.isAValidUser);
  // if (authService.isAValidUser) {
  //   return true;
  // } else {
  //   return false;
  // }
  return authService.isAValidUser;
};