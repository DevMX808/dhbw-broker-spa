import {
  TokenStorageService
} from "./chunk-DFJEWIOY.js";
import {
  Router
} from "./chunk-ZKLCJJRR.js";
import {
  inject
} from "./chunk-T4LT6FP2.js";

// src/app/core/auth/auth.guard.ts
var authGuard = (route, state) => {
  const tokens = inject(TokenStorageService);
  const router = inject(Router);
  const token = tokens.get();
  const valid = token && !tokens.isExpired(token);
  if (valid)
    return true;
  const redirect = encodeURIComponent(state.url || "/");
  router.navigateByUrl(`/account?redirectUrl=${redirect}`);
  return false;
};

export {
  authGuard
};
//# sourceMappingURL=chunk-KEPLL5J6.js.map
