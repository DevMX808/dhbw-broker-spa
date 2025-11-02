import { Component, signal, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
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
export class AuthShellComponent implements OnInit, OnDestroy {
  rightPanelActive = signal(false);

  signInReset = signal(0);
  signUpReset = signal(0);

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  showSignUp() {
    this.rightPanelActive.set(true);
    this.signUpReset.update(v => v + 1);
  }

  showSignIn() {
    this.rightPanelActive.set(false);
    this.signInReset.update(v => v + 1);
  }
}
