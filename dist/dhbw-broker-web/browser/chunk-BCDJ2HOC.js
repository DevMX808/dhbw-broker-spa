import {
  authGuard
} from "./chunk-MV2NKJQE.js";
import "./chunk-JSOLXCOT.js";
import "./chunk-OW27TKOS.js";
import {
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-ASFNRD7L.js";

// src/app/features/trade/containers/trade-page.component.ts
var TradePageComponent = class _TradePageComponent {
  static \u0275fac = function TradePageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TradePageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TradePageComponent, selectors: [["app-trade-page"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 4, vars: 0, consts: [[1, "h4"], [1, "text-muted"]], template: function TradePageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1", 0);
      \u0275\u0275text(1, "Trade");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "p", 1);
      \u0275\u0275text(3, "\u2014");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TradePageComponent, { className: "TradePageComponent" });
})();

// src/app/features/trade/routes.ts
var TRADE_ROUTES = [
  { path: "", component: TradePageComponent, title: "Trade", canActivate: [authGuard] }
];
export {
  TRADE_ROUTES
};
//# sourceMappingURL=chunk-BCDJ2HOC.js.map
