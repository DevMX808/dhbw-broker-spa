import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrlBFF = environment.bffUrl;
  private baseUrlGraphql = environment.graphqlUrl;

  constructor(private http: HttpClient) {}

  getBffHealth(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.baseUrlBFF}/health`).pipe(
      retry(2),
      catchError(err => { console.error('BFF Error:', err); throw 'BFF Health Error'; })
    );
  }

  getGraphqlHealth(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.baseUrlGraphql}/health`).pipe(
      retry(2),
      catchError(err => { console.error('GraphQL Error:', err); throw 'GraphQL Health Error'; })
    );
  }

  getAllHealth(): Observable<[{ status: string }, { status: string }]> {
    return forkJoin([this.getBffHealth(), this.getGraphqlHealth()]);
  }
}
