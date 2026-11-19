import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const auth = inject(AuthService);
  const token = auth.token();
  const authedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // A 401 on /auth/login means "wrong password", not "session expired" —
      // logging out here would just wipe the form the user is typing into.
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        auth.logout();
        inject(Router).navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
}
