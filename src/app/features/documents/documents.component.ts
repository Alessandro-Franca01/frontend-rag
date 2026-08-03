import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RagApiService } from '../../core/services/rag-api.service';
import { CollectionStatsResponse } from '../../core/models/api.models';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
})
export class DocumentsComponent implements OnInit {
  private readonly api = inject(RagApiService);

  stats = signal<CollectionStatsResponse | null>(null);
  loadingStats = signal(true);
  statsError = signal<string | null>(null);

  uploading = signal(false);
  uploadSuccess = signal<string | null>(null);
  uploadError = signal<string | null>(null);

  deletingDoc = signal<string | null>(null);
  deleteError = signal<string | null>(null);
  clearError = signal<string | null>(null);

  chunkSize = 500;
  overlap = 100;

  isDragging = signal(false);
  confirmClear = signal(false);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loadingStats.set(true);
    this.statsError.set(null);
    this.api.getDocuments().subscribe({
      next: s  => { this.stats.set(s); this.loadingStats.set(false); },
      error: err => {
        this.statsError.set(err.error?.detail);
        this.loadingStats.set(false);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) this.upload(input.files[0]);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.upload(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(): void {
    this.isDragging.set(false);
  }

  private upload(file: File): void {
    if (!file.name.endsWith('.pdf')) {
      this.uploadError.set('Apenas arquivos PDF são aceitos.');
      return;
    }
    this.uploading.set(true);
    this.uploadSuccess.set(null);
    this.uploadError.set(null);

    this.api.uploadDocument(file, this.chunkSize, this.overlap).subscribe({
      next: res => {
        this.uploadSuccess.set(res.message);
        this.uploading.set(false);
        this.loadStats();
      },
      error: err => {
        this.uploadError.set(err.error?.detail);
        this.uploading.set(false);
      },
    });
  }

  deleteDoc(name: string): void {
    this.deletingDoc.set(name);
    this.deleteError.set(null);
    this.api.deleteDocument(name).subscribe({
      next: () => { this.deletingDoc.set(null); this.loadStats(); },
      error: err => {
        this.deleteError.set(err.error?.detail);
        this.deletingDoc.set(null);
      },
    });
  }

  clearAll(): void {
    if (!this.confirmClear()) { this.confirmClear.set(true); return; }
    this.confirmClear.set(false);
    this.clearError.set(null);
    this.api.clearCollection().subscribe({
      next: () => this.loadStats(),
      error: err => {
        this.clearError.set(err.error?.detail);
        this.loadStats();
      },
    });
  }

  cancelClear(): void {
    this.confirmClear.set(false);
  }
}
