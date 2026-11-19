import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditApiService } from '../../core/services/audit-api.service';
import { AuditLogRecord } from '../../core/models/auth.models';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss',
})
export class AuditComponent implements OnInit {
  private readonly api = inject(AuditApiService);

  logs = signal<AuditLogRecord[]>([]);
  loading = signal(true);
  loadError = signal<string | null>(null);
  page = signal(0);

  emailFilter = '';

  ngOnInit(): void {
    this.load();
  }

  search(): void {
    this.page.set(0);
    this.load();
  }

  goTo(page: number): void {
    this.page.set(page);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.api.listLogs(this.emailFilter, PAGE_SIZE, this.page() * PAGE_SIZE).subscribe({
      next: logs => { this.logs.set(logs); this.loading.set(false); },
      error: err => {
        this.loadError.set(err.error?.detail ?? 'Erro ao carregar a auditoria.');
        this.loading.set(false);
      },
    });
  }

  hasNext(): boolean {
    return this.logs().length === PAGE_SIZE;
  }

  caller(log: AuditLogRecord): string {
    return log.via_api_key ? 'API key' : (log.email ?? '—');
  }
}
