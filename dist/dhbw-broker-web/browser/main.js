import {
  AuthService,
  environment
} from "./chunk-O2R6TYRU.js";
import {
  MARKET_DATA_PORT
} from "./chunk-P4DKFGY5.js";
import {
  TokenStorageService
} from "./chunk-JSOLXCOT.js";
import {
  CommonModule,
  HttpClient,
  HttpErrorResponse,
  NavigationEnd,
  Router,
  RouterOutlet,
  bootstrapApplication,
  provideHttpClient,
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withFetch,
  withInterceptors
} from "./chunk-OW27TKOS.js";
import {
  __async,
  catchError,
  computed,
  filter,
  firstValueFrom,
  inject,
  signal,
  throwError,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-ASFNRD7L.js";

// src/app/pages/not-found/not-found.component.ts
var NotFoundComponent = class _NotFoundComponent {
  static \u0275fac = function NotFoundComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotFoundComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NotFoundComponent, selectors: [["app-not-found"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 5, vars: 0, consts: [[1, "text-center", "text-muted"], [1, "display-4"]], template: function NotFoundComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "404");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p");
      \u0275\u0275text(4, "Seite nicht gefunden.");
      \u0275\u0275elementEnd()();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NotFoundComponent, { className: "NotFoundComponent" });
})();

// src/app/pages/unauthorized/unauthorized.component.ts
var UnauthorizedComponent = class _UnauthorizedComponent {
  static \u0275fac = function UnauthorizedComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UnauthorizedComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UnauthorizedComponent, selectors: [["app-unauthorized"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 5, vars: 0, consts: [[1, "text-center", "text-muted"], [1, "h3"]], template: function UnauthorizedComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "401");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p");
      \u0275\u0275text(4, "Nicht berechtigt.");
      \u0275\u0275elementEnd()();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UnauthorizedComponent, { className: "UnauthorizedComponent" });
})();

// src/app/pages/error/error.component.ts
var ErrorComponent = class _ErrorComponent {
  static \u0275fac = function ErrorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ErrorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ErrorComponent, selectors: [["app-error"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 5, vars: 0, consts: [[1, "text-center", "text-muted"], [1, "h3"]], template: function ErrorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Fehler");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p");
      \u0275\u0275text(4, "Es ist ein unerwarteter Fehler aufgetreten.");
      \u0275\u0275elementEnd()();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ErrorComponent, { className: "ErrorComponent" });
})();

// src/app/app.routes.ts
var routes = [
  { path: "", pathMatch: "full", redirectTo: "account" },
  { path: "account", loadChildren: () => import("./chunk-DLVK5QIE.js").then((m) => m.ACCOUNT_ROUTES) },
  { path: "market", loadChildren: () => import("./chunk-2SASQIRC.js").then((m) => m.MARKET_ROUTES) },
  { path: "trade", loadChildren: () => import("./chunk-BCDJ2HOC.js").then((m) => m.TRADE_ROUTES) },
  { path: "portfolio", loadChildren: () => import("./chunk-UALTYOBA.js").then((m) => m.PORTFOLIO_ROUTES) },
  { path: "wallet", loadChildren: () => import("./chunk-UURFRYWC.js").then((m) => m.WALLET_ROUTES) },
  { path: "settings", loadChildren: () => import("./chunk-5FXY52XG.js").then((m) => m.SETTINGS_ROUTES) },
  { path: "admin", loadChildren: () => import("./chunk-RMTEO5S6.js").then((m) => m.ADMIN_ROUTES) },
  { path: "unauthorized", component: UnauthorizedComponent, title: "Unauthorized" },
  { path: "error", component: ErrorComponent, title: "Error" },
  { path: "**", component: NotFoundComponent, title: "Not Found" }
];

// src/app/core/auth/jwt-interceptor.ts
var jwtInterceptor = (req, next) => {
  const tokens = inject(TokenStorageService);
  const url = new URL(req.url, document.baseURI);
  const isBackendRequest = (
    // Local development
    url.hostname === "localhost" && (url.port === "8080" || url.pathname.startsWith("/api") || url.pathname.startsWith("/graphql")) || // Heroku BFF Backend
    url.hostname === "rocky-atoll-88358-b10b362cee67.herokuapp.com" || // Heroku GraphQL Backend
    url.hostname === "mysterious-gorge-04164-edc5a9f39d38.herokuapp.com" || // General API paths
    (url.pathname.startsWith("/api") || url.pathname.startsWith("/graphql"))
  );
  const token = tokens.get();
  const validToken = token && !tokens.isExpired(token);
  const isAuthRequest = url.pathname.startsWith("/auth");
  if (isBackendRequest && validToken && !req.headers.has("Authorization") && !isAuthRequest) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }
  return next(req);
};

