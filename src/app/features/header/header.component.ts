import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar bg-light px-3 d-flex align-items-center justify-content-between border-bottom shadow-sm">
      <div class="d-flex align-items-center gap-3">
        <!-- Link-Button -->
        <button class="btn btn-outline-primary" (click)="goToAssets()">Meine Assets</button>

        <!-- Begrüßung -->
        <span class="fw-semibold">Hallo {{ firstName }}</span>
      </div>

      <!-- Benutzer-Initialen -->
      <div class="user-initials bg-primary text-white fw-bold rounded-circle d-flex align-items-center justify-content-center">
        {{ initials }}
      </div>
    </nav>
  `,
  styles: [`
    .user-initials {
      width: 40px;
      height: 40px;
      font-size: 1.1rem;
    }
  `]
})
export class HeaderComponent {
  @Input() firstName: string = '';
  @Input() lastName: string = '';

  constructor(private router: Router) {}

  get initials(): string {
    return (this.firstName?.charAt(0) + this.lastName?.charAt(0)).toUpperCase();
  }

  goToAssets() {
    this.router.navigate(['/assets']);
  }
}
