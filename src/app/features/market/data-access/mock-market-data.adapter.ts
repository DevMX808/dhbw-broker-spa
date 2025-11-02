import { Injectable } from '@angular/core';
import { MarketDataPort, MarketSymbol, MarketPrice } from './market.port';

@Injectable()
export class MockMarketDataAdapter implements MarketDataPort {

  private readonly mockSymbols: MarketSymbol[] = [
    { name: 'Silver', symbol: 'XAG' },
    { name: 'Gold', symbol: 'XAU' },
    { name: 'Bitcoin', symbol: 'BTC' },
    { name: 'Ethereum', symbol: 'ETH' },
    { name: 'Palladium', symbol: 'XPD' },
    { name: 'Copper', symbol: 'HG' }
  ];

  private readonly mockPrices: Record<string, Omit<MarketPrice, 'updatedAt' | 'updatedAtReadable'>> = {
    XAG: { name: 'Silver', symbol: 'XAG', price: 34.52 },
    XAU: { name: 'Gold', symbol: 'XAU', price: 3952.699951 },
    BTC: { name: 'Bitcoin', symbol: 'BTC', price: 67234.89 },
    ETH: { name: 'Ethereum', symbol: 'ETH', price: 2845.32 },
    XPD: { name: 'Palladium', symbol: 'XPD', price: 1087.45 },
    HG: { name: 'Copper', symbol: 'HG', price: 4.23 }
  };

  private delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchSymbols(): Promise<MarketSymbol[]> {
    await this.delay(400);
    return [...this.mockSymbols];
  }

  async fetchPrice(symbol: string): Promise<MarketPrice> {
    await this.delay(300);

    const mockData = this.mockPrices[symbol];
    if (!mockData) {
      throw new Error(`Symbol "${symbol}" not found`);
    }

    const now = new Date();
    const updatedAt = now.toISOString();
    const updatedAtReadable = this.getReadableTimestamp(now);

    return {
      ...mockData,
      updatedAt,
      updatedAtReadable
    };
  }

  private getReadableTimestamp(date: Date): string {
    const secondsAgo = Math.floor((Date.now() - date.getTime()) / 1000);

    if (secondsAgo < 10) return 'a few seconds ago';
    if (secondsAgo < 60) return `${secondsAgo} seconds ago`;

    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;

    const hoursAgo = Math.floor(minutesAgo / 60);
    return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  }
}

