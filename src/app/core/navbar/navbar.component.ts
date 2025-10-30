import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';  // Passe den Pfad an (z. B. aus core/auth)
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private authService = inject(AuthService);

  get firstName(): string {
    return this.authService.user()?.firstName || '';
  }

  get lastName(): string {
    return this.authService.user()?.lastName || '';
  }

  get initials(): string {
    return ((this.firstName[0] || '') + (this.lastName[0] || '')).toUpperCase();
  }

}
