import { InjectionToken } from '@angular/core';

export interface MarketSymbol {
  name: string;
  symbol: string;
  minTradeIncrement: number;
}

export interface MarketPrice {
  name: string;
  symbol: string;
  price: number;
  updatedAt: string;
  updatedAtReadable: string;
  changePct?: number;
  priceChange?: string;
}

export interface MarketDataPort {
  fetchSymbols(): Promise<MarketSymbol[]>;
  fetchPrice(symbol: string): Promise<MarketPrice>;
}

export const MARKET_DATA_PORT = new InjectionToken<MarketDataPort>('MarketDataPort');
