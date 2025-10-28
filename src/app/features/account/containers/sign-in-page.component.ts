import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, SignInInput } from '../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  imports: [FormsModule, CommonModule],
  template: `
    <form (ngSubmit)="onSubmit(signInForm)" #signInForm="ngForm">
      <h1>Sign in</h1>
      <div class="social-container">
        <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
        <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
        <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
      </div>
      <span>or use your account</span>
      
      @if (authService.error()) {
        <div class="error-message">
          {{ authService.error() }}
        </div>
      }
      
      <input 
        type="email" 
        placeholder="Email" 
        [(ngModel)]="credentials.email" 
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
        [(ngModel)]="credentials.password" 
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
      
      <a href="#">Forgot your password?</a>
      <button 
        type="submit" 
        [disabled]="signInForm.invalid || authService.loading()">
        @if (authService.loading()) {
          Anmelden...
        } @else {
          Sign In
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
          // Zusätzlich prüfen ob User wirklich authentifiziert ist
          if (response && response.accessToken && this.authService.isAuthenticated()) {
            // Navigate to market page after successful login
            setTimeout(() => {
              this.router.navigate(['/market']);
            }, 500);
          } else {
            console.warn('Login response received but user not authenticated');
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          // Bei Fehler auf Login-Seite bleiben
          // Error wird bereits im AuthService angezeigt
        }
      });
    }
  }
}
