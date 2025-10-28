import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MarketQuote, MarketQuoteDto, MarketSymbol, MarketSymbolDto, mapQuote, mapSymbol } from './market-data.models';

@Injectable({ providedIn: 'root' })
export class MarketDataService {
  private readonly base = 'dev-api/market';

  constructor(private http: HttpClient) {}

  getSymbols(): Observable<MarketSymbol[]> {
    return this.http.get<MarketSymbolDto[]>(`${this.base}/symbols.json`).pipe(
      map(list => list.map(mapSymbol))
    );
  }

  getQuote(symbol: string): Observable<MarketQuote> {
    return this.http.get<MarketQuoteDto>(`${this.base}/price_${symbol}.json`).pipe(
      map(mapQuote)
    );
  }
}
