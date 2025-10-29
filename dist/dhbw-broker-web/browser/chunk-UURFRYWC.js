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

// src/app/features/wallet/containers/wallet-page.component.ts
var WalletPageComponent = class _WalletPageComponent {
  static \u0275fac = function WalletPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WalletPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _WalletPageComponent, selectors: [["app-wallet-page"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 4, vars: 0, consts: [[1, "h4"], [1, "text-muted"]], template: function WalletPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1", 0);
      \u0275\u0275text(1, "Wallet");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "p", 1);
      \u0275\u0275text(3, "\u2014");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(WalletPageComponent, { className: "WalletPageComponent" });
})();

// src/app/features/wallet/routes.ts
var WALLET_ROUTES = [
  { path: "", component: WalletPageComponent, title: "Wallet", canActivate: [authGuard] }
];
export {
  WALLET_ROUTES
};
//# sourceMappingURL=chunk-UURFRYWC.js.map
