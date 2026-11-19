import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CurrentUser, LoginRequest, MeResponse, TokenResponse } from '../models/auth.models';

const TOKEN_KEY = 'rag_auth_token';
const USER_KEY = 'rag_auth_user';

/** Reads the `exp` (seconds since epoch) out of a JWT without verifying its
 * signature — the token is opaque to the client, this is only so the UI can
 * tell a stale session apart from a logged-out one before the next request. */
function decodeExpiry(token: string): number | null {
  try {
    const [, payload] = token.split('.');
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof json.exp === 'number' ? json.exp : null;
  } catch {
    return null;
  }
}

function isExpired(token: string): boolean {
  const exp = decodeExpiry(token);
  return exp === null || exp * 1000 <= Date.now();
}

function readStoredToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  if (isExpired(token)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }
  return token;
}

function readStoredUser(): CurrentUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  private readonly _token = signal<string | null>(readStoredToken());
  private readonly _user = signal<CurrentUser | null>(readStoredUser());

  readonly currentUser = computed(() => this._user());
  readonly isLoggedIn = computed(() => this._token() !== null && this._user() !== null);
  readonly isAdmin = computed(() => this._user()?.role === 'administrativo');

  /** Synchronous read for interceptors/guards. */
  token(): string | null {
    return this._token();
  }

  login(credentials: LoginRequest): Observable<CurrentUser> {
    return this.http.post<TokenResponse>(`${this.base}/auth/login`, credentials).pipe(
      // The access token carries only the user id (see api-rag/app/core/tokens.py);
      // e-mail and role come from /auth/me, fetched right after login with the
      // fresh token (the auth interceptor reads it synchronously via token()).
      switchMap(res => {
        this._token.set(res.access_token);
        localStorage.setItem(TOKEN_KEY, res.access_token);
        return this.http.get<MeResponse>(`${this.base}/auth/me`);
      }),
      map(me => ({ email: me.email ?? credentials.email, role: me.role })),
      tap(user => {
        this._user.set(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }),
    );
  }

  logout(): void {
    this._token.set(null);
    this._user.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
