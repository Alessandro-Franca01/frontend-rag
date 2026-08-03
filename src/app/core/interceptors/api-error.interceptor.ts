import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const DEFAULT_CONNECTION_ERROR = 'Erro ao conectar com a API.';
export const DEFAULT_GENERIC_ERROR = 'Ocorreu um erro inesperado.';

interface FastApiValidationItem {
  loc?: (string | number)[];
  msg?: string;
  type?: string;
}

function extractDetail(error: HttpErrorResponse): string | null {
  const body = error.error;
  if (!body || typeof body !== 'object') return null;

  const detail = (body as { detail?: unknown }).detail;
  if (typeof detail === 'string' && detail.trim()) return detail;

  if (Array.isArray(detail)) {
    const parts = (detail as FastApiValidationItem[])
      .filter((item) => typeof item?.msg === 'string')
      .map((item) => {
        const field = (item.loc ?? []).slice(1).join('.');
        return field ? `${field}: ${item.msg}` : item.msg;
      });
    if (parts.length) return parts.join('; ');
  }

  return null;
}

export function apiErrorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message: string;
      if (error instanceof HttpErrorResponse) {
        message = extractDetail(error) ?? DEFAULT_GENERIC_ERROR;
      } else {
        message = DEFAULT_CONNECTION_ERROR;
      }
      const normalized = new HttpErrorResponse({
        error: { detail: message },
        status: error.status,
        statusText: error.statusText,
        url: error.url ?? undefined,
      });
      return throwError(() => normalized);
    }),
  );
}
