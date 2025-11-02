import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/error/not-found/not-found.component';
import { UnauthorizedComponent } from './pages/error/unauthorized/unauthorized.component';
import { ErrorComponent } from './pages/error/error.component';
import { authGuard, authMatchGuard } from './core/auth/auth.guard';
import { guestGuard, guestMatchGuard } from './core/auth/guest.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'account' },

  {
    path: 'account',
    canMatch: [guestMatchGuard],
    canActivate: [guestGuard],
    loadChildren: () => import('./features/account/routes').then(m => m.ACCOUNT_ROUTES)
  },

  {
    path: 'market',
    canMatch: [authMatchGuard],
    canActivate: [authGuard],
    loadChildren: () => import('./features/market/routes').then(m => m.MARKET_ROUTES)
  },
  {
    path: 'portfolio',
    canMatch: [authMatchGuard],
    canActivate: [authGuard],
    loadChildren: () => import('./features/portfolio/routes').then(m => m.PORTFOLIO_ROUTES)
  },
  {
    path: 'wallet',
    canMatch: [authMatchGuard],
    canActivate: [authGuard],
    loadChildren: () => import('./features/wallet/routes').then(m => m.WALLET_ROUTES)
  },
  {
    path: 'settings',
    canMatch: [authMatchGuard],
    canActivate: [authGuard],
    loadChildren: () => import('./features/settings/routes').then(m => m.SETTINGS_ROUTES)
  },
  {
    path: 'admin',
    canMatch: [authMatchGuard],
    canActivate: [authGuard],
    loadChildren: () => import('./features/admin/routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'unauthorized',
    canActivate: [authGuard],
    component: UnauthorizedComponent,
    title: 'Unauthorized'
  },
  {
    path: 'error',
    canActivate: [authGuard],
    component: ErrorComponent,
    title: 'Error'
  },

  {
    path: '**',
    canActivate: [authGuard],
    component: NotFoundComponent,
    title: 'Not Found'
  }
];
