import { Component, inject, signal, computed } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  mobileMenuOpen = signal(false);

  currentUrl = signal(this.router.url);

  isLoggedOutOnAccount = computed(() => {
    const isOnAccount = this.currentUrl().startsWith('/account');
    return !this.authService.isAuthenticated() && isOnAccount;
  });

  isAdmin = computed(() => this.authService.hasRole('ADMIN'));

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl.set(event.urlAfterRedirects);
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  logout(): void {
    if (window.confirm('Sind Sie sicher, dass Sie sich abmelden möchten?')) {
      this.authService.signOut();
    }
  }
}
