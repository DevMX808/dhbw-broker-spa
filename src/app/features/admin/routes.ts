// src/app/features/admin/routes.ts  (Guard ergänzt)
import { Routes } from '@angular/router';
import { AdminPageComponent } from './containers/admin-page.component';
import { RoleGuard } from '../../core/auth/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    title: 'Admin',
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'users' },
    ]
  }
];
