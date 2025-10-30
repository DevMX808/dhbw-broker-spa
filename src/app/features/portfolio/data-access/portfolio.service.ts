import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeldTrade } from '../models/held-trade.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly baseUrl = '/api/held-trades';

  constructor(private http: HttpClient) {}

  getHeldTrades(): Observable<HeldTrade[]> {
    return this.http.get<HeldTrade[]>(this.baseUrl);
  }

  buyTrade(trade: Partial<HeldTrade>): Observable<HeldTrade> {
    return this.http.post<HeldTrade>(`${this.baseUrl}/buy`, trade);
  }

  sellTrade(tradeId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/sell/${tradeId}`);
  }
}
