import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'ask',
    pathMatch: 'full',
  },
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
    path: '**',
    redirectTo: 'ask',
  },
];
