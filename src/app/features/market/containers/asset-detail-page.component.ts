import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MarketStore } from '../store/market.store';
import { PriceCardComponent } from '../components/quote-card/quote-card.component';
import { MinuteChartComponent } from '../components/minute-chart/minute-chart.component';
import { ChartDataService } from '../data-access/chart-data.service';
import { MinuteChartData } from '../data-access/chart-data.models';
import { TradeService } from '../../../core/http/trade.service';

@Component({
  standalone: true,
  selector: 'app-asset-detail-page',
  imports: [CommonModule, RouterLink, PriceCardComponent, MinuteChartComponent, FormsModule],
  template: `
    <div class="asset-detail-page">
      <!-- Back Link -->
      <div class="mb-3">
        <a routerLink="/market" class="back-link">← Zurück zur Übersicht</a>
      </div>

      <!-- Header -->
      <div class="page-header mb-4">
        <h1 class="page-title">{{ currentSymbol() || 'Asset Details' }}</h1>
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

      <!-- Kaufbereich -->
      <div class="mt-6 p-4 border rounded-md bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <input type="number" [(ngModel)]="quantity"
               min="0.0001" step="0.0001"
               class="border rounded-md px-3 py-2 w-full sm:w-32 mb-2 sm:mb-0"
               placeholder="Menge" />

        <button (click)="buyAsset()"
                [disabled]="buying || !quantity || !currentSymbol()"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed">
          {{ buying ? 'Kaufe...' : 'Kaufen' }}
        </button>
      </div>

      <!-- Info Text -->
      <div class="info-box mt-4">
        <p class="text-muted small mb-0">
          💡 <strong>Tipp:</strong> Klicken Sie auf "Aktualisieren", um die neuesten Preisdaten zu laden.
        </p>
      </div>
    </div>
  `,
})
export class AssetDetailPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tradeService = inject(TradeService);
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
    if (!loading && symbol && !price) {
      return `Preis für ${symbol} konnte nicht geladen werden.`;
    }
    return null;
  });

  // Kauf-Logik
  quantity: number | null = null;
  buying = false;

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const symbol = params.get('symbol');
      if (symbol) {
        this.loadSymbolData(symbol.toUpperCase());
      } else {
        this.router.navigate(['/market']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadSymbolData(symbol: string): Promise<void> {
    if (!this.store.hasData()) {
      await this.store.loadSymbols();
    }
    const exists = this.store.symbols().some(s => s.symbol === symbol);
    if (!exists) {
      console.warn(`Symbol ${symbol} nicht gefunden`);
    }
    await this.store.selectSymbol(symbol);
    this.loadChartData(symbol);
  }

  private loadChartData(symbol: string): void {
    this.chartLoading.set(true);
    this.chartService.getMinuteChart(symbol).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.chartData.set(data); this.chartLoading.set(false); },
      error: () => { this.chartData.set(null); this.chartLoading.set(false); },
    });
  }

  async onRefresh(): Promise<void> {
    const symbol = this.currentSymbol();
    if (symbol) {
      await this.store.refreshPrice(symbol);
      this.loadChartData(symbol);
    }
  }

  async buyAsset(): Promise<void> {
    if (!this.currentSymbol() || !this.quantity) return;

    this.buying = true;

    try {
      const request = {
        assetSymbol: this.currentSymbol()!,
        side: 'BUY' as const,
        quantity: this.quantity
      };

      const result = await this.tradeService.executeTrade(request).toPromise();
      console.log('Trade executed successfully:', result);
      alert(`Erfolgreich ${this.quantity} ${this.currentSymbol()} gekauft!`);
      this.quantity = null;
    } catch (error) {
      console.error('Trade execution failed:', error);
      alert('Fehler beim Kauf des Assets. Bitte prüfen Sie die Konsole für Details.');
    } finally {
      this.buying = false;
    }
  }
}
