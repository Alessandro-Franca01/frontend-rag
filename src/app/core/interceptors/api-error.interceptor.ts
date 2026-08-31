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
export const DEFAULT_UNAUTHORIZED_ERROR = 'Não autorizado. Verifique a chave de API.';

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
      // status 0 means the request never reached a server (network failure,
      // DNS, CORS preflight rejection, etc.) — HttpClient always delivers an
      // HttpErrorResponse, so `error.error` here is a ProgressEvent, not a
      // FastAPI body. Reading `.detail` off it silently falls through to
      // DEFAULT_GENERIC_ERROR instead of a "can't connect" message.
      let message: string;
      if (error.status === 0) {
        message = DEFAULT_CONNECTION_ERROR;
      } else if (error.status === 401) {
        message = DEFAULT_UNAUTHORIZED_ERROR;
      } else {
        message = extractDetail(error) ?? DEFAULT_GENERIC_ERROR;
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
