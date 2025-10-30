import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketStore } from '../store/market.store';
import { MarketListComponent } from '../components/market-list/market-list.component';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-market-page',
  imports: [CommonModule, MarketListComponent],
  templateUrl: './market-page.component.html',
  styleUrls: ['./market-page.component.scss']
})
export class MarketPageComponent implements OnInit, OnDestroy {
  readonly store = inject(MarketStore);
  private authService = inject(AuthService);


  get firstName(): string {
    return this.authService.user()?.firstName || 'Gast';
  }

  get lastName(): string {
    return this.authService.user()?.lastName || '';
  }

  async ngOnInit(): Promise<void> {
    if (!this.store.hasData()) {
      await this.store.loadSymbols();

      const symbolsToPreload = this.store.symbols().slice(0, 6).map(s => s.symbol);
      if (symbolsToPreload.length > 0) {
        this.store.prefetchPrices(symbolsToPreload);
      }
    }

    this.store.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.store.stopAutoRefresh();
  }

  onRetry(): void {
    this.store.loadSymbols();
  }
}
