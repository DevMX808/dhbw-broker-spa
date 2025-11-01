import { Routes } from '@angular/router';
import { AuthShellComponent } from './containers/auth-shell/auth-shell.component';

export const ACCOUNT_ROUTES: Routes = [
  { path: '', component: AuthShellComponent, title: 'Account' }
];
