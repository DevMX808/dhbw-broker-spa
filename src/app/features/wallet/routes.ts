import { Routes } from '@angular/router';
import { WalletPageComponent } from './containers/wallet-page.component';
import { authGuard } from '../../core/auth/auth.guard';

export const WALLET_ROUTES: Routes = [
  { path: '', component: WalletPageComponent, title: 'Wallet', canActivate: [authGuard] }
];
