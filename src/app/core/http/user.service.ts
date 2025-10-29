// src/app/core/http/user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeEmailRequest {
  newEmail: string;
  password: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.production 
    ? `${environment.apiBaseUrl}/api/user`
    : 'http://localhost:8080/api/user';

  constructor() {
    console.log('UserService baseUrl:', this.baseUrl);
    console.log('Environment production:', environment.production);
    console.log('Environment apiBaseUrl:', environment.apiBaseUrl);
  }

  updateProfile(request: UpdateProfileRequest): Observable<User> {
    const url = `${this.baseUrl}/profile`;
    console.log('Making PUT request to:', url);
    console.log('Request payload:', request);
    return this.http.put<User>(url, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/password`, request);
  }

  changeEmail(request: ChangeEmailRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/email`, request);
  }

  deleteAccount(request: DeleteAccountRequest): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/account`, { body: request });
  }
}