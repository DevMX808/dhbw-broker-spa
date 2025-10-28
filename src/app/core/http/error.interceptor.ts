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
          console.warn('[HTTP] 401 Unauthorized → redirect to /account/sign-in');
          router.navigateByUrl('/account/sign-in');
        } else if (status === 403) {
          console.warn('[HTTP] 403 Forbidden → redirect to /unauthorized');
          router.navigateByUrl('/unauthorized');
        } else if (status === 0) {
          // Netzwerkfehler / CORS / Dev-Server down
          console.error('[HTTP] Netzwerkfehler (status 0).', err);
        } else if (status >= 500) {
          console.error(`[HTTP] Serverfehler ${status}.`, err);
          // Optional: router.navigateByUrl('/error');
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
