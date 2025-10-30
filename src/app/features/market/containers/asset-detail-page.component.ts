import { Component, OnInit, OnDestroy, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MarketStore } from '../store/market.store';
import { PriceCardComponent } from '../components/quote-card/quote-card.component';
import { MinuteChartComponent } from '../components/minute-chart/minute-chart.component';
import { ChartDataService } from '../data-access/chart-data.service';
import { MinuteChartData } from '../data-access/chart-data.models';
import { Subject, takeUntil } from 'rxjs';

/**
 * Container component for /market/:symbol route
 * Displays detailed price information for a specific symbol
 */
@Component({
  standalone: true,
  selector: 'app-asset-detail-page',
  imports: [CommonModule, RouterLink, PriceCardComponent, MinuteChartComponent],
  template: `
    <div class="asset-detail-page">
      <!-- Back Link -->
      <div class="mb-3">
        <a routerLink="/market" class="back-link">
          ← Zurück zur Übersicht
        </a>
      </div>

      <!-- Header -->
      <div class="page-header mb-4">
        <h1 class="page-title">
          {{ currentSymbol() || 'Asset Details' }}
        </h1>
      </div>

      <!-- Minute Chart -->
      <app-minute-chart
        [chartData]="chartData()"
        [loading]="chartLoading()">
      </app-minute-chart>

      <!-- Price Card -->
      <app-price-card
        [price]="currentPrice()"
        [loading]="isLoading()"
        [error]="priceError()"
        (refresh)="onRefresh()">
      </app-price-card>

      <!-- Info Text -->
      <div class="info-box mt-4">
        <p class="text-muted small mb-0">
          💡 <strong>Tipp:</strong> Klicken Sie auf "Aktualisieren", um die neuesten Preisdaten zu laden.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .asset-detail-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .back-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .back-link:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0;
      color: #333;
    }

    .info-box {
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 1rem 1.5rem;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      .asset-detail-page {
        padding: 1.5rem 1rem;
      }

      .page-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class AssetDetailPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store = inject(MarketStore);
  private chartService = inject(ChartDataService);

  private destroy$ = new Subject<void>();

  // Chart data signals
  readonly chartData = signal<MinuteChartData | null>(null);
  readonly chartLoading = signal(false);

  // Computed values from store
  readonly currentSymbol = computed(() => this.store.selectedSymbol());
  readonly currentPrice = computed(() => this.store.selectedPrice());
  readonly isLoading = computed(() => {
    const symbol = this.currentSymbol();
    return symbol ? this.store.isLoadingPrice(symbol) : false;
  });

  // Local error state for price loading
  readonly priceError = computed(() => {
    const symbol = this.currentSymbol();
    const price = this.currentPrice();
    const loading = this.isLoading();

    // Show error if not loading, symbol exists, but no price
    if (!loading && symbol && !price) {
      return `Preis für ${symbol} konnte nicht geladen werden.`;
    }
    return null;
  });

  ngOnInit(): void {
    // Listen to route parameter changes
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const symbol = params.get('symbol');
        if (symbol) {
          const upperSymbol = symbol.toUpperCase();
          this.loadSymbolData(upperSymbol);
        } else {
          // No symbol provided, redirect to market list
          this.router.navigate(['/market']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadSymbolData(symbol: string): Promise<void> {
    // Ensure symbols are loaded first
    if (!this.store.hasData()) {
      await this.store.loadSymbols();
    }

    // Verify symbol exists
    const symbolExists = this.store.symbols().some(s => s.symbol === symbol);
    if (!symbolExists) {
      console.warn(`Symbol ${symbol} not found in available symbols`);
      // Could redirect to 404 or market list here
    }

    // Select and load price
    await this.store.selectSymbol(symbol);

    // Load chart data
    this.loadChartData(symbol);
  }

  private loadChartData(symbol: string): void {
    this.chartLoading.set(true);
    
    this.chartService.getMinuteChart(symbol)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.chartData.set(data);
          this.chartLoading.set(false);
        },
        error: (error) => {
          console.error('Fehler beim Laden der Chart-Daten:', error);
          this.chartData.set(null);
          this.chartLoading.set(false);
        }
      });
  }

  async onRefresh(): Promise<void> {
    const symbol = this.currentSymbol();
    if (symbol) {
      await this.store.refreshPrice(symbol);
      // Chart-Daten auch aktualisieren
      this.loadChartData(symbol);
    }
  }
}

