import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrlBFF = 'https://rocky-atoll-88358-b10b362cee67.herokuapp.com';

  constructor(private http: HttpClient) {}

  getHealth(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.baseUrlBFF}/health`);
  }
}
