import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserWithBalance {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  balance?: number;
}

export interface StatusUpdateRequest {
  status: 'ACTIVATED' | 'DEACTIVATED';
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getUsersWithBalances(): Observable<UserWithBalance[]> {
    console.log('🔍 Admin API call:', '/api/admin/users-with-balances');

    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    return this.http.get<UserWithBalance[]>('/api/admin/users-with-balances', { headers });
  }

  updateUserStatus(userId: string, status: 'ACTIVATED' | 'DEACTIVATED'): Observable<UserWithBalance> {
    console.log('🔄 Updating user status:', userId, status);

    const body: StatusUpdateRequest = { status };

    return this.http.put<UserWithBalance>(
      `/api/admin/users/${userId}/status`,
      body
    );
  }
}
