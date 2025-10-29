import {
  signal,
  ɵɵdefineInjectable
} from "./chunk-T4LT6FP2.js";

// src/app/core/auth/token-storage.service.ts
var ACCESS_TOKEN_KEY = "access_token";
var TokenStorageService = class _TokenStorageService {
  token = signal(this.get());
  get() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  set(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    this.token.set(token);
  }
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.token.set(null);
  }
  parsePayload(token) {
    if (!token)
      return null;
    const parts = token.split(".");
    if (parts.length < 2)
      return null;
    try {
      const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
  isExpired(token) {
    const p = this.parsePayload(token);
    if (!p)
      return true;
    const nowSec = Math.floor(Date.now() / 1e3);
    return p.exp <= nowSec;
  }
  static \u0275fac = function TokenStorageService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TokenStorageService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TokenStorageService, factory: _TokenStorageService.\u0275fac, providedIn: "root" });
};

export {
  TokenStorageService
};
//# sourceMappingURL=chunk-DFJEWIOY.js.map
