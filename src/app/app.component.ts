import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { filter } from 'rxjs';
import { NavbarComponent } from './core/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly isAuth = computed(() => this.auth.isAuthenticated());
  readonly email = computed(() => this.auth.user()?.email ?? '');

  readonly isAuthRoute = signal(false);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAuthRoute.set(event.url.includes('/account'));
    });

    this.isAuthRoute.set(this.router.url.includes('/account'));
  }
}
