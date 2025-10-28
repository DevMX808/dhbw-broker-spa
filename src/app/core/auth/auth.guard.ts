import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { TokenStorageService } from './token-storage.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const tokens = inject(TokenStorageService);
  const router = inject(Router);

  const token = tokens.get();
  const valid = token && !tokens.isExpired(token);
  if (valid) return true;

  const redirect = encodeURIComponent(state.url || '/');
  router.navigateByUrl(`/account/sign-in?redirectUrl=${redirect}`);
  return false;
};
