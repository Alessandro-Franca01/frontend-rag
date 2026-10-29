import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateUserRequest, UpdateUserRequest, UserRecord } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  listUsers(): Observable<UserRecord[]> {
    return this.http.get<UserRecord[]>(`${this.base}/users/`);
  }

  createUser(body: CreateUserRequest): Observable<UserRecord> {
    return this.http.post<UserRecord>(`${this.base}/users/`, body);
  }

  updateUser(id: number, body: UpdateUserRequest): Observable<UserRecord> {
    return this.http.patch<UserRecord>(`${this.base}/users/${id}`, body);
  }
}
