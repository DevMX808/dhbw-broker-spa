import {
  MARKET_DATA_PORT
} from "./chunk-JYMSJ6VK.js";
import {
  ActivatedRoute,
  CommonModule,
  DatePipe,
  DecimalPipe,
  NgForOf,
  NgIf,
  Router,
  RouterLink
} from "./chunk-ZKLCJJRR.js";
import {
  EventEmitter,
  Subject,
  __async,
  __spreadProps,
  __spreadValues,
  computed,
  inject,
  signal,
  takeUntil,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassMapInterpolate1,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-T4LT6FP2.js";

// src/app/features/market/store/market.store.ts
var MarketStore = class _MarketStore {
  adapter = inject(MARKET_DATA_PORT);
  // State
  symbols = signal([]);
  pricesBySymbol = signal({});
  selectedSymbol = signal(null);
  // Loading states
  loading = signal({
    symbols: false,
    priceBySymbol: {}
  });
  error = signal(null);
  // Caching metadata
  lastFetched = {};
  // timestamp in ms
  pendingRequests = {};
  // deduplication map
  // Computed
  hasData = computed(() => this.symbols().length > 0);
  selectedPrice = computed(() => {
    const symbol = this.selectedSymbol();
    return symbol ? this.pricesBySymbol()[symbol] : null;
  });
  /**
   * Load all tradable symbols
   */
  loadSymbols() {
    return __async(this, null, function* () {
      if (this.loading().symbols)
        return;
      this.loading.update((state) => __spreadProps(__spreadValues({}, state), { symbols: true }));
      this.error.set(null);
      try {
        const symbols = yield this.adapter.fetchSymbols();
        this.symbols.set(symbols);
        this.error.set(null);
      } catch (err) {
        console.error("[MarketStore] loadSymbols failed", err);
        this.error.set("Symbols konnten nicht geladen werden.");
      } finally {
        this.loading.update((state) => __spreadProps(__spreadValues({}, state), { symbols: false }));
      }
    });
  }
  /**
   * Load price for a specific symbol
   * Implements deduplication and basic caching
   */
  loadPrice(symbol, forceRefresh = false) {
    return __async(this, null, function* () {
      if (this.loading().priceBySymbol[symbol] && !forceRefresh) {
        return;
      }
      if (!forceRefresh && this.isCached(symbol)) {
        return;
      }
      const pendingRequest = this.pendingRequests[symbol];
      if (pendingRequest && !forceRefresh) {
        yield pendingRequest;
        return;
      }
      this.loading.update((state) => __spreadProps(__spreadValues({}, state), {
        priceBySymbol: __spreadProps(__spreadValues({}, state.priceBySymbol), { [symbol]: true })
      }));
      const pricePromise = this.adapter.fetchPrice(symbol);
      this.pendingRequests[symbol] = pricePromise;
      try {
        const price = yield pricePromise;
        this.pricesBySymbol.update((prices) => __spreadProps(__spreadValues({}, prices), {
          [symbol]: price
        }));
        this.lastFetched[symbol] = Date.now();
      } catch (err) {
        console.error(`[MarketStore] loadPrice failed for ${symbol}`, err);
      } finally {
        this.loading.update((state) => __spreadProps(__spreadValues({}, state), {
          priceBySymbol: __spreadProps(__spreadValues({}, state.priceBySymbol), { [symbol]: false })
        }));
        this.pendingRequests[symbol] = void 0;
      }
    });
  }
  /**
   * Select a symbol and load its price
   */
  selectSymbol(symbol) {
    return __async(this, null, function* () {
      this.selectedSymbol.set(symbol);
      yield this.loadPrice(symbol);
    });
  }
  /**
   * Force refresh price for a symbol
   */
  refreshPrice(symbol) {
    return __async(this, null, function* () {
      yield this.loadPrice(symbol, true);
    });
  }
  /**
   * Prefetch prices for multiple symbols (useful for list view)
   */
  prefetchPrices(symbols) {
    return __async(this, null, function* () {
      const promises = symbols.map((symbol) => this.loadPrice(symbol));
      yield Promise.allSettled(promises);
    });
  }
  /**
   * Check if a price is cached and not stale (60s threshold)
   */
  isCached(symbol) {
    const STALE_THRESHOLD_MS = 6e4;
    const lastFetch = this.lastFetched[symbol];
    if (!lastFetch)
      return false;
    if (!this.pricesBySymbol()[symbol])
      return false;
    const age = Date.now() - lastFetch;
    return age < STALE_THRESHOLD_MS;
  }
  /**
   * Check if a symbol is currently loading
   */
  isLoadingPrice(symbol) {
    return this.loading().priceBySymbol[symbol] ?? false;
  }
  static \u0275fac = function MarketStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MarketStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MarketStore, factory: _MarketStore.\u0275fac, providedIn: "root" });
};

