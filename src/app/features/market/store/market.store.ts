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
      console.error('[MarketStore] loadSymbols failed', err);
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
    // Check if already loading (dedupe)
    if (this.loading().priceBySymbol[symbol] && !forceRefresh) {
      return;
    }

    // Check cache (if not forcing refresh)
    if (!forceRefresh && this.isCached(symbol)) {
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
      console.error(`[MarketStore] loadPrice failed for ${symbol}`, err);
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
}
