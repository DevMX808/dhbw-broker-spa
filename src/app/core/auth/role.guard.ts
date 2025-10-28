// src/app/core/auth/role.guard.ts
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { TokenStorageService } from './token-storage.service';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const tokens = inject(TokenStorageService);
  const router = inject(Router);
  const token = tokens.get();
  if (!token || tokens.isExpired(token)) {
    router.navigateByUrl('/account/sign-in');
    return false;
  }
  const payload = tokens.parsePayload(token);
  const expected: string[] = route.data?.['roles'] || [];
  const ok = expected.length === 0 || expected.some(r => payload?.roles?.includes(r));
  if (!ok) {
    router.navigateByUrl('/unauthorized');
    return false;
  }
  return true;
};