// src/app/features/market/components/market-card/market-card.component.ts
function MarketCardComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "div", 11);
    \u0275\u0275elementEnd();
  }
}
function MarketCardComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 13);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "number");
    \u0275\u0275elementStart(4, "span", 14);
    \u0275\u0275text(5, "USD");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(3, 1, ctx_r0.price.price, "1.2-2"), " ");
  }
}
function MarketCardComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function MarketCardComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275text(1, "\u2191");
    \u0275\u0275elementEnd();
  }
}
var MarketCardComponent = class _MarketCardComponent {
  symbol;
  price;
  loading = false;
  select = new EventEmitter();
  static \u0275fac = function MarketCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MarketCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MarketCardComponent, selectors: [["app-market-card"]], inputs: { symbol: "symbol", price: "price", loading: "loading" }, outputs: { select: "select" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 16, vars: 11, consts: [[1, "market-card"], [1, "header"], [1, "asset-name"], [1, "separator"], [1, "ticker"], [1, "price-section"], ["class", "skeleton-loader", 4, "ngIf"], ["class", "price-content", 4, "ngIf"], ["class", "no-price", 4, "ngIf"], ["class", "change-indicator", 4, "ngIf"], [1, "skeleton-loader"], [1, "skeleton-box", "skeleton-price"], [1, "price-content"], [1, "price-value"], [1, "price-currency"], [1, "no-price"], [1, "change-indicator"]], template: function MarketCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "span");
      \u0275\u0275text(4, "\u2666");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "span", 2);
      \u0275\u0275text(6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "span", 3);
      \u0275\u0275text(8, "|");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "span", 4);
      \u0275\u0275text(10);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 5);
      \u0275\u0275template(12, MarketCardComponent_div_12_Template, 2, 0, "div", 6)(13, MarketCardComponent_div_13_Template, 6, 4, "div", 7)(14, MarketCardComponent_div_14_Template, 2, 0, "div", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275template(15, MarketCardComponent_div_15_Template, 2, 0, "div", 9);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classProp("market-card--loading", ctx.loading);
      \u0275\u0275advance(2);
      \u0275\u0275classMapInterpolate1("symbol-icon icon-", ctx.symbol.symbol.toLowerCase(), "");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.symbol.name);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.symbol.symbol);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.price);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && !ctx.price);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.price);
    }
  }, dependencies: [CommonModule, NgIf, DecimalPipe], styles: ['\n\n[_nghost-%COMP%] {\n  display: block;\n  height: 100%;\n}\n.market-card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  min-height: 160px;\n  padding: 1.25rem 1rem;\n  background:\n    linear-gradient(\n      180deg,\n      #000000 0%,\n      #1a1a1a 50%,\n      #0d0d0d 100%);\n  border-radius: 0.75rem;\n  cursor: pointer;\n  transition: all 0.15s ease-out;\n  color: white;\n  font-family:\n    "Inter",\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    sans-serif;\n  position: relative;\n}\n.market-card[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);\n  transform: translateY(-2px);\n}\n.market-card--loading[_ngcontent-%COMP%] {\n  opacity: 0.85;\n}\n.header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  margin-bottom: 0.5rem;\n}\n.symbol-icon[_ngcontent-%COMP%] {\n  width: 1.5rem;\n  height: 1.5rem;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1rem;\n  flex-shrink: 0;\n  margin-right: 0.5rem;\n}\n.icon-xag[_ngcontent-%COMP%] {\n  background: #c0c0c0;\n  color: #1f2937;\n}\n.icon-xau[_ngcontent-%COMP%] {\n  background: #ffd700;\n  color: #1f2937;\n}\n.icon-btc[_ngcontent-%COMP%] {\n  background: #f7931a;\n  color: #1f2937;\n}\n.icon-eth[_ngcontent-%COMP%] {\n  background: #627eea;\n  color: white;\n}\n.icon-xpd[_ngcontent-%COMP%] {\n  background: #e5e4e2;\n  color: #1f2937;\n}\n.icon-hg[_ngcontent-%COMP%] {\n  background: #b87333;\n  color: white;\n}\n.asset-name[_ngcontent-%COMP%] {\n  font-size: 1.625rem;\n  font-weight: 600;\n  line-height: 1;\n  color: white;\n  margin-right: 0.25rem;\n}\n.separator[_ngcontent-%COMP%] {\n  font-size: 1.625rem;\n  font-weight: 400;\n  color: #9ca3af;\n  margin-right: 0.25rem;\n}\n.ticker[_ngcontent-%COMP%] {\n  font-size: 1.625rem;\n  font-weight: 300;\n  line-height: 1;\n  color: #9ca3af;\n}\n.price-section[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  margin-top: auto;\n}\n.price-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.price-value[_ngcontent-%COMP%] {\n  font-size: 1.625rem;\n  font-weight: 500;\n  line-height: 1;\n  color: white;\n}\n.price-currency[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 300;\n  color: #9ca3af;\n  margin-left: 0.25rem;\n}\n.no-price[_ngcontent-%COMP%] {\n  font-size: 1.625rem;\n  color: #6b7280;\n  font-weight: 500;\n}\n.change-indicator[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 1rem;\n  right: 1rem;\n  font-size: 1.5rem;\n  color: #22c55e;\n}\n.skeleton-loader[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.skeleton-box[_ngcontent-%COMP%] {\n  background: #1f2937;\n  border-radius: 0.25rem;\n  animation: _ngcontent-%COMP%_pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n}\n.skeleton-price[_ngcontent-%COMP%] {\n  height: 2rem;\n  width: 45%;\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.5;\n  }\n}\n/*# sourceMappingURL=market-card.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MarketCardComponent, { className: "MarketCardComponent" });
})();

