import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from './token-storage.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const tokens = inject(TokenStorageService);

  // nur Same-Origin anvisieren
  const url = new URL(req.url, document.baseURI);
  const sameOrigin = url.origin === location.origin;

  // nur für API/GraphQL, keine statischen Assets
  const p = url.pathname || '';
  const shouldAttach = sameOrigin && (p.startsWith('/api') || p.startsWith('/graphql'));

  const token = tokens.get();
  const validToken = token && !tokens.isExpired(token);

  if (shouldAttach && validToken && !req.headers.has('Authorization')) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }
  return next(req);
};
