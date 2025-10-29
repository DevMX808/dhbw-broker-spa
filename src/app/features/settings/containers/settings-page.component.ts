import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/http/user.service';

@Component({
  standalone: true,
  selector: 'app-settings-page',
  imports: [FormsModule],
  template: `
    <h1 class="h4">Settings</h1>
    
    <!-- Profile Update -->
    <div class="card mb-3">
      <div class="card-header">Profil ändern</div>
      <div class="card-body">
        <form (ngSubmit)="updateProfile()" #profileForm="ngForm">
          <div class="mb-2">
            <label class="form-label">Vorname</label>
            <input type="text" class="form-control" [(ngModel)]="profile.firstName" name="firstName" required>
          </div>
          <div class="mb-2">
            <label class="form-label">Nachname</label>
            <input type="text" class="form-control" [(ngModel)]="profile.lastName" name="lastName" required>
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="!profileForm.valid">Speichern</button>
        </form>
      </div>
    </div>

    <!-- Password Change -->
    <div class="card mb-3">
      <div class="card-header">Passwort ändern</div>
      <div class="card-body">
        <form (ngSubmit)="changePassword()" #passwordForm="ngForm">
          <div class="mb-2">
            <label class="form-label">Aktuelles Passwort</label>
            <input type="password" class="form-control" [(ngModel)]="password.current" name="current" required>
          </div>
          <div class="mb-2">
            <label class="form-label">Neues Passwort</label>
            <input type="password" class="form-control" [(ngModel)]="password.new" name="new" required minlength="8">
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="!passwordForm.valid">Passwort ändern</button>
        </form>
      </div>
    </div>

    <!-- Email Change -->
    <div class="card mb-3">
      <div class="card-header">E-Mail ändern</div>
      <div class="card-body">
        <form (ngSubmit)="changeEmail()" #emailForm="ngForm">
          <div class="mb-2">
            <label class="form-label">Neue E-Mail</label>
            <input type="email" class="form-control" [(ngModel)]="email.new" name="newEmail" required>
          </div>
          <div class="mb-2">
            <label class="form-label">Passwort bestätigen</label>
            <input type="password" class="form-control" [(ngModel)]="email.password" name="password" required>
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="!emailForm.valid">E-Mail ändern</button>
        </form>
      </div>
    </div>

    <!-- Account Delete -->
    <div class="card mb-3">
      <div class="card-header text-danger">Konto löschen</div>
      <div class="card-body">
        <form (ngSubmit)="deleteAccount()" #deleteForm="ngForm">
          <div class="mb-2">
            <label class="form-label">Passwort bestätigen</label>
            <input type="password" class="form-control" [(ngModel)]="deletePassword" name="deletePassword" required>
          </div>
          <button type="submit" class="btn btn-danger" [disabled]="!deleteForm.valid">Konto unwiderruflich löschen</button>
        </form>
      </div>
    </div>

    @if (message) {
      <div class="alert" [class]="'alert-' + (isError ? 'danger' : 'success')">{{ message }}</div>
    }
  `
})
export class SettingsPageComponent {
  private userService = inject(UserService);

  profile = { firstName: '', lastName: '' };
  password = { current: '', new: '' };
  email = { new: '', password: '' };
  deletePassword = '';
  
  message = '';
  isError = false;

  updateProfile() {
    this.userService.updateProfile(this.profile).subscribe({
      next: () => {
        this.showMessage('Profil erfolgreich aktualisiert', false);
        this.profile = { firstName: '', lastName: '' };
      },
      error: () => this.showMessage('Fehler beim Aktualisieren des Profils', true)
    });
  }

  changePassword() {
    this.userService.changePassword({ 
      currentPassword: this.password.current, 
      newPassword: this.password.new 
    }).subscribe({
      next: () => {
        this.showMessage('Passwort erfolgreich geändert', false);
        this.password = { current: '', new: '' };
      },
      error: () => this.showMessage('Fehler beim Ändern des Passworts', true)
    });
  }

  changeEmail() {
    this.userService.changeEmail({ 
      newEmail: this.email.new, 
      password: this.email.password 
    }).subscribe({
      next: () => {
        this.showMessage('E-Mail erfolgreich geändert', false);
        this.email = { new: '', password: '' };
      },
      error: () => this.showMessage('Fehler beim Ändern der E-Mail', true)
    });
  }

  deleteAccount() {
    if (confirm('Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      this.userService.deleteAccount({ password: this.deletePassword }).subscribe({
        next: () => {
          this.showMessage('Konto wurde gelöscht', false);
          // Redirect to login or logout user
        },
        error: () => this.showMessage('Fehler beim Löschen des Kontos', true)
      });
    }
  }

  private showMessage(text: string, error: boolean) {
    this.message = text;
    this.isError = error;
    setTimeout(() => this.message = '', 3000);
  }
}
