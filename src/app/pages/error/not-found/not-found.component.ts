import {Component, computed, inject} from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['../error.component.scss']
})

export class NotFoundComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  async returnHome(): Promise<void> {
    try {
      if (this.isAuthenticated()) {
        await this.router.navigate(['/market']);
      } else {
        await this.router.navigate(['/account/sign-in']);
      }
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  }
}

