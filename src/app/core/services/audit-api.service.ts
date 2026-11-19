import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuditLogRecord } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuditApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  listLogs(email: string, limit: number, offset: number): Observable<AuditLogRecord[]> {
    let params = new HttpParams().set('limit', limit).set('offset', offset);
    if (email.trim()) {
      params = params.set('email', email.trim());
    }
    return this.http.get<AuditLogRecord[]>(`${this.base}/audit/`, { params });
  }
}
