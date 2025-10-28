import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-page',
  imports: [RouterLink, RouterOutlet],
  template: `
    <h1 class="h4">Admin</h1>
    <nav class="nav mb-3">
      <a class="nav-link" routerLink="users">Users</a>
      <a class="nav-link" routerLink="balances">Balances</a>
      <a class="nav-link" routerLink="audit">Audit</a>
      <a class="nav-link" routerLink="system-status">System Status</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AdminPageComponent {}
