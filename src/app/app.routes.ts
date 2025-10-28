import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { ErrorComponent } from './pages/error/error.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'market' },
  { path: 'account', loadChildren: () => import('./features/account/routes').then(m => m.ACCOUNT_ROUTES) },
  { path: 'market',  loadChildren: () => import('./features/market/routes').then(m => m.MARKET_ROUTES) },
  { path: 'trade',   loadChildren: () => import('./features/trade/routes').then(m => m.TRADE_ROUTES) },
  { path: 'portfolio', loadChildren: () => import('./features/portfolio/routes').then(m => m.PORTFOLIO_ROUTES) },
  { path: 'wallet',  loadChildren: () => import('./features/wallet/routes').then(m => m.WALLET_ROUTES) },
  { path: 'settings', loadChildren: () => import('./features/settings/routes').then(m => m.SETTINGS_ROUTES) },
  { path: 'admin',   loadChildren: () => import('./features/admin/routes').then(m => m.ADMIN_ROUTES) },

  { path: 'unauthorized', component: UnauthorizedComponent, title: 'Unauthorized' },
  { path: 'error', component: ErrorComponent, title: 'Error' },
  { path: '**', component: NotFoundComponent, title: 'Not Found' }
];
