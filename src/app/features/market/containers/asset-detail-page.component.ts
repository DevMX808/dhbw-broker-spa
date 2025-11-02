import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {MarketStore} from '../store/market.store';
import {MinuteChartComponent} from '../components/minute-chart/minute-chart.component';
import {ChartDataService} from '../data-access/chart-data.service';
import {MinuteChartData} from '../data-access/chart-data.models';
import {PortfolioService} from '../../portfolio/data-access/portfolio.service';
import {TradeService} from '../../../core/services/trade.service';
import {isMarketOpen, getAssetType, AssetType} from '../components/market-card/market-hours.config';

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
  private portfolioService = inject(PortfolioService);
  private tradeService = inject(TradeService);
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

  tradeMessage: string = '';
  tradeMessageType: 'success' | 'error' | null = null;

  get isMarketOpen(): boolean {
    const symbol = this.currentSymbol();
    return symbol ? isMarketOpen(symbol) : true;
  }

  get assetName(): string {
    const symbols = this.store.symbols();
    const symbol = this.currentSymbol();
    if (!symbol) return '';
    const found = symbols.find(s => s.symbol === symbol);
    return found?.name || '';
  }

  get marketStatusText(): string {
    const symbol = this.currentSymbol();
    if (!symbol) return '';

    const assetType = getAssetType(symbol);
    if (assetType === AssetType.CRYPTO) {
      return '';
    }

    if (this.isMarketOpen) {
      return '';
    }

    if (assetType === AssetType.PRECIOUS_METAL) {
      return 'Der Edelmetallmarkt ist derzeit geschlossen. Handelszeiten: Sonntag 18:00 EST bis Freitag 17:00 EST (mit täglicher Pause 17:00-18:00 EST). Preise werden fortgeschrieben.';
    }

    return 'Der Markt ist derzeit geschlossen. Preise werden fortgeschrieben.';
  }

  get calculatedQuantity(): number | null {
    const priceValue = this.currentPrice();

    const price = typeof priceValue === 'object' && priceValue !== null
      ? (priceValue as any).price
      : priceValue;

    if (this.buyMode === 'usd' && this.usdAmount && price) {
      const rawQuantity = this.usdAmount / price;
      return Math.floor(rawQuantity * 10000) / 10000;
    }

    return this.quantity;
  }

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

  private showTradeMessage(message: string, type: 'success' | 'error'): void {
    this.tradeMessage = message;
    this.tradeMessageType = type;

    setTimeout(() => {
      this.tradeMessage = '';
      this.tradeMessageType = null;
    }, 5000);
  }

  async buyAsset(): Promise<void> {
    if (!this.currentSymbol() || !this.calculatedQuantity) {
      this.showTradeMessage('Bitte geben Sie eine gültige Menge oder einen USD-Betrag ein.', 'error');
      return;
    }

    this.buying = true;
    this.tradeMessage = '';
    this.tradeMessageType = null;

    const tradeRequest = {
      assetSymbol: this.currentSymbol()!,
      side: 'BUY' as const,
      quantity: this.calculatedQuantity
    };

    this.tradeService.executeTrade(tradeRequest).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        const successMsg = `Erfolgreich ${response.quantity.toFixed(4)} ${response.assetSymbol} für $${response.total.toFixed(2)} gekauft!`;
        this.showTradeMessage(successMsg, 'success');

        this.quantity = null;
        this.usdAmount = null;
        this.loadWalletBalance();
        this.buying = false;
      },
      error: (error: any) => {
        console.error('Trade execution failed:', error);

        let errorMessage = 'Fehler beim Kauf des Assets.';

        if (error.status === 400) {
          errorMessage = error.error || 'Ungültige Anfrage. Bitte überprüfen Sie Ihre Eingaben.';
        } else if (error.status === 503) {
          errorMessage = 'Preis konnte nicht abgerufen werden. Bitte versuchen Sie es später erneut.';
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        }

        this.showTradeMessage(errorMessage, 'error');
        this.buying = false;
      }
    });
  }
}