// src/app/features/market/components/market-list/market-list.component.ts
var _c0 = (a0) => ["/market", a0];
function MarketListComponent_div_0_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "div", 6)(2, "div", 7);
    \u0275\u0275element(3, "div", 8)(4, "div", 9)(5, "div", 10);
    \u0275\u0275elementEnd()()();
  }
}
function MarketListComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275template(1, MarketListComponent_div_0_div_1_Template, 6, 0, "div", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.skeletonArray);
  }
}
function MarketListComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "div")(2, "strong");
    \u0275\u0275text(3, "\u26A0\uFE0F Fehler:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 12);
    \u0275\u0275listener("click", function MarketListComponent_div_1_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onRetry());
    });
    \u0275\u0275text(6, " Erneut versuchen ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, " ");
  }
}
function MarketListComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 14);
    \u0275\u0275text(2, "\u{1F4CA}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4, "Keine Symbole verf\xFCgbar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 15);
    \u0275\u0275text(6, "Derzeit sind keine handelbaren Symbole verf\xFCgbar.");
    \u0275\u0275elementEnd()();
  }
}
function MarketListComponent_div_3_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "a", 16);
    \u0275\u0275element(2, "app-market-card", 17);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const symbol_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(4, _c0, symbol_r3.symbol));
    \u0275\u0275advance();
    \u0275\u0275property("symbol", symbol_r3)("price", ctx_r0.pricesBySymbol[symbol_r3.symbol])("loading", ctx_r0.isLoadingPrice(symbol_r3.symbol));
  }
}
function MarketListComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275template(1, MarketListComponent_div_3_div_1_Template, 3, 6, "div", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.symbols);
  }
}
var MarketListComponent = class _MarketListComponent {
  symbols = [];
  pricesBySymbol = {};
  loading = false;
  error = null;
  loadingPrices = {};
  selectSymbol = new EventEmitter();
  retry = new EventEmitter();
  skeletonArray = Array(6).fill(0);
  isLoadingPrice(symbol) {
    return this.loadingPrices[symbol] ?? false;
  }
  onRetry() {
    this.retry.emit();
  }
  static \u0275fac = function MarketListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MarketListComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MarketListComponent, selectors: [["app-market-list"]], inputs: { symbols: "symbols", pricesBySymbol: "pricesBySymbol", loading: "loading", error: "error", loadingPrices: "loadingPrices" }, outputs: { selectSymbol: "selectSymbol", retry: "retry" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 4, vars: 4, consts: [["class", "market-grid", 4, "ngIf"], ["class", "alert alert-danger d-flex align-items-center justify-content-between", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], [1, "market-grid"], ["class", "market-grid-item", 4, "ngFor", "ngForOf"], [1, "market-grid-item"], [1, "card", "h-100"], [1, "card-body"], [1, "skeleton-box", "mb-2", 2, "height", "24px", "width", "70%"], [1, "skeleton-box", "mb-3", 2, "height", "16px", "width", "40%"], [1, "skeleton-box", 2, "height", "32px", "width", "50%"], [1, "alert", "alert-danger", "d-flex", "align-items-center", "justify-content-between"], [1, "btn", "btn-outline-danger", "btn-sm", 3, "click"], [1, "empty-state"], [1, "empty-icon"], [1, "text-muted"], [1, "card-link", 3, "routerLink"], [3, "symbol", "price", "loading"]], template: function MarketListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, MarketListComponent_div_0_Template, 2, 1, "div", 0)(1, MarketListComponent_div_1_Template, 7, 1, "div", 1)(2, MarketListComponent_div_2_Template, 7, 0, "div", 2)(3, MarketListComponent_div_3_Template, 2, 1, "div", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && !ctx.error && ctx.symbols.length === 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && !ctx.error && ctx.symbols.length > 0);
    }
  }, dependencies: [CommonModule, NgForOf, NgIf, RouterLink, MarketCardComponent], styles: ["\n\n.market-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n  gap: 1.5rem;\n  margin: 1.5rem 0;\n}\n.market-grid-item[_ngcontent-%COMP%] {\n  min-height: 160px;\n}\n.card-link[_ngcontent-%COMP%] {\n  text-decoration: none;\n  color: inherit;\n  display: block;\n  height: 100%;\n}\n.card-link[_ngcontent-%COMP%]:hover {\n  text-decoration: none;\n}\n.skeleton-box[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #f0f0f0 25%,\n      #e0e0e0 50%,\n      #f0f0f0 75%);\n  background-size: 200% 100%;\n  animation: _ngcontent-%COMP%_loading 1.5s infinite;\n  border-radius: 4px;\n}\n@keyframes _ngcontent-%COMP%_loading {\n  0% {\n    background-position: 200% 0;\n  }\n  100% {\n    background-position: -200% 0;\n  }\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 4rem 2rem;\n}\n.empty-icon[_ngcontent-%COMP%] {\n  font-size: 4rem;\n  margin-bottom: 1rem;\n  opacity: 0.5;\n}\n.empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 600;\n  margin-bottom: 0.5rem;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  margin-bottom: 0;\n}\n@media (max-width: 768px) {\n  .market-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));\n    gap: 1rem;\n  }\n}\n@media (max-width: 576px) {\n  .market-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=market-list.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MarketListComponent, { className: "MarketListComponent" });
})();

