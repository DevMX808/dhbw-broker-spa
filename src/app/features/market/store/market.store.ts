import { Injectable, signal, computed, inject } from '@angular/core';
import { MarketSymbol, MarketPrice, MARKET_DATA_PORT } from '../data-access/market.port';

@Injectable({ providedIn: 'root' })
export class MarketStore {
  private adapter = inject(MARKET_DATA_PORT);

  readonly symbols = signal<MarketSymbol[]>([]);
  readonly pricesBySymbol = signal<Record<string, MarketPrice>>({});
  readonly selectedSymbol = signal<string | null>(null);

  readonly loading = signal<{
    symbols: boolean;
    priceBySymbol: Record<string, boolean>;
  }>({
    symbols: false,
    priceBySymbol: {}
  });

  readonly error = signal<string | null>(null);

  private lastFetched: Record<string, number> = {};
  private pendingRequests: Record<string, Promise<MarketPrice> | undefined> = {};

  private autoRefreshInterval: any = null;
  private initialRefreshTimeout: any = null;
  private autoRefreshEnabled = false;
  private readonly AUTO_REFRESH_INTERVAL_MS = 60_000;
  private readonly REFRESH_AT_SECOND = 35;

  readonly hasData = computed(() => this.symbols().length > 0);
  readonly selectedPrice = computed(() => {
    const symbol = this.selectedSymbol();
    return symbol ? this.pricesBySymbol()[symbol] : null;
  });

  async loadSymbols(): Promise<void> {
    if (this.loading().symbols) return;

    this.loading.update(state => ({ ...state, symbols: true }));
    this.error.set(null);

    try {
      const symbols = await this.adapter.fetchSymbols();
      this.symbols.set(symbols);
      this.error.set(null);
    } catch (err) {
      this.error.set('Symbols konnten nicht geladen werden.');
    } finally {
      this.loading.update(state => ({ ...state, symbols: false }));
    }
  }

  async loadPrice(symbol: string, forceRefresh: boolean = false): Promise<void> {
    const now = Date.now();
    const cached = this.isCached(symbol);

    if (this.loading().priceBySymbol[symbol] && !forceRefresh) {
      return;
    }

    if (!forceRefresh && cached) {
      return;
    }

    const pendingRequest = this.pendingRequests[symbol];
    if (pendingRequest && !forceRefresh) {
      await pendingRequest;
      return;
    }

    this.loading.update(state => ({
      ...state,
      priceBySymbol: { ...state.priceBySymbol, [symbol]: true }
    }));

    const pricePromise = this.adapter.fetchPrice(symbol);
    this.pendingRequests[symbol] = pricePromise;

    try {
      const price = await pricePromise;

      this.pricesBySymbol.update(prices => ({
        ...prices,
        [symbol]: price
      }));

      this.lastFetched[symbol] = Date.now();
    } catch (err) {
    } finally {
      this.loading.update(state => ({
        ...state,
        priceBySymbol: { ...state.priceBySymbol, [symbol]: false }
      }));
      this.pendingRequests[symbol] = undefined;
    }
  }

  async selectSymbol(symbol: string): Promise<void> {
    this.selectedSymbol.set(symbol);
    await this.loadPrice(symbol);
  }

  async refreshPrice(symbol: string): Promise<void> {
    await this.loadPrice(symbol, true);
  }

  async prefetchPrices(symbols: string[]): Promise<void> {
    const promises = symbols.map(symbol => this.loadPrice(symbol));
    await Promise.allSettled(promises);
  }

  private isCached(symbol: string): boolean {
    const STALE_THRESHOLD_MS = 60_000; // 60 seconds
    const lastFetch = this.lastFetched[symbol];

    if (!lastFetch) return false;
    if (!this.pricesBySymbol()[symbol]) return false;

    const age = Date.now() - lastFetch;
    return age < STALE_THRESHOLD_MS;
  }

  isLoadingPrice(symbol: string): boolean {
    return this.loading().priceBySymbol[symbol] ?? false;
  }

  startAutoRefresh(): void {
    if (this.autoRefreshEnabled) {
      return;
    }

    const now = new Date();
    const currentSecond = now.getSeconds();

    this.autoRefreshEnabled = true;

    let delayUntilNextRefresh: number;
    if (currentSecond < this.REFRESH_AT_SECOND) {
      delayUntilNextRefresh = (this.REFRESH_AT_SECOND - currentSecond) * 1000;
    } else {
      delayUntilNextRefresh = (60 - currentSecond + this.REFRESH_AT_SECOND) * 1000;
    }

    this.initialRefreshTimeout = setTimeout(() => {
      this.performRefresh();

      this.autoRefreshInterval = setInterval(() => {
        this.performRefresh();
      }, this.AUTO_REFRESH_INTERVAL_MS);
    }, delayUntilNextRefresh);
  }

  private performRefresh(): void {
    const now = new Date();
    const symbolsToRefresh = Object.keys(this.pricesBySymbol());

    if (symbolsToRefresh.length > 0) {
      symbolsToRefresh.forEach(symbol => {
        this.loadPrice(symbol, true);
      });
    } else {
    }
  }

  stopAutoRefresh(): void {
    if (!this.autoRefreshEnabled) {
      return;
    }

    this.autoRefreshEnabled = false;

    if (this.initialRefreshTimeout) {
      clearTimeout(this.initialRefreshTimeout);
      this.initialRefreshTimeout = null;
    }

    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
    }
  }
}
