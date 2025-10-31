import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/http/user.service';
import { AuthService } from '../../../core/auth/auth.service';

interface ProfileUpdate {
  firstName: string;
  lastName: string;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}

interface EmailChange {
  newEmail: string;
  password: string;
}

@Component({
  standalone: true,
  selector: 'app-settings-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  profile: ProfileUpdate = { firstName: '', lastName: '' };
  password: PasswordChange = { currentPassword: '', newPassword: '' };
  email: EmailChange = { newEmail: '', password: '' };
  deletePassword = '';

  message = '';
  isError = false;

  get currentFirstName(): string {
    return this.authService.user()?.firstName || 'Laden...';
  }

  get currentLastName(): string {
    return this.authService.user()?.lastName || 'Laden...';
  }

  get currentEmail(): string {
    return this.authService.user()?.email || 'Laden...';
  }

  updateProfile(): void {
    const payload: any = {};

    if (this.profile.firstName && this.profile.firstName.trim() !== '') {
      payload.firstName = this.profile.firstName.trim();
    }
    if (this.profile.lastName && this.profile.lastName.trim() !== '') {
      payload.lastName = this.profile.lastName.trim();
    }

    if (Object.keys(payload).length === 0) {
      this.showMessage('Bitte mindestens ein Feld ausfüllen.', true);
      return;
    }

    this.userService.updateProfile(payload).subscribe({
      next: () => {
        this.showMessage('✅ Profil erfolgreich aktualisiert', false);
        this.profile = { firstName: '', lastName: '' };
      },
      error: (err) => {
        console.error('Update profile error:', err);
        this.showMessage('❌ Fehler beim Aktualisieren des Profils', true);
      }
    });
  }

  isProfileDisabled(): boolean {
    const hasFirst = this.profile.firstName && this.profile.firstName.trim() !== '';
    const hasLast = this.profile.lastName && this.profile.lastName.trim() !== '';
    return !(hasFirst || hasLast);
  }

  changePassword(): void {
    this.userService.changePassword(this.password).subscribe({
      next: () => {
        this.showMessage('🔑 Passwort erfolgreich geändert', false);
        this.password = { currentPassword: '', newPassword: '' };
      },
      error: (err) => {
        console.error('Change password error:', err);
        this.showMessage('❌ Fehler beim Ändern des Passworts', true);
      }
    });
  }

  changeEmail(): void {
    this.userService.changeEmail(this.email).subscribe({
      next: () => {
        this.showMessage('📧 E-Mail erfolgreich geändert', false);
        this.email = { newEmail: '', password: '' };
      },
      error: (err) => {
        console.error('Change email error:', err);
        this.showMessage('❌ Fehler beim Ändern der E-Mail', true);
      }
    });
  }

  deleteAccount(): void {
    const confirmed = confirm(
      '⚠️ Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.'
    );

    if (!confirmed) return;

    this.userService.deleteAccount({ password: this.deletePassword }).subscribe({
      next: () => this.showMessage('🗑️ Konto wurde gelöscht', false),
      error: (err) => {
        console.error('Delete account error:', err);
        this.showMessage('❌ Fehler beim Löschen des Kontos', true);
      }
    });
  }

  private showMessage(text: string, error: boolean): void {
    this.message = text;
    this.isError = error;
    setTimeout(() => {
      this.message = '';
      this.isError = false;
    }, 4000);
  }
}
