import {
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-ASFNRD7L.js";

// src/app/features/settings/containers/settings-page.component.ts
var SettingsPageComponent = class _SettingsPageComponent {
  static \u0275fac = function SettingsPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SettingsPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SettingsPageComponent, selectors: [["app-settings-page"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 4, vars: 0, consts: [[1, "h4"], [1, "text-muted"]], template: function SettingsPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1", 0);
      \u0275\u0275text(1, "Settings");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "p", 1);
      \u0275\u0275text(3, "\u2014");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SettingsPageComponent, { className: "SettingsPageComponent" });
})();

// src/app/features/settings/routes.ts
var SETTINGS_ROUTES = [
  { path: "", component: SettingsPageComponent, title: "Settings" }
];
export {
  SETTINGS_ROUTES
};
//# sourceMappingURL=chunk-5FXY52XG.js.map
