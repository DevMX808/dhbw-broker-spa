import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { AuthService } from './auth.service';

export interface WalletBalance {
  balance: number;
}

export interface TradeRequest {
  assetSymbol: string;
  quantity: number;
  side: 'BUY' | 'SELL';
}

export interface TradeResponse {
  tradeId: string;
  executedAt: string;
  priceUsd: number;
  assetSymbol: string;
  side: string;
  quantity: number;
}

export interface Trade {
  tradeId: string;
  executedAt: string;
  priceUsd: number;
  quantity: number;
  side: string;
  asset: {
    assetSymbol: string;
    displayName: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BrokerService {
  private apiUrl = environment.bffUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get wallet balance
   */
  getWalletBalance(): Observable<WalletBalance> {
    return this.http.get<WalletBalance>(`${this.apiUrl}/api/wallet/balance`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Execute a trade
   */
  executeTrade(tradeRequest: TradeRequest): Observable<TradeResponse> {
    return this.http.post<TradeResponse>(`${this.apiUrl}/api/trades`, tradeRequest, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Get user trades
   */
  getUserTrades(): Observable<Trade[]> {
    return this.http.get<Trade[]>(`${this.apiUrl}/api/trades/user`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Get trades for specific asset
   */
  getUserTradesByAsset(assetSymbol: string): Observable<Trade[]> {
    return this.http.get<Trade[]>(`${this.apiUrl}/api/trades/user/${assetSymbol}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Get current asset price
   */
  getAssetPrice(assetSymbol: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/price-rings/${assetSymbol}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}