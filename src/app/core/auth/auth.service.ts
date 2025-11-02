import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, map, defer } from 'rxjs';
import { TokenStorageService, DevJwtPayload } from './token-storage.service';
import { environment } from '../../../environments/environments';
import { Router } from '@angular/router';

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
  expiresAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  exp: number;
}

interface QueuedRequest {
  credentials: SignInInput;
  resolve: (value: JwtAuthResponse) => void;
  reject: (error: any) => void;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokens = inject(TokenStorageService);
  private readonly router = inject(Router);
  private readonly baseUrl = environment.apiBaseUrl;

  readonly user = signal<AuthUser | null>(null);
  readonly isAuthenticated = computed(() => !!this.user());
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  private loginQueue: QueuedRequest[] = [];
  private isLoginInProgress = false;

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
          firstName: payload.given_name,
          lastName: payload.family_name,
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
    return defer(() => {
      if (this.isLoginInProgress) {
        return new Observable<JwtAuthResponse>(subscriber => {
          this.loginQueue.push({
            credentials,
            resolve: (response) => {
              subscriber.next(response);
              subscriber.complete();
            },
            reject: (error) => {
              subscriber.error(error);
            }
          });
        });
      }

      return this.executeLogin(credentials);
    });
  }

  private executeLogin(credentials: SignInInput): Observable<JwtAuthResponse> {
    this.isLoginInProgress = true;
    this.loading.set(true);
    this.error.set(null);

    const loginUrl = `${this.baseUrl}/auth/login`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<JwtAuthResponse>(loginUrl, credentials, { headers })
      .pipe(
        map(response => {
          this.handleAuthResponse(response);
          this.processLoginQueue(response, null);
          return response;
        }),
        catchError(error => {
          this.handleAuthError(error);
          this.processLoginQueue(null, error);
          return throwError(() => error);
        })
      );
  }

  private processLoginQueue(response: JwtAuthResponse | null, error: any): void {
    this.isLoginInProgress = false;

    const queue = [...this.loginQueue];
    this.loginQueue = [];

    queue.forEach(queuedRequest => {
      if (response) {
        queuedRequest.resolve(response);
      } else if (error) {
        queuedRequest.reject(error);
      }
    });
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

      if (!environment.production) {
      }

      if (payload && this.isValidPayload(payload)) {
        this.user.set({
          id: payload.sub,
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
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
    this.clearLoginQueue();
    this.isLoginInProgress = false;

    this.tokens.clear();
    this.user.set(null);
    this.error.set(null);
    this.loading.set(false);

    this.router.navigate(['/account']).catch(err => console.error('Logout Navigation Error:', err));
  }

  private clearLoginQueue(): void {
    const queue = [...this.loginQueue];
    this.loginQueue = [];

    queue.forEach(queuedRequest => {
      queuedRequest.reject(new Error('Login cancelled due to sign out'));
    });
  }

  hasRole(role: string): boolean {
    return !!this.user()?.roles?.includes(role);
  }

  clearError(): void {
    this.error.set(null);
  }

}
