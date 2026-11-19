import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RagApiService } from '../../core/services/rag-api.service';
import { AuthService } from '../../core/services/auth.service';
import { HealthResponse } from '../../core/models/api.models';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent implements OnInit {
  private readonly api = inject(RagApiService);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  health = signal<HealthResponse | null>(null);
  apiOnline = signal<boolean>(false);

  ngOnInit(): void {
    this.api.getHealth().subscribe({
      next: h => { this.health.set(h); this.apiOnline.set(true); },
      error: () => this.apiOnline.set(false),
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
