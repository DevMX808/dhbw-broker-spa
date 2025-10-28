import { Routes } from '@angular/router';
import { TradePageComponent } from './containers/trade-page.component';
import { authGuard } from '../../core/auth/auth.guard';

export const TRADE_ROUTES: Routes = [
  { path: '', component: TradePageComponent, title: 'Trade', canActivate: [authGuard] }
];
