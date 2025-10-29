import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const status = err.status;

        if (status === 401) {
          const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/register');

          if (!isAuthRequest) {
            console.warn('[HTTP] 401 Unauthorized → redirect to /account');
            router.navigateByUrl('/account');
          } else {
            console.warn('[HTTP] 401 Unauthorized on auth request → handled by component');
          }
        } else if (status === 403) {
          console.warn('[HTTP] 403 Forbidden → redirect to /unauthorized');
          router.navigateByUrl('/unauthorized');
        } else if (status === 0) {
          console.error('[HTTP] Netzwerkfehler (status 0). URL:', req.url);
          console.error('[HTTP] Error details:', err.message);
        } else if (status >= 500) {
          console.error(`[HTTP] Serverfehler ${status}.`, err);
        } else {
          console.warn(`[HTTP] Fehler ${status}.`, err);
        }
      } else {
        console.error('[HTTP] Unbekannter Fehler:', err);
      }
      return throwError(() => err);
    })
  );
};
