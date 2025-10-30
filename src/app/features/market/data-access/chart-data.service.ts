import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { MinuteChartData, ChartDataPoint } from './chart-data.models';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = this.getBaseUrl();

  constructor() {
    console.log('ChartDataService baseUrl:', this.baseUrl);
  }

  private getBaseUrl(): string {
    const isHeroku = window.location.hostname.includes('herokuapp.com');
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isHeroku || (!isLocalhost && environment.production)) {
      return `${environment.apiBaseUrl}/api/chart`;
    } else {
      return 'http://localhost:8080/api/chart';
    }
  }

  getMinuteChart(symbol: string): Observable<MinuteChartData> {
    // Erstelle Mock-Daten für 60 Minuten
    return this.generateMockMinuteData(symbol);
  }

  private generateMockMinuteData(symbol: string): Observable<MinuteChartData> {
    const now = new Date();
    const dataPoints: ChartDataPoint[] = [];
    const basePrice = this.getBasePriceForSymbol(symbol);
    
    // Generiere Daten für die letzten 60 Minuten
    for (let i = 60; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * 60000)); // 60000ms = 1 minute
      const variation = (Math.random() - 0.5) * 0.02; // ±1% Variation
      const price = basePrice * (1 + variation);
      
      dataPoints.push({
        timestamp: timestamp.toISOString(),
        price: Math.round(price * 100) / 100
      });
    }

    return of({
      symbol,
      dataPoints
    });
  }

  private getBasePriceForSymbol(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'BTC': 45000,
      'ETH': 2800,
      'ADA': 0.35,
      'DOT': 8.50,
      'LINK': 12.00,
      'SOL': 85.00
    };
    return basePrices[symbol] || 100;
  }
}