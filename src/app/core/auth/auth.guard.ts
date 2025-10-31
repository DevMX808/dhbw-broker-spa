import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {  // Neu: _route für unused (fix TS6133)
  const authService = inject(AuthService);
  const router = inject(Router);

  const valid = authService.isAuthenticated();
  if (valid) return true;

  const redirect = encodeURIComponent(state.url || '/');
  void router.navigateByUrl(`/account?redirectUrl=${redirect}`);
  return false;
};
