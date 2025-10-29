import { Component, inject } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-left">
        <span class="greeting">Hallo {{ firstName }} {{ lastName }}</span>
        <span class="initials">{{ initials }}</span>
      </div>
      <div class="navbar-right">
        <a routerLink="/settings" class="btn btn-outline-primary">
          ⚙️ Settings
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      height: 60px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #f8f9fa; /* helles Grau */
      border-bottom: 1px solid #ddd;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .navbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .greeting {
      font-weight: 600;
      font-size: 1.1rem;
      color: #333;
    }
    .initials {
      background-color: #007bff; /* Bootstrap Primary */
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1rem;
      user-select: none;
      box-shadow: 0 0 5px rgba(0,123,255,0.5);
    }
    .navbar-right a {
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      padding: 6px 14px;
      border-radius: 4px;
      border: 1px solid #007bff;
      color: #007bff;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    .navbar-right a:hover {
      background-color: #007bff;
      color: white;
    }
  `]
})
export class NavbarComponent {
  private tokenService = inject(TokenStorageService);
  firstName = '';
  lastName = '';
  initials = '';

  constructor() {
    const payload = this.tokenService.parsePayload(this.tokenService.get());
    if (payload) {
      this.firstName = payload.firstName || '';
      this.lastName = payload.lastName || '';
      this.initials = ((this.firstName[0] || '') + (this.lastName[0] || '')).toUpperCase();
    }
  }
}




