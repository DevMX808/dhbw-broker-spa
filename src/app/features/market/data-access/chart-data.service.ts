import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environments';
import { MinuteChartData, ChartDataPoint } from './chart-data.models';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = this.getBaseUrl();

  constructor() {
  }

  private getBaseUrl(): string {
    const isHeroku = window.location.hostname.includes('herokuapp.com');
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isHeroku || (!isLocalhost && environment.production)) {
      return `${environment.apiBaseUrl}/api/price`;
    } else {
      return 'http://localhost:8080/api/price';
    }
  }

  getMinuteChart(symbol: string): Observable<MinuteChartData> {
    const url = `${this.baseUrl}/24h/${encodeURIComponent(symbol)}`;

    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    return this.http.get<any[]>(url, { headers }).pipe(
      map((items) => {
        if (!Array.isArray(items)) {
          return { symbol, dataPoints: [] } as MinuteChartData;
        }

        const parsed: ChartDataPoint[] = items
          .map((it: any) => {
            const tsRaw = it.sourceTsUtc ?? it.ingestedTsUtc ?? it.timestamp ?? it.time ?? it.date;
            const priceRaw = it.priceUsd ?? it.price ?? it.value;

            const timestamp = tsRaw ? new Date(tsRaw).toISOString() : null;
            const price = priceRaw != null ? Number(priceRaw) : null;

            if (!timestamp || price == null || Number.isNaN(price)) return null;

            return { timestamp, price } as ChartDataPoint;
          })
          .filter(Boolean) as ChartDataPoint[];

        parsed.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const now = Date.now();
        const sixHoursAgo = now - 6 * 60 * 60 * 1000;

        const lastSixHours = parsed.filter(p => new Date(p.timestamp).getTime() >= sixHoursAgo);

        const resultPoints = lastSixHours.length > 0 ? lastSixHours : parsed.slice(-360);

        return {
          symbol,
          dataPoints: resultPoints
        } as MinuteChartData;
      })
    );
  }
}
