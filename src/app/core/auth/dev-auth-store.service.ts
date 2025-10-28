// src/app/core/auth/dev-auth-store.service.ts
import { Injectable } from '@angular/core';

export interface DevUser { email: string; password: string; roles: string[]; }

@Injectable({ providedIn: 'root' })
export class DevAuthStoreService {
  private cache: DevUser[] | null = null;

  async load(): Promise<DevUser[]> {
    if (this.cache) return this.cache;
    const url = new URL('dev-auth/users.properties', document.baseURI).toString();
    const res = await fetch(url, { cache: 'no-cache' });
    const text = await res.text();
    const users: Record<string, Partial<DevUser>> = {};
    text.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const [k, v] = trimmed.split('=');
      if (!k || v === undefined) return;
      const [, idx, field] = k.match(/^user\.(\d+)\.(email|password|roles)$/) || [];
      if (!idx) return;
      users[idx] = users[idx] || {};
      if (field === 'roles') users[idx].roles = v.split(',').map(s => s.trim()).filter(Boolean);
      else (users[idx] as any)[field] = v.trim();
    });
    this.cache = Object.values(users)
      .filter(u => u.email && u.password && u.roles?.length)
      .map(u => ({ email: u.email!, password: u.password!, roles: u.roles! }));
    return this.cache!;
  }
}
