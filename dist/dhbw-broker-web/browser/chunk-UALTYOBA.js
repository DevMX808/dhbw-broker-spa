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

// src/app/features/portfolio/containers/portfolio-page.component.ts
var PortfolioPageComponent = class _PortfolioPageComponent {
  static \u0275fac = function PortfolioPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PortfolioPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PortfolioPageComponent, selectors: [["app-portfolio-page"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 4, vars: 0, consts: [[1, "h4"], [1, "text-muted"]], template: function PortfolioPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1", 0);
      \u0275\u0275text(1, "Portfolio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "p", 1);
      \u0275\u0275text(3, "\u2014");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PortfolioPageComponent, { className: "PortfolioPageComponent" });
})();

// src/app/features/portfolio/routes.ts
var PORTFOLIO_ROUTES = [
  { path: "", component: PortfolioPageComponent, title: "Portfolio", canActivate: [authGuard] }
];
export {
  PORTFOLIO_ROUTES
};
//# sourceMappingURL=chunk-UALTYOBA.js.map
