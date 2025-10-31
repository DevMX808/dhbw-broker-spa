import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const valid = authService.isAuthenticated();
  if (valid) return true;

  const redirect = encodeURIComponent(state.url || '/');
  router.navigateByUrl(`/account?redirectUrl=${redirect}`);
  return false;
};
