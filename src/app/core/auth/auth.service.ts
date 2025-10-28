// src/app/core/auth/auth.service.ts
import { Injectable, computed, signal } from '@angular/core';
import { DevAuthStoreService } from './dev-auth-store.service';
import { TokenStorageService, DevJwtPayload } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TTL_MIN = 30;

  readonly user = signal<DevJwtPayload | null>(null);
  readonly isAuthenticated = computed(() => !!this.user());

  constructor(
    private readonly store: DevAuthStoreService,
    private readonly tokens: TokenStorageService
  ) {
    const token = this.tokens.get();
    if (token && !this.tokens.isExpired(token)) {
      const payload = this.tokens.parsePayload(token);
      if (payload) this.user.set(payload);
    } else {
      this.tokens.clear();
    }
  }

  async signIn(email: string, password: string): Promise<boolean> {
    const users = await this.store.load();
    const match = users.find(u => u.email === email && u.password === password);
    if (!match) return false;
    const payload = this.createPayload(email, match.roles);
    const token = this.createUnsignedToken(payload);
    this.tokens.set(token);
    this.user.set(payload);
    return true;
  }

  async signUp(email: string, password: string): Promise<boolean> {
    const roles = ['USER'];
    const payload = this.createPayload(email, roles);
    const token = this.createUnsignedToken(payload);
    this.tokens.set(token);
    this.user.set(payload);
    return true;
  }

  signOut(): void {
    this.tokens.clear();
    this.user.set(null);
  }

  hasRole(role: string): boolean {
    return !!this.user()?.roles?.includes(role);
  }

  private createPayload(email: string, roles: string[]): DevJwtPayload {
    const now = Math.floor(Date.now() / 1000);
    return { sub: email, email, roles, iat: now, exp: now + this.TTL_MIN * 60 };
  }

  private createUnsignedToken(payload: DevJwtPayload): string {
    const header = { alg: 'none', typ: 'JWT' };
    const b64 = (obj: any) =>
      btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    return `${b64(header)}.${b64(payload)}.`; // leerer Signature-Teil, DEV ONLY
  }
}
