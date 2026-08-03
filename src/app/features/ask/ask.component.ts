import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RagApiService } from '../../core/services/rag-api.service';
import { AskResponse } from '../../core/models/api.models';

@Component({
  selector: 'app-ask',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ask.component.html',
  styleUrl: './ask.component.scss',
})
export class AskComponent {
  private readonly api = inject(RagApiService);

  query = '';
  nResults = 5;
  sourceFilter = '';

  loading = signal(false);
  response = signal<AskResponse | null>(null);
  error = signal<string | null>(null);

  submit(): void {
    if (!this.query.trim() || this.loading()) return;

    this.loading.set(true);
    this.error.set(null);
    this.response.set(null);

    this.api
      .ask({
        query: this.query.trim(),
        n_results: this.nResults,
        source_filter: this.sourceFilter.trim() || null,
      })
      .subscribe({
        next: res => { this.response.set(res); this.loading.set(false); },
        error: err => {
          this.error.set(err.error?.detail);
          this.loading.set(false);
        },      });
  }

  clear(): void {
    this.query = '';
    this.sourceFilter = '';
    this.nResults = 5;
    this.response.set(null);
    this.error.set(null);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      this.submit();
    }
  }
}
