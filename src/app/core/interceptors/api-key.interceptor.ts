import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export function apiKeyInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (!environment.apiKey) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { 'X-API-Key': environment.apiKey } }));
}
