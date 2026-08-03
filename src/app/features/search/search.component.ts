import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RagApiService } from '../../core/services/rag-api.service';
import { ChunkResult, SearchResponse } from '../../core/models/api.models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  private readonly api = inject(RagApiService);

  query = '';
  nResults = 5;
  sourceFilter = '';

  loading = signal(false);
  response = signal<SearchResponse | null>(null);
  error = signal<string | null>(null);
  expandedChunk = signal<number | null>(null);

  submit(): void {
    if (!this.query.trim() || this.loading()) return;

    this.loading.set(true);
    this.error.set(null);
    this.response.set(null);
    this.expandedChunk.set(null);

    this.api
      .search({
        query: this.query.trim(),
        n_results: this.nResults,
        source_filter: this.sourceFilter.trim() || null,
      })
      .subscribe({
        next: res => { this.response.set(res); this.loading.set(false); },
        error: err => {
          this.error.set(err.error?.detail);
          this.loading.set(false);
        },
      });
  }

  clear(): void {
    this.query = '';
    this.sourceFilter = '';
    this.nResults = 5;
    this.response.set(null);
    this.error.set(null);
  }

  toggleChunk(index: number): void {
    this.expandedChunk.set(this.expandedChunk() === index ? null : index);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      this.submit();
    }
  }

  relevancePercent(distance: number | null | undefined): number {
    if (distance === null || distance === undefined) return 0;
    // cosine distance [0,2] → similarity [100,0]
    return Math.round(Math.max(0, (1 - distance) * 100));
  }

  relevanceColor(distance: number | null | undefined): string {
    const pct = this.relevancePercent(distance);
    if (pct >= 75) return 'var(--success)';
    if (pct >= 50) return 'var(--amber)';
    return 'var(--danger)';
  }
}
