import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly isAuth = computed(() => this.auth.isAuthenticated());
  readonly isAdmin = computed(() => this.auth.hasRole('ADMIN'));
  readonly email = computed(() => this.auth.user()?.email ?? '');

  // Signal to track if we're on an auth route
  readonly isAuthRoute = signal(false);

  constructor() {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAuthRoute.set(event.url.includes('/account'));
    });

    // Set initial state
    this.isAuthRoute.set(this.router.url.includes('/account'));
  }

  logout() { this.auth.signOut(); }
}
