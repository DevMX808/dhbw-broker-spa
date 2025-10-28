import { Routes } from '@angular/router';
import { MarketPageComponent } from './containers/market-page.component';
import { AssetDetailPageComponent } from './containers/asset-detail-page.component';

export const MARKET_ROUTES: Routes = [
  { path: '', component: MarketPageComponent, title: 'Market' },
  { path: ':symbol', component: AssetDetailPageComponent, title: 'Asset' }
];
