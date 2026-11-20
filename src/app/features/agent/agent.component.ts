import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RagApiService } from '../../core/services/rag-api.service';
import { AgentResponse } from '../../core/models/api.models';
import { renderMarkdown } from '../../core/utils/markdown';
import { ToolTraceComponent } from '../../shared/tool-trace/tool-trace.component';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolTraceComponent],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss',
})
export class AgentComponent {
  private readonly api = inject(RagApiService);

  readonly examples = [
    'Quantas ocorrências o grupo GPA teve em 2023?',
    'Quantas faltas houve por mês em 2023?',
    'Quantas ocorrências citam furto, por ano?',
    'O que foi relatado sobre dano ao patrimônio?',
  ];

  query = '';
  loading = signal(false);
  response = signal<AgentResponse | null>(null);
  answerHtml = signal('');
  error = signal<string | null>(null);

  submit(): void {
    if (!this.query.trim() || this.loading()) return;

    this.loading.set(true);
    this.error.set(null);
    this.response.set(null);

    this.api.askAgent({ query: this.query.trim() }).subscribe({
      next: res => {
        this.response.set(res);
        this.answerHtml.set(renderMarkdown(res.answer));
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.error?.detail ?? 'Não foi possível consultar o agente.');
        this.loading.set(false);
      },
    });
  }

  useExample(text: string): void {
    this.query = text;
    this.submit();
  }

  clear(): void {
    this.query = '';
    this.response.set(null);
    this.error.set(null);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      this.submit();
    }
  }
}
