import { Routes } from '@angular/router';
import { PortfolioPageComponent } from './containers/portfolio-page.component';
import { authGuard } from '../../core/auth/auth.guard';

export const PORTFOLIO_ROUTES: Routes = [
  { path: '', component: PortfolioPageComponent, title: 'Portfolio', canActivate: [authGuard] }
];
