import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, SignUpInput } from '../../../../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-sign-up',
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['../sign-xx-page.component.scss']
})
export class SignUpPageComponent {
  private router = inject(Router);
  readonly authService = inject(AuthService);

  userData: SignUpInput = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.authService.clearError();

      this.authService.signUp(this.userData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          if (response && response.accessToken && this.authService.isAuthenticated()) {
            setTimeout(() => {
              this.router.navigate(['/market']);
            }, 500);
          } else {
            console.warn('Registration response received but user not authenticated');
          }
        },
        error: (error) => {
          console.error('Registration failed:', error);
        }
      });
    }
  }
}