// src/app/features/market/containers/market-page.component.ts
var MarketPageComponent = class _MarketPageComponent {
  store = inject(MarketStore);
  ngOnInit() {
    return __async(this, null, function* () {
      if (!this.store.hasData()) {
        yield this.store.loadSymbols();
        const symbolsToPreload = this.store.symbols().slice(0, 6).map((s) => s.symbol);
        if (symbolsToPreload.length > 0) {
          this.store.prefetchPrices(symbolsToPreload);
        }
      }
    });
  }
  onRetry() {
    this.store.loadSymbols();
  }
  static \u0275fac = function MarketPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MarketPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MarketPageComponent, selectors: [["app-market-page"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 7, vars: 5, consts: [[1, "market-page"], [1, "page-header", "mb-4"], [1, "page-title"], [1, "page-subtitle", "text-muted"], [3, "retry", "symbols", "pricesBySymbol", "loading", "error", "loadingPrices"]], template: function MarketPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3, "Markt");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, " Handelbare Symbole und aktuelle Preise ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "app-market-list", 4);
      \u0275\u0275listener("retry", function MarketPageComponent_Template_app_market_list_retry_6_listener() {
        return ctx.onRetry();
      });
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("symbols", ctx.store.symbols())("pricesBySymbol", ctx.store.pricesBySymbol())("loading", ctx.store.loading().symbols)("error", ctx.store.error())("loadingPrices", ctx.store.loading().priceBySymbol);
    }
  }, dependencies: [CommonModule, MarketListComponent], styles: ["\n\n.market-page[_ngcontent-%COMP%] {\n  max-width: 1400px;\n  margin: 0 auto;\n  padding: 2rem 1rem;\n}\n.page-header[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.page-title[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: 700;\n  margin-bottom: 0.5rem;\n  color: #333;\n}\n.page-subtitle[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  margin-bottom: 0;\n}\n@media (max-width: 768px) {\n  .market-page[_ngcontent-%COMP%] {\n    padding: 1.5rem 1rem;\n  }\n  .page-title[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n}\n/*# sourceMappingURL=market-page.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MarketPageComponent, { className: "MarketPageComponent" });
})();

