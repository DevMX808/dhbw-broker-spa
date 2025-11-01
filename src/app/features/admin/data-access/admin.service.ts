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

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getUsersWithBalances(): Observable<UserWithBalance[]> {
    return this.http.get<UserWithBalance[]>('/api/admin/users-with-balances');
  }
}