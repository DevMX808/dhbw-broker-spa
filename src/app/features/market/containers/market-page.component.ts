import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
        <div class="auto-refresh-indicator">
          <span class="indicator-dot"></span>
          <span class="indicator-text">Preise werden automatisch zur Sekunde :35 jeder Minute aktualisiert</span>
        </div>
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
      color: #e6e6e6;
    }

    .page-subtitle {
      font-size: 1rem;
      margin-bottom: 1rem;
      color: #9aa0a6;
    }

    .auto-refresh-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 0.5rem;
      margin-top: 0.75rem;
      width: fit-content;
    }

    .indicator-dot {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      animation: pulse-dot 2s ease-in-out infinite;
    }

    @keyframes pulse-dot {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.6;
        transform: scale(1.2);
      }
    }

    .indicator-text {
      font-size: 0.875rem;
      color: #22c55e;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .market-page {
        padding: 1.5rem 1rem;
      }

      .page-title {
        font-size: 1.5rem;
      }

      .auto-refresh-indicator {
        font-size: 0.8rem;
      }

      .indicator-text {
        font-size: 0.75rem;
      }
    }
  `]
})
export class MarketPageComponent implements OnInit, OnDestroy {
  readonly store = inject(MarketStore);

  async ngOnInit(): Promise<void> {
    console.log('[MarketPage] Initializing...');

    // Load symbols on page init
    if (!this.store.hasData()) {
      console.log('[MarketPage] No data yet, loading symbols...');
      await this.store.loadSymbols();

      // Optionally prefetch prices for first few symbols
      const symbolsToPreload = this.store.symbols().slice(0, 6).map(s => s.symbol);
      if (symbolsToPreload.length > 0) {
        console.log('[MarketPage] Prefetching prices for symbols:', symbolsToPreload);
        this.store.prefetchPrices(symbolsToPreload);
      }
    } else {
      console.log('[MarketPage] Data already loaded, symbols count:', this.store.symbols().length);
    }

    // Start auto-refresh for price updates every 60 seconds
    console.log('[MarketPage] Starting auto-refresh...');
    this.store.startAutoRefresh();
  }

  ngOnDestroy(): void {
    console.log('[MarketPage] Destroying, stopping auto-refresh...');
    this.store.stopAutoRefresh();
  }

  onRetry(): void {
    console.log('[MarketPage] Retry clicked, reloading symbols...');
    this.store.loadSymbols();
  }
}


