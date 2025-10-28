// src/app/core/auth/auth.service.ts
import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { TokenStorageService, DevJwtPayload } from './token-storage.service';
import { environment } from '../../../environments/environments';

// Authentication models matching backend DTOs
export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface JwtAuthResponse {
  accessToken: string;
  tokenType: string;
  expiresAt: string; // ISO string format from backend
}

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokens = inject(TokenStorageService);
  private readonly baseUrl = environment.apiBaseUrl;

  readonly user = signal<AuthUser | null>(null);
  readonly isAuthenticated = computed(() => !!this.user());
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.initializeFromToken();
  }

  private initializeFromToken(): void {
    const token = this.tokens.get();
    if (token && !this.tokens.isExpired(token)) {
      const payload = this.tokens.parsePayload(token);
      if (payload && this.isValidPayload(payload)) {
        this.user.set({
          id: payload.sub,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          roles: payload.roles || [],
          exp: payload.exp
        });
      } else {
        this.tokens.clear();
      }
    } else {
      this.tokens.clear();
    }
  }

  private isValidPayload(payload: any): payload is DevJwtPayload {
    return payload && payload.sub && payload.email && payload.exp;
  }

  signIn(credentials: SignInInput): Observable<JwtAuthResponse> {
    this.loading.set(true);
    this.error.set(null);

    const loginUrl = `${this.baseUrl}/auth/login`;
    console.log('🔐 DEBUG: Login URL:', loginUrl);
    console.log('🔐 DEBUG: Base URL from environment:', this.baseUrl);
    console.log('🔐 DEBUG: Is production?', environment.production);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<JwtAuthResponse>(loginUrl, credentials, { headers })
      .pipe(
        map(response => {
          console.log('✅ Login successful:', response);
          this.handleAuthResponse(response);
          return response;
        }),
        catchError(error => {
          console.error('❌ Login error:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            url: error.url,
            name: error.name
          });
          this.handleAuthError(error);
          return throwError(() => error);
        })
      );
  }

  signUp(userData: SignUpInput): Observable<JwtAuthResponse> {
    this.loading.set(true);
    this.error.set(null);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<JwtAuthResponse>(`${this.baseUrl}/auth/register`, userData, { headers })
      .pipe(
        map(response => {
          this.handleAuthResponse(response);
          return response;
        }),
        catchError(error => {
          this.handleAuthError(error);
          return throwError(() => error);
        })
      );
  }

  private handleAuthResponse(response: JwtAuthResponse): void {
    this.loading.set(false);
    
    if (response.accessToken) {
      this.tokens.set(response.accessToken);
      const payload = this.tokens.parsePayload(response.accessToken);
      
      if (payload && this.isValidPayload(payload)) {
        this.user.set({
          id: payload.sub,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          roles: payload.roles || [],
          exp: payload.exp
        });
      }
    }
  }

  private handleAuthError(error: any): void {
    this.loading.set(false);
    
    let errorMessage = 'Ein Fehler ist aufgetreten';
    
    if (error.status === 401) {
      errorMessage = 'Ungültige Anmeldedaten';
    } else if (error.status === 409) {
      errorMessage = 'E-Mail-Adresse bereits registriert';
    } else if (error.status === 400) {
      errorMessage = 'Ungültige Eingabedaten';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }
    
    this.error.set(errorMessage);
  }

  signOut(): void {
    this.tokens.clear();
    this.user.set(null);
    this.error.set(null);
  }

  hasRole(role: string): boolean {
    return !!this.user()?.roles?.includes(role);
  }

  clearError(): void {
    this.error.set(null);
  }

  // Helper method to get authorization headers for API calls
  getAuthHeaders(): HttpHeaders {
    const token = this.tokens.get();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Debug method to get current token
  getCurrentToken(): string | null {
    return this.tokens.get();
  }

  // Debug method to get decoded token payload
  getDecodedToken(): any {
    const token = this.tokens.get();
    return this.tokens.parsePayload(token);
  }

  // Debug method to log token info to console
  logTokenInfo(): void {
    const token = this.getCurrentToken();
    const payload = this.getDecodedToken();
    console.log('🔐 Current JWT Token:', token);
    console.log('📋 Decoded Payload:', payload);
    console.log('👤 Current User:', this.user());
    console.log('🔒 Is Authenticated:', this.isAuthenticated());
  }
}
