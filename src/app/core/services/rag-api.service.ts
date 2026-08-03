import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AskRequest,
  AskResponse,
  CollectionStatsResponse,
  DeleteDocumentResponse,
  HealthResponse,
  ProcessDocumentResponse,
  SearchRequest,
  SearchResponse,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class RagApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  // ── Health ──────────────────────────────────────────────────
  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.base}/health`);
  }

  // ── Documents ───────────────────────────────────────────────
  uploadDocument(
    file: File,
    chunkSize = 500,
    overlap = 100
  ): Observable<ProcessDocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const params = new HttpParams()
      .set('chunk_size', chunkSize)
      .set('overlap', overlap);
    return this.http.post<ProcessDocumentResponse>(
      `${this.base}/documents/upload`,
      formData,
      { params }
    );
  }

  getDocuments(): Observable<CollectionStatsResponse> {
    return this.http.get<CollectionStatsResponse>(`${this.base}/documents/`);
  }

  deleteDocument(pdfName: string): Observable<DeleteDocumentResponse> {
    return this.http.delete<DeleteDocumentResponse>(
      `${this.base}/documents/${encodeURIComponent(pdfName)}`
    );
  }

  clearCollection(): Observable<void> {
    return this.http.delete<void>(`${this.base}/documents/`);
  }

  // ── Search ──────────────────────────────────────────────────
  search(body: SearchRequest): Observable<SearchResponse> {
    return this.http.post<SearchResponse>(`${this.base}/search/`, body);
  }

  ask(body: AskRequest): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.base}/search/ask`, body);
  }
}
