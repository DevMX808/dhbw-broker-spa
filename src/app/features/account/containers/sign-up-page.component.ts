import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sign-up',
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <h1>Create Account</h1>
      <div class="social-container">
        <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
        <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
        <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
      </div>
      <span>or use your email for registration</span>
      <input type="text" placeholder="Name" [(ngModel)]="name" name="name" required />
      <input type="email" placeholder="Email" [(ngModel)]="email" name="email" required />
      <input type="password" placeholder="Password" [(ngModel)]="password" name="password" required />
      <button type="submit">Sign Up</button>
    </form>
  `
})
export class SignUpPageComponent {
  private router = inject(Router);

  name = '';
  email = '';
  password = '';

  onSubmit() {
    // Hier könntest du echte Registrierungs-Logik einfügen, z.B. mit einem Service
    this.router.navigate(['/account/sign-in']);
  }
}
