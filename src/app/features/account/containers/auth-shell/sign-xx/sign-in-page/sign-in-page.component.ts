import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
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
export class SignInPageComponent implements OnChanges {
  private router = inject(Router);
  readonly authService = inject(AuthService);

  @Input() resetTrigger = 0;

  submitted = false;

  credentials: SignInInput = {
    email: '',
    password: ''
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetTrigger'] && !changes['resetTrigger'].firstChange) {
      this.resetFormState();
    }
  }

  private resetFormState() {
    this.submitted = false;
    this.credentials = { email: '', password: '' };
    this.authService.clearError();
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    form.control.markAllAsTouched();

    if (form.invalid) {
      return;
    }

    this.authService.clearError();

    this.authService.signIn(this.credentials).subscribe({
      next: (response) => {
        if (response && response.accessToken && this.authService.isAuthenticated()) {
          setTimeout(() => {
            void this.router.navigate(['/market']);
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
