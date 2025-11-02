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
  templateUrl: './asset-detail-page.component.html',
  styleUrls: ['./asset-detail-page.component.scss']
})
export class AssetDetailPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tradeService = inject(TradeService);
  private portfolioService = inject(PortfolioService);
  readonly store = inject(MarketStore);
  private chartService = inject(ChartDataService);

  private destroy$ = new Subject<void>();

  readonly chartData = signal<MinuteChartData | null>(null);
  readonly chartLoading = signal(false);

  readonly currentSymbol = computed(() => this.store.selectedSymbol());
  readonly currentPrice = computed(() => this.store.selectedPrice());
  readonly isLoading = computed(() => {
    const symbol = this.currentSymbol();
    return symbol ? this.store.isLoadingPrice(symbol) : false;
  });

  quantity: number | null = null;
  usdAmount: number | null = null;
  buyMode: 'quantity' | 'usd' = 'quantity';
  buying = false;

  walletBalance: number = 0;
  balanceLoading: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const symbol = params.get('symbol');
      if (symbol) {
        this.loadSymbolData(symbol.toUpperCase());
      } else {
        this.router.navigate(['/market']);
      }
    });
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
      next: (data) => {
        this.chartData.set(data);
        this.chartLoading.set(false);
      },
      error: () => {
        this.chartData.set(null);
        this.chartLoading.set(false);
      },
    });
  }

  private loadWalletBalance(): void {
    this.balanceLoading = true;
    this.portfolioService.getWalletBalance().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.walletBalance = response.balance;
        this.balanceLoading = false;
      },
      error: (error) => {
        console.error('Failed to load wallet balance:', error);
        this.walletBalance = 0;
        this.balanceLoading = false;
      }
    });
  }


  get calculatedQuantity(): number | null {
    const priceValue = this.currentPrice();

    const price = typeof priceValue === 'object' && priceValue !== null
      ? (priceValue as any).price
      : priceValue;

    if (this.buyMode === 'usd' && this.usdAmount && price) {
      const rawQuantity = this.usdAmount / price;
      // Runde auf 2 Dezimalstellen (minTradeIncrement = 0.01)
      const roundedQuantity = Math.floor(rawQuantity * 100) / 100;
      return roundedQuantity;
    }

    return this.quantity;
  }

  async buyAsset(): Promise<void> {
    if (!this.currentSymbol() || !this.calculatedQuantity) {
      alert('Bitte geben Sie eine gültige Menge oder einen USD-Betrag ein.');
      return;
    }

    this.buying = true;

    try {
      const request = {
        assetSymbol: this.currentSymbol()!,
        side: 'BUY' as const,
        quantity: this.calculatedQuantity
      };



      const result = await this.tradeService.executeTrade(request).toPromise();

      alert(`Erfolgreich ${this.calculatedQuantity.toFixed(4)} ${this.currentSymbol()} gekauft!`);

      this.quantity = null;
      this.usdAmount = null;
      this.loadWalletBalance();

    } catch (error) {
      console.error('Trade execution failed:', error);
      alert('Fehler beim Kauf des Assets.');
    } finally {
      this.buying = false;
    }
  }
}
