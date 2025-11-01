import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface TradeRequest {
  assetSymbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
}

export interface TradeResponse {
  id: string;
  assetSymbol: string;
  side: string;
  quantity: number;
  price: number;
  total: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = this.getBaseUrl();

  constructor() {
    console.log('TradeService baseUrl:', this.baseUrl);
  }

  private getBaseUrl(): string {
    const isHeroku = window.location.hostname.includes('herokuapp.com');
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isHeroku || (!isLocalhost && environment.production)) {
      return `${environment.apiBaseUrl}/api/trades`;
    } else {
      return 'http://localhost:8080/api/trades';
    }
  }

  executeTrade(request: TradeRequest): Observable<TradeResponse> {
    console.log('Executing trade:', request);
    console.log('Trade URL:', this.baseUrl);
    return this.http.post<TradeResponse>(this.baseUrl, request);
  }

  getUserTrades(): Observable<TradeResponse[]> {
    const url = `${this.baseUrl}/user`;
    console.log('Fetching user trades from:', url);
    return this.http.get<TradeResponse[]>(url);
  }

  getUserTradesByAsset(assetSymbol: string): Observable<TradeResponse[]> {
    const url = `${this.baseUrl}/user/${assetSymbol}`;
    console.log('Fetching user trades for asset:', assetSymbol, 'from:', url);
    return this.http.get<TradeResponse[]>(url);
  }
}
