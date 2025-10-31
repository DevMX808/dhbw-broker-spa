import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MarketStore } from '../store/market.store';
import { MinuteChartComponent } from '../components/minute-chart/minute-chart.component';
import { ChartDataService } from '../data-access/chart-data.service';
import { MinuteChartData } from '../data-access/chart-data.models';
import { TradeService } from '../../../core/http/trade.service';
import { PortfolioService } from '../../portfolio/data-access/portfolio.service';

@Component({
  standalone: true,
  selector: 'app-asset-detail-page',
  imports: [CommonModule, RouterLink, MinuteChartComponent, FormsModule],
  styles: [`
    .balance-display {
      background: rgba(0,0,0,0.1);
      border: 1px solid rgba(0,0,0,0.1);
    }

    .balance-text {
      font-size: 0.9rem;
      color: white;
    }

    .balance-amount {
      font-weight: 600;
      color: white;
    }

    .back-link {
      color: #007bff;
      text-decoration: none;
    }

    .back-link:hover {
      text-decoration: underline;
    }
  `],
  template: `
    <div class="asset-detail-page">
      <!-- Back Link -->
      <div class="mb-3">
        <a routerLink="/market" class="back-link">← Zurück zur Übersicht</a>
      </div>

      <!-- Header with Price -->
      <div class="page-header mb-4">
        <h1 class="page-title">
          {{ currentSymbol() || 'Asset Details' }}
          <span *ngIf="currentPrice() && !isLoading()" class="text-muted ml-2">
            (\${{ currentPrice()?.price | number:'1.2-4' }} USD)
          </span>
          <span *ngIf="isLoading()" class="text-muted ml-2">(Laden...)</span>
        </h1>
      </div>

      <app-minute-chart
        [chartData]="chartData()"
        [loading]="chartLoading()">
      </app-minute-chart>

      <!-- Wallet Balance -->
      <div class="mt-4 p-2 rounded balance-display flex items-center gap-2">
        <span>💰</span>
        <span class="balance-text">
          Guthaben: 
          <span class="balance-amount" *ngIf="!balanceLoading() && walletBalance() !== null">
            {{ walletBalance() | currency:'USD':'symbol':'1.2-2' }}
          </span>
          <span *ngIf="balanceLoading()">Laden...</span>
          <span class="text-red-500" *ngIf="!balanceLoading() && walletBalance() === null">Error</span>
        </span>
      </div>

      <!-- Trading Section -->
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
    </div>
  `,
})
export class AssetDetailPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tradeService = inject(TradeService);
  private portfolioService = inject(PortfolioService);
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

  // Wallet Balance
  readonly walletBalance = signal<number | null>(null);
  readonly balanceLoading = signal(false);

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const symbol = params.get('symbol');
      if (symbol) {
        this.loadSymbolData(symbol.toUpperCase());
      } else {
        this.router.navigate(['/market']);
      }
    });
    
    // Load wallet balance
    this.loadWalletBalance();
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

  private loadWalletBalance(): void {
    this.balanceLoading.set(true);
    this.portfolioService.getWalletBalance().pipe(takeUntil(this.destroy$)).subscribe({
      next: (balance) => {
        this.walletBalance.set(balance);
        this.balanceLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load wallet balance:', error);
        this.walletBalance.set(null);
        this.balanceLoading.set(false);
      }
    });
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
