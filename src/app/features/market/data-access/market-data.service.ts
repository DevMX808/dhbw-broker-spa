import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MarketQuote, MarketQuoteDto, MarketSymbol, MarketSymbolDto, mapQuote, mapSymbol } from './market-data.models';

@Injectable({ providedIn: 'root' })
export class MarketDataService {
  private readonly baseUrl = 'http://localhost:8080/api/price';

  constructor(private http: HttpClient) {}

  getSymbols(): Observable<MarketSymbol[]> {
    return this.http.get<MarketSymbolDto[]>(`${this.baseUrl}/symbols`).pipe(
      map(list => list.map(mapSymbol))
    );
  }

  getQuote(symbol: string): Observable<MarketQuote> {
    return this.http.get<MarketQuoteDto>(`${this.baseUrl}/quote/${symbol}`).pipe(
      map(mapQuote)
    );
  }
}
