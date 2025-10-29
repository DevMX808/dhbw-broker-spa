import {
  TokenStorageService
} from "./chunk-DFJEWIOY.js";
import {
  Router,
  RouterLink,
  RouterOutlet
} from "./chunk-ZKLCJJRR.js";
import {
  inject,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-T4LT6FP2.js";

// src/app/features/admin/containers/admin-page.component.ts
var AdminPageComponent = class _AdminPageComponent {
  static \u0275fac = function AdminPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminPageComponent, selectors: [["app-admin-page"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 12, vars: 0, consts: [[1, "h4"], [1, "nav", "mb-3"], ["routerLink", "users", 1, "nav-link"], ["routerLink", "balances", 1, "nav-link"], ["routerLink", "audit", 1, "nav-link"], ["routerLink", "system-status", 1, "nav-link"]], template: function AdminPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1", 0);
      \u0275\u0275text(1, "Admin");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "nav", 1)(3, "a", 2);
      \u0275\u0275text(4, "Users");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "a", 3);
      \u0275\u0275text(6, "Balances");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "a", 4);
      \u0275\u0275text(8, "Audit");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "a", 5);
      \u0275\u0275text(10, "System Status");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(11, "router-outlet");
    }
  }, dependencies: [RouterLink, RouterOutlet], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminPageComponent, { className: "AdminPageComponent" });
})();

// src/app/core/auth/role.guard.ts
var RoleGuard = (route) => {
  const tokens = inject(TokenStorageService);
  const router = inject(Router);
  const token = tokens.get();
  if (!token || tokens.isExpired(token)) {
    router.navigateByUrl("/account");
    return false;
  }
  const payload = tokens.parsePayload(token);
  const expected = route.data?.["roles"] || [];
  const ok = expected.length === 0 || expected.some((r) => payload?.roles?.includes(r));
  if (!ok) {
    router.navigateByUrl("/unauthorized");
    return false;
  }
  return true;
};

// src/app/features/admin/routes.ts
var ADMIN_ROUTES = [
  {
    path: "",
    component: AdminPageComponent,
    title: "Admin",
    canActivate: [RoleGuard],
    data: { roles: ["ADMIN"] },
    children: [
      { path: "", pathMatch: "full", redirectTo: "users" }
    ]
  }
];
export {
  ADMIN_ROUTES
};
//# sourceMappingURL=chunk-SVLTQWP3.js.map
