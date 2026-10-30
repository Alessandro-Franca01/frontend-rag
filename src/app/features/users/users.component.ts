import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersApiService } from '../../core/services/users-api.service';
import { AuthService } from '../../core/services/auth.service';
import { Role, UserRecord } from '../../core/models/auth.models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private readonly api = inject(UsersApiService);
  readonly auth = inject(AuthService);

  users = signal<UserRecord[]>([]);
  loading = signal(true);
  loadError = signal<string | null>(null);

  email = '';
  fullName = '';
  password = '';
  role: Role = 'consultor';

  creating = signal(false);
  createError = signal<string | null>(null);

  updatingId = signal<number | null>(null);
  updateError = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.api.listUsers().subscribe({
      next: users => { this.users.set(users); this.loading.set(false); },
      error: err => {
        this.loadError.set(err.error?.detail ?? 'Erro ao carregar usuários.');
        this.loading.set(false);
      },
    });
  }

  createUser(): void {
    this.creating.set(true);
    this.createError.set(null);
    this.api.createUser({ email: this.email, full_name: this.fullName, password: this.password, role: this.role }).subscribe({
      next: () => {
        this.email = '';
        this.fullName = '';
        this.password = '';
        this.role = 'consultor';
        this.creating.set(false);
        this.load();
      },
      error: err => {
        this.createError.set(err.error?.detail ?? 'Erro ao criar usuário.');
        this.creating.set(false);
      },
    });
  }

  toggleActive(user: UserRecord): void {
    this.updatingId.set(user.id);
    this.updateError.set(null);
    this.api.updateUser(user.id, { is_active: !user.is_active }).subscribe({
      next: () => { this.updatingId.set(null); this.load(); },
      error: err => {
        this.updateError.set(err.error?.detail ?? 'Erro ao atualizar usuário.');
        this.updatingId.set(null);
      },
    });
  }

  isSelf(user: UserRecord): boolean {
    return this.auth.currentUser()?.email === user.email;
  }
}
