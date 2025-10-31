import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    void router.navigateByUrl('/account');
    return false;
  }

  const expected: string[] = route.data?.['roles'] || [];
  const ok = expected.length === 0 || expected.some(r => authService.hasRole(r));
  if (!ok) {
    void router.navigateByUrl('/unauthorized');
    return false;
  }
  return true;
};
