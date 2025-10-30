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

    // Use the BFF price endpoints
    if (isHeroku || (!isLocalhost && environment.production)) {
      return `${environment.apiBaseUrl}/api/price`;
    } else {
      return 'http://localhost:8080/api/price';
    }
  }

  /**
   * Holt reale Chart-Daten aus dem BFF: GET /api/price/24h/{symbol}
   * Konvertiert die Antwort in das MinuteChartData-Format und liefert
   * die letzten 60 Minuten (sofern vorhanden).
   */
  getMinuteChart(symbol: string): Observable<MinuteChartData> {
    const url = `${this.baseUrl}/24h/${encodeURIComponent(symbol)}`;

    // JWT Token aus localStorage holen (falls vorhanden)
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    return this.http.get<any[]>(url, { headers }).pipe(
      map((items) => {
        if (!Array.isArray(items)) {
          // Wenn die API etwas anderes zurückgibt, dann safe-fallback
          return { symbol, dataPoints: [] } as MinuteChartData;
        }

        // Mappe die GraphQL-Response-Felder auf ChartDataPoint
        const parsed: ChartDataPoint[] = items
          .map((it: any) => {
            // GraphQL Response hat: sourceTsUtc, ingestedTsUtc, priceUsd
            const tsRaw = it.sourceTsUtc ?? it.ingestedTsUtc ?? it.timestamp ?? it.time ?? it.date;
            const priceRaw = it.priceUsd ?? it.price ?? it.value;

            const timestamp = tsRaw ? new Date(tsRaw).toISOString() : null;
            const price = priceRaw != null ? Number(priceRaw) : null;

            if (!timestamp || price == null || Number.isNaN(price)) return null;

            return { timestamp, price } as ChartDataPoint;
          })
          .filter(Boolean) as ChartDataPoint[];

        // Sortiere nach Zeit
        parsed.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        // Wähle die letzten 60 Minuten / Punkte
        const now = Date.now();
        const sixtyMinAgo = now - 60 * 60 * 1000;
        const last60 = parsed.filter(p => new Date(p.timestamp).getTime() >= sixtyMinAgo);

        // Falls weniger als 60 Punkte vorhanden, nimm die letzten bis zu 60
        const resultPoints = last60.length >= 60 ? last60.slice(-60) : parsed.slice(-60);

        return {
          symbol,
          dataPoints: resultPoints
        } as MinuteChartData;
      })
    );
  }
}
