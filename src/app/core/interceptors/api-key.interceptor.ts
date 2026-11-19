import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

export function apiKeyInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  // A logged-in JWT already identifies the caller's role; the API key equals
  // `administrativo`, so sending both would silently escalate a consultor.
  if (!environment.apiKey || inject(AuthService).token()) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { 'X-API-Key': environment.apiKey } }));
}
