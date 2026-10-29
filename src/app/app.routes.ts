import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/shell/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'ask', pathMatch: 'full' },
      {
        path: 'ask',
        loadComponent: () =>
          import('./features/ask/ask.component').then(m => m.AskComponent),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./features/documents/documents.component').then(m => m.DocumentsComponent),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./features/search/search.component').then(m => m.SearchComponent),
      },
      {
        path: 'users',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/users/users.component').then(m => m.UsersComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
