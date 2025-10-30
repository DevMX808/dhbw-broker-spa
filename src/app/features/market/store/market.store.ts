import { Injectable, signal, computed, inject } from '@angular/core';
import { MarketSymbol, MarketPrice, MARKET_DATA_PORT } from '../data-access/market.port';

/**
 * Feature-local store for Market data
 * Manages state, loading, errors, deduplication, and caching
 */
@Injectable({ providedIn: 'root' })
export class MarketStore {
  private adapter = inject(MARKET_DATA_PORT);

  // State
  readonly symbols = signal<MarketSymbol[]>([]);
  readonly pricesBySymbol = signal<Record<string, MarketPrice>>({});
  readonly selectedSymbol = signal<string | null>(null);

  // Loading states
  readonly loading = signal<{
    symbols: boolean;
    priceBySymbol: Record<string, boolean>;
  }>({
    symbols: false,
    priceBySymbol: {}
  });

  readonly error = signal<string | null>(null);

  // Caching metadata
  private lastFetched: Record<string, number> = {}; // timestamp in ms
  private pendingRequests: Record<string, Promise<MarketPrice> | undefined> = {}; // deduplication map

  // Auto-refresh
  private autoRefreshInterval: any = null;
  private initialRefreshTimeout: any = null;
  private autoRefreshEnabled = false;
  private readonly AUTO_REFRESH_INTERVAL_MS = 60_000; // 60 seconds
  private readonly REFRESH_AT_SECOND = 35; // Sekunde im Minutenzyklus, zu der neue Daten kommen

  // Computed
  readonly hasData = computed(() => this.symbols().length > 0);
  readonly selectedPrice = computed(() => {
    const symbol = this.selectedSymbol();
    return symbol ? this.pricesBySymbol()[symbol] : null;
  });

  /**
   * Load all tradable symbols
   */
  async loadSymbols(): Promise<void> {
    // Already loading? Skip
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

  /**
   * Load price for a specific symbol
   * Implements deduplication and basic caching
   */
  async loadPrice(symbol: string, forceRefresh: boolean = false): Promise<void> {
    const now = Date.now();
    const cached = this.isCached(symbol);

    // Check if already loading (dedupe)
    if (this.loading().priceBySymbol[symbol] && !forceRefresh) {
      return;
    }

    // Check cache (if not forcing refresh)
    if (!forceRefresh && cached) {
      return;
    }

    // Dedupe: if request is pending, return existing promise
    const pendingRequest = this.pendingRequests[symbol];
    if (pendingRequest && !forceRefresh) {
      await pendingRequest;
      return;
    }


    // Start loading
    this.loading.update(state => ({
      ...state,
      priceBySymbol: { ...state.priceBySymbol, [symbol]: true }
    }));

    // Create and store promise for deduplication
    const pricePromise = this.adapter.fetchPrice(symbol);
    this.pendingRequests[symbol] = pricePromise;

    try {
      const price = await pricePromise;

      // Update state
      this.pricesBySymbol.update(prices => ({
        ...prices,
        [symbol]: price
      }));

      // Update cache timestamp
      this.lastFetched[symbol] = Date.now();
    } catch (err) {
      // Don't set global error, just log it
    } finally {
      // Clean up
      this.loading.update(state => ({
        ...state,
        priceBySymbol: { ...state.priceBySymbol, [symbol]: false }
      }));
      this.pendingRequests[symbol] = undefined;
    }
  }

  /**
   * Select a symbol and load its price
   */
  async selectSymbol(symbol: string): Promise<void> {
    this.selectedSymbol.set(symbol);
    await this.loadPrice(symbol);
  }

  /**
   * Force refresh price for a symbol
   */
  async refreshPrice(symbol: string): Promise<void> {
    await this.loadPrice(symbol, true);
  }

  /**
   * Prefetch prices for multiple symbols (useful for list view)
   */
  async prefetchPrices(symbols: string[]): Promise<void> {
    const promises = symbols.map(symbol => this.loadPrice(symbol));
    await Promise.allSettled(promises);
  }

  /**
   * Check if a price is cached and not stale (60s threshold)
   */
  private isCached(symbol: string): boolean {
    const STALE_THRESHOLD_MS = 60_000; // 60 seconds
    const lastFetch = this.lastFetched[symbol];

    if (!lastFetch) return false;
    if (!this.pricesBySymbol()[symbol]) return false;

    const age = Date.now() - lastFetch;
    return age < STALE_THRESHOLD_MS;
  }

  /**
   * Check if a symbol is currently loading
   */
  isLoadingPrice(symbol: string): boolean {
    return this.loading().priceBySymbol[symbol] ?? false;
  }

  /**
   * Start auto-refresh for all loaded symbols
   * Synchronizes to refresh at second 35 of each minute (when new data arrives in DB)
   */
  startAutoRefresh(): void {
    if (this.autoRefreshEnabled) {
      return;
    }

    const now = new Date();
    const currentSecond = now.getSeconds();

    this.autoRefreshEnabled = true;

    // Calculate delay until next second 35
    let delayUntilNextRefresh: number;
    if (currentSecond < this.REFRESH_AT_SECOND) {
      // Next refresh is in this minute
      delayUntilNextRefresh = (this.REFRESH_AT_SECOND - currentSecond) * 1000;
    } else {
      // Next refresh is in next minute
      delayUntilNextRefresh = (60 - currentSecond + this.REFRESH_AT_SECOND) * 1000;
    }

    // Schedule first refresh at the next second 35
    this.initialRefreshTimeout = setTimeout(() => {
      this.performRefresh();

      // Then set up recurring refresh every 60 seconds
      this.autoRefreshInterval = setInterval(() => {
        this.performRefresh();
      }, this.AUTO_REFRESH_INTERVAL_MS);
    }, delayUntilNextRefresh);
  }

  /**
   * Perform the actual refresh of all symbols
   */
  private performRefresh(): void {
    const now = new Date();
    const symbolsToRefresh = Object.keys(this.pricesBySymbol());

    if (symbolsToRefresh.length > 0) {
      symbolsToRefresh.forEach(symbol => {
        this.loadPrice(symbol, true); // force refresh
      });
    } else {
    }
  }

  /**
   * Stop auto-refresh
   */
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

  /**
   * Check if auto-refresh is enabled
   */
  isAutoRefreshEnabled(): boolean {
    return this.autoRefreshEnabled;
  }
}
