import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, SignUpInput } from '../../../../../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-sign-up',
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['../sign-xx-page.component.scss']
})
export class SignUpPageComponent implements OnChanges {
  private router = inject(Router);
  readonly authService = inject(AuthService);

  @Input() resetTrigger = 0;

  submitted = false;

  userData: SignUpInput = {
    firstName: '',
    lastName: '',
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
    this.userData = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };
    this.authService.clearError();
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    form.control.markAllAsTouched();

    if (form.invalid) {
      return;
    }

    this.authService.clearError();

    this.authService.signUp(this.userData).subscribe({
      next: (response) => {
        if (response && response.accessToken && this.authService.isAuthenticated()) {
          setTimeout(() => {
            void this.router.navigate(['/market']);
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
