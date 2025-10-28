import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from './token-storage.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const tokens = inject(TokenStorageService);

  // Check if request is to our backend API
  const url = new URL(req.url, document.baseURI);
  const isBackendRequest = url.hostname === 'localhost' && (url.port === '8080' || url.pathname.startsWith('/api') || url.pathname.startsWith('/graphql'));

  const token = tokens.get();
  const validToken = token && !tokens.isExpired(token);

  // Don't add authorization header for login/register requests
  const isAuthRequest = url.pathname.startsWith('/auth');

  if (isBackendRequest && validToken && !req.headers.has('Authorization') && !isAuthRequest) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }
  return next(req);
};