// src/app/features/market/components/quote-card/quote-card.component.ts
function PriceCardComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 3);
    \u0275\u0275element(2, "div", 4)(3, "div", 5)(4, "div", 6);
    \u0275\u0275elementEnd()();
  }
}
function PriceCardComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 3)(2, "div", 8)(3, "span", 9);
    \u0275\u0275text(4, "\u26A0\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h5", 10);
    \u0275\u0275text(6, "Fehler");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "p", 11);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 12);
    \u0275\u0275listener("click", function PriceCardComponent_div_1_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onRefresh());
    });
    \u0275\u0275text(10, " Erneut versuchen ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.error);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.loading);
  }
}
function PriceCardComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 3)(2, "div", 13)(3, "div")(4, "h2", 14);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 15);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "button", 16);
    \u0275\u0275listener("click", function PriceCardComponent_div_2_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onRefresh());
    });
    \u0275\u0275text(9, " \u{1F504} Aktualisieren ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 17)(11, "span", 18);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 19);
    \u0275\u0275text(15, "USD");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 20)(17, "span", 21)(18, "strong");
    \u0275\u0275text(19, "Aktualisiert:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 22);
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "date");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.price.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.price.symbol, " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.loading);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(13, 6, ctx_r1.price.price, "1.2-4"));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", ctx_r1.price.updatedAtReadable, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" (", \u0275\u0275pipeBind2(23, 9, ctx_r1.price.updatedAt, "medium"), ") ");
  }
}
function PriceCardComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 23)(2, "div", 24);
    \u0275\u0275text(3, "\u{1F4CA}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 25);
    \u0275\u0275text(5, "Keine Preisdaten verf\xFCgbar.");
    \u0275\u0275elementEnd()()();
  }
}
var PriceCardComponent = class _PriceCardComponent {
  price = null;
  loading = false;
  error = null;
  refresh = new EventEmitter();
  onRefresh() {
    this.refresh.emit();
  }
  static \u0275fac = function PriceCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PriceCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PriceCardComponent, selectors: [["app-price-card"]], inputs: { price: "price", loading: "loading", error: "error" }, outputs: { refresh: "refresh" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 4, vars: 4, consts: [["class", "card", 4, "ngIf"], ["class", "card border-danger", 4, "ngIf"], [1, "card"], [1, "card-body"], [1, "skeleton-box", "mb-2", 2, "height", "32px", "width", "60%"], [1, "skeleton-box", "mb-3", 2, "height", "48px", "width", "40%"], [1, "skeleton-box", 2, "height", "20px", "width", "30%"], [1, "card", "border-danger"], [1, "d-flex", "align-items-center", "mb-3"], [1, "text-danger", "mr-2"], [1, "mb-0", "text-danger"], [1, "mb-3"], [1, "btn", "btn-outline-danger", "btn-sm", 3, "click", "disabled"], [1, "d-flex", "justify-content-between", "align-items-start", "mb-3"], [1, "h4", "mb-1"], [1, "text-muted", "text-uppercase", "font-weight-bold", 2, "letter-spacing", "0.05em"], ["title", "Aktualisieren", 1, "btn", "btn-outline-primary", "btn-sm", 3, "click", "disabled"], [1, "price-display", "mb-3"], [1, "price-value"], [1, "price-currency", "ml-2", "text-muted"], [1, "text-muted", "small"], [1, "mr-3"], [1, "text-muted", 2, "font-size", "0.85em"], [1, "card-body", "text-center", "py-5"], [1, "text-muted", "mb-3", 2, "font-size", "3rem"], [1, "text-muted", "mb-0"]], template: function PriceCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, PriceCardComponent_div_0_Template, 5, 0, "div", 0)(1, PriceCardComponent_div_1_Template, 11, 2, "div", 1)(2, PriceCardComponent_div_2_Template, 24, 12, "div", 0)(3, PriceCardComponent_div_3_Template, 6, 0, "div", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && !ctx.error && ctx.price);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && !ctx.error && !ctx.price);
    }
  }, dependencies: [CommonModule, NgIf, DecimalPipe, DatePipe], styles: ['\n\n.skeleton-box[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #f0f0f0 25%,\n      #e0e0e0 50%,\n      #f0f0f0 75%);\n  background-size: 200% 100%;\n  animation: _ngcontent-%COMP%_loading 1.5s infinite;\n  border-radius: 4px;\n}\n@keyframes _ngcontent-%COMP%_loading {\n  0% {\n    background-position: 200% 0;\n  }\n  100% {\n    background-position: -200% 0;\n  }\n}\n.price-display[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  font-weight: 300;\n  line-height: 1.2;\n}\n.price-value[_ngcontent-%COMP%] {\n  font-family: "Courier New", monospace;\n}\n.price-currency[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  vertical-align: baseline;\n}\n.card[_ngcontent-%COMP%] {\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  border: none;\n}\n@media (max-width: 576px) {\n  .price-display[_ngcontent-%COMP%] {\n    font-size: 2rem;\n  }\n  .price-currency[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n}\n/*# sourceMappingURL=quote-card.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PriceCardComponent, { className: "PriceCardComponent" });
})();

