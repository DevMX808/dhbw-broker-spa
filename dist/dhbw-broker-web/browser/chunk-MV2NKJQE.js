import {
  TokenStorageService
} from "./chunk-JSOLXCOT.js";
import {
  Router
} from "./chunk-OW27TKOS.js";
import {
  inject
} from "./chunk-ASFNRD7L.js";

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
//# sourceMappingURL=chunk-MV2NKJQE.js.map
