import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {MarketDataPort, MarketPrice, MarketSymbol} from './market.port';
import {environment} from '../../../../environments/environments';

@Injectable()
export class HttpMarketDataAdapter implements MarketDataPort {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/price`;

  constructor() {
  }

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

  async fetchPrice(symbol: string): Promise<MarketPrice> {
    try {

      const [priceResponse, trendResponse] = await Promise.all([
        firstValueFrom(this.http.get<MarketPriceDto>(`${this.baseUrl}/quote/${symbol}`)),
        firstValueFrom(this.http.get<{priceChange: string}>(`${this.baseUrl}/trend/${symbol}`)).catch(() => null)
      ]);

      return this.mapPrice(priceResponse, trendResponse?.priceChange);
    } catch (error) {
      throw error;
    }
  }

  private mapSymbol(dto: MarketSymbolDto): MarketSymbol {
    return {
      name: dto.name,
      symbol: dto.symbol
    };
  }

  private mapPrice(dto: MarketPriceDto, priceChange?: string): MarketPrice {

    const changePct = dto.changePct
                   ?? dto.change1mPct
                   ?? dto.priceChange
                   ?? dto.percentChange
                   ?? dto.change
                   ?? undefined;

    return {
      name: dto.name,
      symbol: dto.symbol,
      price: dto.price,
      updatedAt: dto.updatedAt,
      updatedAtReadable: dto.updatedAtReadable || this.getReadableTimestamp(dto.updatedAt),
      changePct: changePct,
      priceChange: priceChange
    };
  }

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

interface MarketSymbolDto {
  name: string;
  symbol: string;
}

interface MarketPriceDto {
  name: string;
  symbol: string;
  price: number;
  updatedAt: string;
  updatedAtReadable?: string;
  changePct?: number;
  change1mPct?: number;
  priceChange?: number;
  percentChange?: number;
  change?: number;
  [key: string]: any;
}