// src/app/core/http/error.interceptor.ts
var errorInterceptor = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(catchError((err) => {
    if (err instanceof HttpErrorResponse) {
      const status = err.status;
      if (status === 401) {
        const isAuthRequest = req.url.includes("/auth/login") || req.url.includes("/auth/register");
        if (!isAuthRequest) {
          console.warn("[HTTP] 401 Unauthorized \u2192 redirect to /account");
          router.navigateByUrl("/account");
        } else {
          console.warn("[HTTP] 401 Unauthorized on auth request \u2192 handled by component");
        }
      } else if (status === 403) {
        console.warn("[HTTP] 403 Forbidden \u2192 redirect to /unauthorized");
        router.navigateByUrl("/unauthorized");
      } else if (status === 0) {
        console.error("[HTTP] Netzwerkfehler (status 0). URL:", req.url);
        console.error("[HTTP] Error details:", err.message);
      } else if (status >= 500) {
        console.error(`[HTTP] Serverfehler ${status}.`, err);
      } else {
        console.warn(`[HTTP] Fehler ${status}.`, err);
      }
    } else {
      console.error("[HTTP] Unbekannter Fehler:", err);
    }
    return throwError(() => err);
  }));
};

// src/app/features/market/data-access/http-market-data.adapter.ts
var HttpMarketDataAdapter = class _HttpMarketDataAdapter {
  http = inject(HttpClient);
  // Always use the Heroku API URL directly
  baseUrl = `${environment.apiBaseUrl}/api/price`;
  constructor() {
    console.log("[HttpMarketDataAdapter] Initialized with baseUrl:", this.baseUrl);
  }
  /**
   * Fetch all tradable symbols from the backend
   */
  fetchSymbols() {
    return __async(this, null, function* () {
      try {
        console.log("[HttpMarketDataAdapter] Fetching symbols from:", `${this.baseUrl}/symbols`);
        const response = yield firstValueFrom(this.http.get(`${this.baseUrl}/symbols`));
        console.log("[HttpMarketDataAdapter] Symbols received:", response);
        return response.map((dto) => this.mapSymbol(dto));
      } catch (error) {
        console.error("[HttpMarketDataAdapter] fetchSymbols failed:", error);
        throw error;
      }
    });
  }
  /**
   * Fetch current price for a specific symbol from the backend
   */
  fetchPrice(symbol) {
    return __async(this, null, function* () {
      try {
        console.log("[HttpMarketDataAdapter] Fetching price for:", symbol, "from:", `${this.baseUrl}/quote/${symbol}`);
        const response = yield firstValueFrom(this.http.get(`${this.baseUrl}/quote/${symbol}`));
        console.log("[HttpMarketDataAdapter] \u26A0\uFE0F RAW RESPONSE for", symbol, ":", response);
        console.log("[HttpMarketDataAdapter] Available fields:", Object.keys(response));
        console.log("[HttpMarketDataAdapter] changePct:", response.changePct);
        console.log("[HttpMarketDataAdapter] change1mPct:", response.change1mPct);
        console.log("[HttpMarketDataAdapter] Full response object:", JSON.stringify(response, null, 2));
        return this.mapPrice(response);
      } catch (error) {
        console.error("[HttpMarketDataAdapter] fetchPrice failed for", symbol, ":", error);
        throw error;
      }
    });
  }
  /**
   * Map backend DTO to domain model
   */
  mapSymbol(dto) {
    return {
      name: dto.name,
      symbol: dto.symbol
    };
  }
  /**
   * Map backend price DTO to domain model
   */
  mapPrice(dto) {
    const changePct = dto.changePct ?? dto.change1mPct ?? dto.priceChange ?? dto.percentChange ?? dto.change ?? void 0;
    console.log("[HttpMarketDataAdapter] mapPrice() - dto object:", dto);
    console.log("[HttpMarketDataAdapter] mapPrice() - dto.changePct:", dto.changePct);
    console.log("[HttpMarketDataAdapter] mapPrice() - dto.change1mPct:", dto.change1mPct);
    console.log("[HttpMarketDataAdapter] mapPrice() - dto.priceChange:", dto.priceChange);
    console.log("[HttpMarketDataAdapter] mapPrice() - dto.percentChange:", dto.percentChange);
    console.log("[HttpMarketDataAdapter] mapPrice() - dto.change:", dto.change);
    console.log("[HttpMarketDataAdapter] mapPrice() - resolved changePct:", changePct);
    console.log("[HttpMarketDataAdapter] mapPrice() - typeof changePct:", typeof changePct);
    const result = {
      name: dto.name,
      symbol: dto.symbol,
      price: dto.price,
      updatedAt: dto.updatedAt,
      updatedAtReadable: dto.updatedAtReadable || this.getReadableTimestamp(dto.updatedAt),
      changePct
    };
    console.log("[HttpMarketDataAdapter] mapPrice() - result:", result);
    return result;
  }
  /**
   * Generate human-readable timestamp if not provided by backend
   */
  getReadableTimestamp(isoString) {
    try {
      const date = new Date(isoString);
      const secondsAgo = Math.floor((Date.now() - date.getTime()) / 1e3);
      if (secondsAgo < 10)
        return "gerade eben";
      if (secondsAgo < 60)
        return `vor ${secondsAgo} Sekunden`;
      const minutesAgo = Math.floor(secondsAgo / 60);
      if (minutesAgo < 60)
        return `vor ${minutesAgo} Minute${minutesAgo > 1 ? "n" : ""}`;
      const hoursAgo = Math.floor(minutesAgo / 60);
      if (hoursAgo < 24)
        return `vor ${hoursAgo} Stunde${hoursAgo > 1 ? "n" : ""}`;
      const daysAgo = Math.floor(hoursAgo / 24);
      return `vor ${daysAgo} Tag${daysAgo > 1 ? "en" : ""}`;
    } catch (error) {
      console.warn("[HttpMarketDataAdapter] Failed to parse timestamp:", isoString, error);
      return "k\xFCrzlich";
    }
  }
  static \u0275fac = function HttpMarketDataAdapter_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HttpMarketDataAdapter)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HttpMarketDataAdapter, factory: _HttpMarketDataAdapter.\u0275fac });
};

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor, errorInterceptor])),
    // Market data adapter - using real HTTP API
    { provide: MARKET_DATA_PORT, useClass: HttpMarketDataAdapter }
  ]
};

