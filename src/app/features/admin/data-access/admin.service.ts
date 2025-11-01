import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

export interface UserWithBalance {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  status?: 'ACTIVATED' | 'DEACTIVATED';
  balance?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StatusUpdateRequest {
  status: 'ACTIVATED' | 'DEACTIVATED';
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = this.getBaseUrl();

  private getBaseUrl(): string {
    const isHeroku = window.location.hostname.includes('herokuapp.com');
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (isHeroku || (!isLocalhost && environment.production)) {
      return `${environment.apiBaseUrl}/api/admin`;
    } else {
      return 'http://localhost:8080/api/admin';
    }
  }

  getUsersWithBalances(): Observable<UserWithBalance[]> {
    const url = `${this.baseUrl}/users-with-balances`;
    return this.http.get<UserWithBalance[]>(url, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }

  updateUserStatus(userId: string, status: 'ACTIVATED' | 'DEACTIVATED'): Observable<UserWithBalance> {
    const url = `${this.baseUrl}/users/${userId}/status`;
    const body: StatusUpdateRequest = { status };
    return this.http.put<UserWithBalance>(url, body);
  }
}
