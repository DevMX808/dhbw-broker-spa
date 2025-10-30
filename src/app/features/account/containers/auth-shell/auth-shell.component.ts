import { Component, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInPageComponent } from './sign-xx/sign-in-page/sign-in-page.component';
import { SignUpPageComponent } from './sign-xx/sign-up-page/sign-up-page.component';

@Component({
  standalone: true,
  selector: 'app-auth-shell',
  imports: [CommonModule, SignInPageComponent, SignUpPageComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './auth-shell.component.html',
  styleUrls: ['./auth-shell.component.scss']
})
export class AuthShellComponent {
  rightPanelActive = signal(false);

  showSignUp() {
    this.rightPanelActive.set(true);
  }

  showSignIn() {
    this.rightPanelActive.set(false);
  }
}
