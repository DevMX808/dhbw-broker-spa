import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, SignInInput } from '../../../../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['../sign-xx-page.component.scss']
})
export class SignInPageComponent {
  private router = inject(Router);
  readonly authService = inject(AuthService);

  credentials: SignInInput = {
    email: '',
    password: ''
  };

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.authService.clearError();

      this.authService.signIn(this.credentials).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          if (response && response.accessToken && this.authService.isAuthenticated()) {
            setTimeout(() => {
              this.router.navigate(['/market']);
            }, 500);
          } else {
            console.warn('Login response received but user not authenticated');
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
    }
  }
}