// src/app/features/market/containers/asset-detail-page.component.ts
var AssetDetailPageComponent = class _AssetDetailPageComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  store = inject(MarketStore);
  destroy$ = new Subject();
  // Computed values from store
  currentSymbol = computed(() => this.store.selectedSymbol());
  currentPrice = computed(() => this.store.selectedPrice());
  isLoading = computed(() => {
    const symbol = this.currentSymbol();
    return symbol ? this.store.isLoadingPrice(symbol) : false;
  });
  // Local error state for price loading
  priceError = computed(() => {
    const symbol = this.currentSymbol();
    const price = this.currentPrice();
    const loading = this.isLoading();
    if (!loading && symbol && !price) {
      return `Preis f\xFCr ${symbol} konnte nicht geladen werden.`;
    }
    return null;
  });
  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const symbol = params.get("symbol");
      if (symbol) {
        const upperSymbol = symbol.toUpperCase();
        this.loadSymbolData(upperSymbol);
      } else {
        this.router.navigate(["/market"]);
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadSymbolData(symbol) {
    return __async(this, null, function* () {
      if (!this.store.hasData()) {
        yield this.store.loadSymbols();
      }
      const symbolExists = this.store.symbols().some((s) => s.symbol === symbol);
      if (!symbolExists) {
        console.warn(`Symbol ${symbol} not found in available symbols`);
      }
      yield this.store.selectSymbol(symbol);
    });
  }
  onRefresh() {
    return __async(this, null, function* () {
      const symbol = this.currentSymbol();
      if (symbol) {
        yield this.store.refreshPrice(symbol);
      }
    });
  }
  static \u0275fac = function AssetDetailPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AssetDetailPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AssetDetailPageComponent, selectors: [["app-asset-detail-page"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 14, vars: 4, consts: [[1, "asset-detail-page"], [1, "mb-3"], ["routerLink", "/market", 1, "back-link"], [1, "page-header", "mb-4"], [1, "page-title"], [3, "refresh", "price", "loading", "error"], [1, "info-box", "mt-4"], [1, "text-muted", "small", "mb-0"]], template: function AssetDetailPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "a", 2);
      \u0275\u0275text(3, " \u2190 Zur\xFCck zur \xDCbersicht ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "div", 3)(5, "h1", 4);
      \u0275\u0275text(6);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "app-price-card", 5);
      \u0275\u0275listener("refresh", function AssetDetailPageComponent_Template_app_price_card_refresh_7_listener() {
        return ctx.onRefresh();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 6)(9, "p", 7);
      \u0275\u0275text(10, " \u{1F4A1} ");
      \u0275\u0275elementStart(11, "strong");
      \u0275\u0275text(12, "Tipp:");
      \u0275\u0275elementEnd();
      \u0275\u0275text(13, ' Klicken Sie auf "Aktualisieren", um die neuesten Preisdaten zu laden. ');
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1(" ", ctx.currentSymbol() || "Asset Details", " ");
      \u0275\u0275advance();
      \u0275\u0275property("price", ctx.currentPrice())("loading", ctx.isLoading())("error", ctx.priceError());
    }
  }, dependencies: [CommonModule, RouterLink, PriceCardComponent], styles: ["\n\n.asset-detail-page[_ngcontent-%COMP%] {\n  max-width: 900px;\n  margin: 0 auto;\n  padding: 2rem 1rem;\n}\n.back-link[_ngcontent-%COMP%] {\n  color: #667eea;\n  text-decoration: none;\n  font-weight: 500;\n  transition: color 0.2s;\n}\n.back-link[_ngcontent-%COMP%]:hover {\n  color: #764ba2;\n  text-decoration: underline;\n}\n.page-header[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.page-title[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: 700;\n  margin-bottom: 0;\n  color: #333;\n}\n.info-box[_ngcontent-%COMP%] {\n  background: #f8f9fa;\n  border-left: 4px solid #667eea;\n  padding: 1rem 1.5rem;\n  border-radius: 4px;\n}\n@media (max-width: 768px) {\n  .asset-detail-page[_ngcontent-%COMP%] {\n    padding: 1.5rem 1rem;\n  }\n  .page-title[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n}\n/*# sourceMappingURL=asset-detail-page.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AssetDetailPageComponent, { className: "AssetDetailPageComponent" });
})();

// src/app/features/market/routes.ts
var MARKET_ROUTES = [
  { path: "", component: MarketPageComponent, title: "Market" },
  { path: ":symbol", component: AssetDetailPageComponent, title: "Asset" }
];
export {
  MARKET_ROUTES
};
//# sourceMappingURL=chunk-IJKZASJZ.js.map
