import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <h1>Sign in</h1>
      <div class="social-container">
        <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
        <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
        <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
      </div>
      <span>or use your account</span>
      <input type="email" placeholder="Email" [(ngModel)]="email" name="email" required />
      <input type="password" placeholder="Password" [(ngModel)]="password" name="password" required />
      <a href="#">Forgot your password?</a>
      <button type="submit">Sign In</button>
    </form>
  `
})
export class SignInPageComponent {
  private router = inject(Router);

  email = '';
  password = '';

  onSubmit() {
    // Hier könntest du echte Auth-Logik einfügen, z.B. mit einem Service
    this.router.navigate(['/market']);
  }
}
