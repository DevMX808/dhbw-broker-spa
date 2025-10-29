import {
  AuthService
} from "./chunk-TR4LX764.js";
import {
  MARKET_DATA_PORT
} from "./chunk-JYMSJ6VK.js";
import {
  TokenStorageService
} from "./chunk-DFJEWIOY.js";
import {
  CommonModule,
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
} from "./chunk-ZKLCJJRR.js";
import {
  __async,
  __spreadProps,
  __spreadValues,
  catchError,
  computed,
  filter,
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
} from "./chunk-T4LT6FP2.js";

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
  { path: "account", loadChildren: () => import("./chunk-67O4KZ63.js").then((m) => m.ACCOUNT_ROUTES) },
  { path: "market", loadChildren: () => import("./chunk-IJKZASJZ.js").then((m) => m.MARKET_ROUTES) },
  { path: "trade", loadChildren: () => import("./chunk-6QA6LUSL.js").then((m) => m.TRADE_ROUTES) },
  { path: "portfolio", loadChildren: () => import("./chunk-FSHLRJLJ.js").then((m) => m.PORTFOLIO_ROUTES) },
  { path: "wallet", loadChildren: () => import("./chunk-OORE6IYQ.js").then((m) => m.WALLET_ROUTES) },
  { path: "settings", loadChildren: () => import("./chunk-NOONF274.js").then((m) => m.SETTINGS_ROUTES) },
  { path: "admin", loadChildren: () => import("./chunk-SVLTQWP3.js").then((m) => m.ADMIN_ROUTES) },
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

// src/app/features/market/data-access/mock-market-data.adapter.ts
var MockMarketDataAdapter = class _MockMarketDataAdapter {
  mockSymbols = [
    { name: "Silver", symbol: "XAG" },
    { name: "Gold", symbol: "XAU" },
    { name: "Bitcoin", symbol: "BTC" },
    { name: "Ethereum", symbol: "ETH" },
    { name: "Palladium", symbol: "XPD" },
    { name: "Copper", symbol: "HG" }
  ];
  mockPrices = {
    XAG: { name: "Silver", symbol: "XAG", price: 34.52 },
    XAU: { name: "Gold", symbol: "XAU", price: 3952.699951 },
    BTC: { name: "Bitcoin", symbol: "BTC", price: 67234.89 },
    ETH: { name: "Ethereum", symbol: "ETH", price: 2845.32 },
    XPD: { name: "Palladium", symbol: "XPD", price: 1087.45 },
    HG: { name: "Copper", symbol: "HG", price: 4.23 }
  };
  /**
   * Simulates network delay (configurable)
   */
  delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  /**
   * Fetch all tradable symbols
   */
  fetchSymbols() {
    return __async(this, null, function* () {
      yield this.delay(400);
      return [...this.mockSymbols];
    });
  }
  /**
   * Fetch current price for a specific symbol
   */
  fetchPrice(symbol) {
    return __async(this, null, function* () {
      yield this.delay(300);
      const mockData = this.mockPrices[symbol];
      if (!mockData) {
        throw new Error(`Symbol "${symbol}" not found`);
      }
      const now = /* @__PURE__ */ new Date();
      const updatedAt = now.toISOString();
      const updatedAtReadable = this.getReadableTimestamp(now);
      return __spreadProps(__spreadValues({}, mockData), {
        updatedAt,
        updatedAtReadable
      });
    });
  }
  /**
   * Helper to generate human-readable timestamp
   */
  getReadableTimestamp(date) {
    const secondsAgo = Math.floor((Date.now() - date.getTime()) / 1e3);
    if (secondsAgo < 10)
      return "a few seconds ago";
    if (secondsAgo < 60)
      return `${secondsAgo} seconds ago`;
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60)
      return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
  }
  static \u0275fac = function MockMarketDataAdapter_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MockMarketDataAdapter)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MockMarketDataAdapter, factory: _MockMarketDataAdapter.\u0275fac });
};

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor, errorInterceptor])),
    // Market data adapter (easily swappable)
    { provide: MARKET_DATA_PORT, useClass: MockMarketDataAdapter }
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