// src/app/app.component.ts
var AppComponent = class _AppComponent {
  auth = inject(AuthService);
  router = inject(Router);
  isAuth = computed(() => this.auth.isAuthenticated());
  isAdmin = computed(() => this.auth.hasRole("ADMIN"));
  email = computed(() => this.auth.user()?.email ?? "");
  // Signal to track if we're on an auth route
  isAuthRoute = signal(false);
  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.isAuthRoute.set(event.url.includes("/account"));
    });
    this.isAuthRoute.set(this.router.url.includes("/account"));
  }
  logout() {
    this.auth.signOut();
  }
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 3, vars: 4, consts: [[1, "app-shell"], [1, "app-content"]], template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "main", 1);
      \u0275\u0275element(2, "router-outlet");
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("app-shell--fullscreen", ctx.isAuthRoute());
      \u0275\u0275advance();
      \u0275\u0275classProp("container", !ctx.isAuthRoute());
    }
  }, dependencies: [CommonModule, RouterOutlet], styles: ['\n\n.app-shell[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n  margin: 0;\n  padding: 0;\n  background: #f8f9fa;\n}\n.app-shell--fullscreen[_ngcontent-%COMP%] {\n  overflow: hidden;\n}\n.app-shell--fullscreen[_ngcontent-%COMP%]   .app-content[_ngcontent-%COMP%] {\n  padding: 0 !important;\n  margin: 0 !important;\n  max-width: 100% !important;\n  width: 100vw !important;\n}\n.app-content[_ngcontent-%COMP%] {\n  flex: 1;\n  background: #fff;\n}\n.navbar[_ngcontent-%COMP%] {\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);\n}\n.navbar[_ngcontent-%COMP%]   .navbar-brand[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  color: #333;\n}\n.navbar[_ngcontent-%COMP%]   .navbar-brand[_ngcontent-%COMP%]:hover {\n  color: #667eea;\n}\n.navbar[_ngcontent-%COMP%]   .nav-link[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: #666;\n  transition: color 0.2s;\n  padding: 0.5rem 1rem;\n}\n.navbar[_ngcontent-%COMP%]   .nav-link[_ngcontent-%COMP%]:hover {\n  color: #667eea;\n}\n.navbar[_ngcontent-%COMP%]   .nav-link.active[_ngcontent-%COMP%] {\n  color: #667eea;\n  font-weight: 600;\n  position: relative;\n}\n.navbar[_ngcontent-%COMP%]   .nav-link.active[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  bottom: -1px;\n  left: 1rem;\n  right: 1rem;\n  height: 2px;\n  background: #667eea;\n}\n.app-footer[_ngcontent-%COMP%] {\n  background: #f8f9fa;\n  border-top: 1px solid #e0e0e0;\n  margin-top: 3rem;\n}\n/*# sourceMappingURL=app.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent" });
})();

// src/main.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
