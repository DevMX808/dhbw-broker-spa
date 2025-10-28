import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketStore } from '../store/market.store';
import { MarketListComponent } from '../components/market-list/market-list.component';

/**
 * Container component for /market route
 * Manages data flow between Store and MarketListComponent
 */
@Component({
  standalone: true,
  selector: 'app-market-page',
  imports: [CommonModule, MarketListComponent],
  template: `
    <div class="market-page">
      <!-- Header -->
      <div class="page-header mb-4">
        <h1 class="page-title">Markt</h1>
        <p class="page-subtitle text-muted">
          Handelbare Symbole und aktuelle Preise
        </p>
      </div>

      <!-- Market List -->
      <app-market-list
        [symbols]="store.symbols()"
        [pricesBySymbol]="store.pricesBySymbol()"
        [loading]="store.loading().symbols"
        [error]="store.error()"
        [loadingPrices]="store.loading().priceBySymbol"
        (retry)="onRetry()">
      </app-market-list>
    </div>
  `,
  styles: [`
    .market-page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .page-subtitle {
      font-size: 1rem;
      margin-bottom: 0;
    }

    @media (max-width: 768px) {
      .market-page {
        padding: 1.5rem 1rem;
      }

      .page-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class MarketPageComponent implements OnInit {
  readonly store = inject(MarketStore);

  async ngOnInit(): Promise<void> {
    // Load symbols on page init
    if (!this.store.hasData()) {
      await this.store.loadSymbols();

      // Optionally prefetch prices for first few symbols
      const symbolsToPreload = this.store.symbols().slice(0, 6).map(s => s.symbol);
      if (symbolsToPreload.length > 0) {
        this.store.prefetchPrices(symbolsToPreload);
      }
    }
  }

  onRetry(): void {
    this.store.loadSymbols();
  }
}


