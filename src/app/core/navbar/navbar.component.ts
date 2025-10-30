import { Component, inject } from '@angular/core';
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

  get isLoggedOutOnAccount(): boolean {
    const isOnAccount = this.router.url.startsWith('/account');
    return !this.authService.isAuthenticated() && isOnAccount;
  }

  get firstName(): string {
    return this.authService.user()?.firstName || '';
  }

  get lastName(): string {
    return this.authService.user()?.lastName || '';
  }

  logout(): void {
    this.authService.signOut();
  }
}
