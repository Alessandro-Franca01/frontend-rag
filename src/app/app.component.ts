import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RagApiService } from './core/services/rag-api.service';
import { HealthResponse } from './core/models/api.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly api = inject(RagApiService);

  health = signal<HealthResponse | null>(null);
  apiOnline = signal<boolean>(false);

  ngOnInit(): void {
    this.api.getHealth().subscribe({
      next: h => { this.health.set(h); this.apiOnline.set(true); },
      error: ()  => this.apiOnline.set(false),
    });
  }
}
