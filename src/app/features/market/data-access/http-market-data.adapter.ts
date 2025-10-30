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
  }

  /**
   * Fetch all tradable symbols from the backend
   */
  async fetchSymbols(): Promise<MarketSymbol[]> {
    try {

      const response = await firstValueFrom(
        this.http.get<MarketSymbolDto[]>(`${this.baseUrl}/symbols`)
      );

      return response.map(dto => this.mapSymbol(dto));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetch current price for a specific symbol from the backend
   */
  async fetchPrice(symbol: string): Promise<MarketPrice> {
    try {

      const response = await firstValueFrom(
        this.http.get<MarketPriceDto>(`${this.baseUrl}/quote/${symbol}`)
      );

      return this.mapPrice(response);
    } catch (error) {
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

    const changePct = dto.changePct
                   ?? dto.change1mPct
                   ?? dto.priceChange
                   ?? dto.percentChange
                   ?? dto.change
                   ?? undefined;

    const result = {
      name: dto.name,
      symbol: dto.symbol,
      price: dto.price,
      updatedAt: dto.updatedAt,
      updatedAtReadable: dto.updatedAtReadable || this.getReadableTimestamp(dto.updatedAt),
      changePct: changePct
    };

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

