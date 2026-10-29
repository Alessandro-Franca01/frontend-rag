import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = '';
  password = '';

  loading = signal(false);
  error = signal<string | null>(null);

  submit(): void {
    this.loading.set(true);
    this.error.set(null);

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/ask';
        this.router.navigateByUrl(redirect);
      },
      error: err => {
        this.error.set(err.error?.detail ?? 'Não foi possível entrar.');
        this.loading.set(false);
      },
    });
  }
}
