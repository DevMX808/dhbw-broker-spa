import { Component, inject, signal } from '@angular/core';  // signal für mobileMenuOpen
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

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

  mobileMenuOpen = signal(false);  // Neu: Für Burger-Menu Toggle

  get isLoggedOutOnAccount(): boolean {
    const isOnAccount = this.router.url.startsWith('/account');
    return !this.authService.isAuthenticated() && isOnAccount;
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
