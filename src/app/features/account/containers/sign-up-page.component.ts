import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, SignUpInput } from '../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-sign-up',
  imports: [FormsModule, CommonModule],
  template: `
    <form (ngSubmit)="onSubmit(signUpForm)" #signUpForm="ngForm">
      <h1>Create Account</h1>
      <div class="social-container">
        <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
        <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
        <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
      </div>
      <span>or use your email for registration</span>
      
      @if (authService.error()) {
        <div class="error-message">
          {{ authService.error() }}
        </div>
      }
      
      <input 
        type="text" 
        placeholder="Vorname" 
        [(ngModel)]="userData.firstName" 
        name="firstName" 
        required 
        minlength="2"
        #firstNameInput="ngModel"
        [class.error]="firstNameInput.invalid && firstNameInput.touched" />
      
      @if (firstNameInput.invalid && firstNameInput.touched) {
        <div class="field-error">
          @if (firstNameInput.errors?.['required']) {
            Vorname ist erforderlich
          }
          @if (firstNameInput.errors?.['minlength']) {
            Vorname muss mindestens 2 Zeichen lang sein
          }
        </div>
      }
      
      <input 
        type="text" 
        placeholder="Nachname" 
        [(ngModel)]="userData.lastName" 
        name="lastName" 
        required 
        minlength="2"
        #lastNameInput="ngModel"
        [class.error]="lastNameInput.invalid && lastNameInput.touched" />
      
      @if (lastNameInput.invalid && lastNameInput.touched) {
        <div class="field-error">
          @if (lastNameInput.errors?.['required']) {
            Nachname ist erforderlich
          }
          @if (lastNameInput.errors?.['minlength']) {
            Nachname muss mindestens 2 Zeichen lang sein
          }
        </div>
      }
      
      <input 
        type="email" 
        placeholder="Email" 
        [(ngModel)]="userData.email" 
        name="email" 
        required 
        email
        #emailInput="ngModel"
        [class.error]="emailInput.invalid && emailInput.touched" />
      
      @if (emailInput.invalid && emailInput.touched) {
        <div class="field-error">
          @if (emailInput.errors?.['required']) {
            E-Mail ist erforderlich
          }
          @if (emailInput.errors?.['email']) {
            Ungültige E-Mail-Adresse
          }
        </div>
      }
      
      <input 
        type="password" 
        placeholder="Password" 
        [(ngModel)]="userData.password" 
        name="password" 
        required 
        minlength="6"
        #passwordInput="ngModel"
        [class.error]="passwordInput.invalid && passwordInput.touched" />
      
      @if (passwordInput.invalid && passwordInput.touched) {
        <div class="field-error">
          @if (passwordInput.errors?.['required']) {
            Passwort ist erforderlich
          }
          @if (passwordInput.errors?.['minlength']) {
            Passwort muss mindestens 6 Zeichen lang sein
          }
        </div>
      }
      
      <button 
        type="submit" 
        [disabled]="signUpForm.invalid || authService.loading()">
        @if (authService.loading()) {
          Registrieren...
        } @else {
          Sign Up
        }
      </button>
    </form>
  `,
  styles: [`
    .error-message {
      background-color: #ffebee;
      color: #c62828;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
      border: 1px solid #ffcdd2;
      font-size: 14px;
    }
    
    .field-error {
      color: #c62828;
      font-size: 12px;
      margin-top: 5px;
      margin-bottom: 10px;
    }
    
    input.error {
      border-color: #c62828 !important;
      background-color: #ffebee;
    }
    
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
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
          // Zusätzlich prüfen ob User wirklich authentifiziert ist
          if (response && response.accessToken && this.authService.isAuthenticated()) {
            // Navigate to market page after successful registration
            setTimeout(() => {
              this.router.navigate(['/market']);
            }, 500);
          } else {
            console.warn('Registration response received but user not authenticated');
          }
        },
        error: (error) => {
          console.error('Registration failed:', error);
          // Error handling is done in AuthService
        }
      });
    }
  }
}
