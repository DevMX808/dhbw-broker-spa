import { Injectable, computed, signal } from '@angular/core';
import { MarketDataService } from '../data-access/market-data.service';
import { MarketQuote, MarketSymbol } from '../data-access/market-data.models';

@Injectable({ providedIn: 'root' })
export class MarketStore {
  readonly symbols = signal<MarketSymbol[]>([]);
  readonly quotes  = signal<Record<string, MarketQuote>>({});
  readonly loading = signal(false);
  readonly error   = signal<string | null>(null);

  readonly hasData = computed(() => this.symbols().length > 0);

  constructor(private api: MarketDataService) {}

  loadSymbols(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set(null);
    this.api.getSymbols().subscribe({
      next: (list) => {
        this.symbols.set(list);
        this.loading.set(false);
        list.forEach(s => this.loadQuote(s.symbol));
      },
      error: (e) => {
        console.error('[Market] getSymbols failed', e);
        this.error.set('Konnte Symbole nicht laden.');
        this.loading.set(false);
      }
    });
  }

  loadQuote(symbol: string): void {
    // schon vorhanden? → nicht erneut laden
    if (this.quotes()[symbol]) return;
    this.api.getQuote(symbol).subscribe({
      next: q => {
        this.quotes.update(curr => ({ ...curr, [symbol]: q }));
      },
      error: e => console.warn('[Market] getQuote failed for', symbol, e)
    });
  }
}
