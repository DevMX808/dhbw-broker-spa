import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MarketDataPort, MarketSymbol, MarketPrice } from './market.port';
import { environment } from '../../../../environments/environments';

/**
 * HTTP implementation of MarketDataPort
 * Connects to the real backend API for market data
 */
@Injectable()
export class HttpMarketDataAdapter implements MarketDataPort {
  private readonly http = inject(HttpClient);
  // Always use the Heroku API URL directly
  private readonly baseUrl = `${environment.apiBaseUrl}/api/price`;

  constructor() {
    console.log('[HttpMarketDataAdapter] Initialized with baseUrl:', this.baseUrl);
  }

  /**
   * Fetch all tradable symbols from the backend
   */
  async fetchSymbols(): Promise<MarketSymbol[]> {
    try {
      console.log('[HttpMarketDataAdapter] Fetching symbols from:', `${this.baseUrl}/symbols`);

      const response = await firstValueFrom(
        this.http.get<MarketSymbolDto[]>(`${this.baseUrl}/symbols`)
      );

      console.log('[HttpMarketDataAdapter] Symbols received:', response);
      return response.map(dto => this.mapSymbol(dto));
    } catch (error) {
      console.error('[HttpMarketDataAdapter] fetchSymbols failed:', error);
      throw error;
    }
  }

  /**
   * Fetch current price for a specific symbol from the backend
   */
  async fetchPrice(symbol: string): Promise<MarketPrice> {
    try {
      console.log('[HttpMarketDataAdapter] Fetching price for:', symbol, 'from:', `${this.baseUrl}/quote/${symbol}`);

      const response = await firstValueFrom(
        this.http.get<MarketPriceDto>(`${this.baseUrl}/quote/${symbol}`)
      );

      console.log('[HttpMarketDataAdapter] ⚠️ RAW RESPONSE for', symbol, ':', response);
      console.log('[HttpMarketDataAdapter] Available fields:', Object.keys(response));
      console.log('[HttpMarketDataAdapter] changePct:', response.changePct);
      console.log('[HttpMarketDataAdapter] change1mPct:', response.change1mPct);
      console.log('[HttpMarketDataAdapter] Full response object:', JSON.stringify(response, null, 2));

      return this.mapPrice(response);
    } catch (error) {
      console.error('[HttpMarketDataAdapter] fetchPrice failed for', symbol, ':', error);
      throw error;
    }
  }

  /**
   * Map backend DTO to domain model
   */
  private mapSymbol(dto: MarketSymbolDto): MarketSymbol {
    return {
      name: dto.name,
      symbol: dto.symbol
    };
  }

  /**
   * Map backend price DTO to domain model
   */
  private mapPrice(dto: MarketPriceDto): MarketPrice {
    // Versuche verschiedene mögliche Feldnamen für die Preisänderung
    const changePct = dto.changePct
                   ?? dto.change1mPct
                   ?? dto.priceChange
                   ?? dto.percentChange
                   ?? dto.change
                   ?? undefined;

    console.log('[HttpMarketDataAdapter] mapPrice() - dto object:', dto);
    console.log('[HttpMarketDataAdapter] mapPrice() - dto.changePct:', dto.changePct);
    console.log('[HttpMarketDataAdapter] mapPrice() - dto.change1mPct:', dto.change1mPct);
    console.log('[HttpMarketDataAdapter] mapPrice() - dto.priceChange:', dto.priceChange);
    console.log('[HttpMarketDataAdapter] mapPrice() - dto.percentChange:', dto.percentChange);
    console.log('[HttpMarketDataAdapter] mapPrice() - dto.change:', dto.change);
    console.log('[HttpMarketDataAdapter] mapPrice() - resolved changePct:', changePct);
    console.log('[HttpMarketDataAdapter] mapPrice() - typeof changePct:', typeof changePct);

    const result = {
      name: dto.name,
      symbol: dto.symbol,
      price: dto.price,
      updatedAt: dto.updatedAt,
      updatedAtReadable: dto.updatedAtReadable || this.getReadableTimestamp(dto.updatedAt),
      changePct: changePct
    };

    console.log('[HttpMarketDataAdapter] mapPrice() - result:', result);
    return result;
  }

  /**
   * Generate human-readable timestamp if not provided by backend
   */
  private getReadableTimestamp(isoString: string): string {
    try {
      const date = new Date(isoString);
      const secondsAgo = Math.floor((Date.now() - date.getTime()) / 1000);

      if (secondsAgo < 10) return 'gerade eben';
      if (secondsAgo < 60) return `vor ${secondsAgo} Sekunden`;

      const minutesAgo = Math.floor(secondsAgo / 60);
      if (minutesAgo < 60) return `vor ${minutesAgo} Minute${minutesAgo > 1 ? 'n' : ''}`;

      const hoursAgo = Math.floor(minutesAgo / 60);
      if (hoursAgo < 24) return `vor ${hoursAgo} Stunde${hoursAgo > 1 ? 'n' : ''}`;

      const daysAgo = Math.floor(hoursAgo / 24);
      return `vor ${daysAgo} Tag${daysAgo > 1 ? 'en' : ''}`;
    } catch (error) {
      console.warn('[HttpMarketDataAdapter] Failed to parse timestamp:', isoString, error);
      return 'kürzlich';
    }
  }
}

/**
 * Backend DTOs
 */
interface MarketSymbolDto {
  name: string;
  symbol: string;
}

interface MarketPriceDto {
  name: string;
  symbol: string;
  price: number;
  updatedAt: string; // ISO8601 format
  updatedAtReadable?: string;
  // Verschiedene mögliche Feldnamen für Preisänderungen
  changePct?: number; // Prozentuale Änderung seit letzter Minute
  change1mPct?: number; // Alternative Feldname
  priceChange?: number; // Weitere Alternative
  percentChange?: number; // Weitere Alternative
  change?: number; // Weitere Alternative
  // Alle anderen Felder, die das Backend möglicherweise sendet
  [key: string]: any;
}

