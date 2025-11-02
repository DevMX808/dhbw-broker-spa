import { Injectable, signal } from '@angular/core';

const ACCESS_TOKEN_KEY = 'access_token';

export interface DevJwtPayload {
  sub: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
  firstName?: string;
  lastName?: string;
  given_name?: string;
  family_name?: string;
}

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  readonly token = signal<string | null>(this.get());

  get(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  set(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    this.token.set(token);
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.token.set(null);
  }

  parsePayload(token: string | null): DevJwtPayload | null {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    try {
      const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  isExpired(token: string | null): boolean {
    const p = this.parsePayload(token);
    if (!p) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    return p.exp <= nowSec;
  }
}
