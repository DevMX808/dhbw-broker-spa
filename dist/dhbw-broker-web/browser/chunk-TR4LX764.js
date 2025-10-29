import {
  TokenStorageService
} from "./chunk-DFJEWIOY.js";
import {
  HttpClient,
  HttpHeaders
} from "./chunk-ZKLCJJRR.js";
import {
  Observable,
  catchError,
  computed,
  defer,
  inject,
  map,
  signal,
  throwError,
  ɵɵdefineInjectable
} from "./chunk-T4LT6FP2.js";

// src/environments/environments.ts
var environment = {
  production: false,
  apiBaseUrl: "https://rocky-atoll-88358-b10b362cee67.herokuapp.com"
  // Heroku BFF Backend
};

// src/app/core/auth/auth.service.ts
var AuthService = class _AuthService {
  http = inject(HttpClient);
  tokens = inject(TokenStorageService);
  baseUrl = environment.apiBaseUrl;
  user = signal(null);
  isAuthenticated = computed(() => !!this.user());
  loading = signal(false);
  error = signal(null);
  // Queue system for concurrent login requests
  loginQueue = [];
  isLoginInProgress = false;
  constructor() {
    this.initializeFromToken();
  }
  initializeFromToken() {
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
  isValidPayload(payload) {
    return payload && payload.sub && payload.email && payload.exp;
  }
  signIn(credentials) {
    return defer(() => {
      if (this.isLoginInProgress) {
        return new Observable((subscriber) => {
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
  executeLogin(credentials) {
    this.isLoginInProgress = true;
    this.loading.set(true);
    this.error.set(null);
    const loginUrl = `${this.baseUrl}/auth/login`;
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this.http.post(loginUrl, credentials, { headers }).pipe(map((response) => {
      this.handleAuthResponse(response);
      this.processLoginQueue(response, null);
      return response;
    }), catchError((error) => {
      this.handleAuthError(error);
      this.processLoginQueue(null, error);
      return throwError(() => error);
    }));
  }
  processLoginQueue(response, error) {
    this.isLoginInProgress = false;
    const queue = [...this.loginQueue];
    this.loginQueue = [];
    queue.forEach((queuedRequest) => {
      if (response) {
        queuedRequest.resolve(response);
      } else if (error) {
        queuedRequest.reject(error);
      }
    });
  }
  signUp(userData) {
    this.loading.set(true);
    this.error.set(null);
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this.http.post(`${this.baseUrl}/auth/register`, userData, { headers }).pipe(map((response) => {
      this.handleAuthResponse(response);
      return response;
    }), catchError((error) => {
      this.handleAuthError(error);
      return throwError(() => error);
    }));
  }
  handleAuthResponse(response) {
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
  handleAuthError(error) {
    this.loading.set(false);
    let errorMessage = "Ein Fehler ist aufgetreten";
    if (error.status === 401) {
      errorMessage = "Ung\xFCltige Anmeldedaten";
    } else if (error.status === 409) {
      errorMessage = "E-Mail-Adresse bereits registriert";
    } else if (error.status === 400) {
      errorMessage = "Ung\xFCltige Eingabedaten";
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }
    this.error.set(errorMessage);
  }
  signOut() {
    this.clearLoginQueue();
    this.isLoginInProgress = false;
    this.tokens.clear();
    this.user.set(null);
    this.error.set(null);
    this.loading.set(false);
  }
  clearLoginQueue() {
    const queue = [...this.loginQueue];
    this.loginQueue = [];
    queue.forEach((queuedRequest) => {
      queuedRequest.reject(new Error("Login cancelled due to sign out"));
    });
  }
  hasRole(role) {
    return !!this.user()?.roles?.includes(role);
  }
  clearError() {
    this.error.set(null);
  }
  // Helper method to get authorization headers for API calls
  getAuthHeaders() {
    const token = this.tokens.get();
    if (token) {
      return new HttpHeaders({
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      });
    }
    return new HttpHeaders({
      "Content-Type": "application/json"
    });
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};

export {
  AuthService
};
//# sourceMappingURL=chunk-TR4LX764.js.map
