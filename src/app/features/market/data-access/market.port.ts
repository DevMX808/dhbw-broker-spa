import { InjectionToken } from '@angular/core';

/**
 * Port (Interface) for Market Data Access
 * Defines the contract for fetching market symbols and prices.
 * Can be implemented by MockMarketDataAdapter, HttpMarketDataAdapter, etc.
 */

export interface MarketSymbol {
  name: string;
  symbol: string;
}

export interface MarketPrice {
  name: string;
  symbol: string;
  price: number;
  updatedAt: string; // ISO8601 format
  updatedAtReadable: string;
}

/**
 * Market Data Port - contract for data access
 */
export interface MarketDataPort {
  fetchSymbols(): Promise<MarketSymbol[]>;
  fetchPrice(symbol: string): Promise<MarketPrice>;
}

/**
 * Injection token for MarketDataPort
 * Use this token to provide and inject the adapter
 */
export const MARKET_DATA_PORT = new InjectionToken<MarketDataPort>('MarketDataPort');

