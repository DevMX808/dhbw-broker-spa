import { Routes } from '@angular/router';
import { AdminUsersComponent } from './containers/admin-users.component';
import { RoleGuard } from '../../core/auth/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminUsersComponent,
    title: 'Admin - Benutzerverwaltung',
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  }
];
