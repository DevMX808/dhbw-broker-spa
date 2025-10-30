import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/http/user.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-settings-page',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="settings-fullscreen">
      <div class="settings-content" @fadeIn>
        <h1 class="settings-title">⚙️ Einstellungen</h1>

        <div *ngIf="message"
             class="alert"
             [ngClass]="{'alert-success': !isError, 'alert-danger': isError}"
             [@fadeIn]>
          {{ message }}
        </div>

        <div class="settings-grid">
          
          <div class="settings-card">
            <div class="card-header">👤 Profil ändern</div>
            <form (ngSubmit)="updateProfile()" #profileForm="ngForm" class="card-body">
              <label>Vorname</label>
              <input class="form-control" type="text" [(ngModel)]="profile.firstName" name="firstName" required>

              <label>Nachname</label>
              <input class="form-control" type="text" [(ngModel)]="profile.lastName" name="lastName" required>

              <button class="btn btn-primary" type="submit" [disabled]="!profileForm.valid">💾 Speichern</button>
            </form>
          </div>

          
          <div class="settings-card">
            <div class="card-header">🔒 Passwort ändern</div>
            <form (ngSubmit)="changePassword()" #passwordForm="ngForm" class="card-body">
              <label>Aktuelles Passwort</label>
              <input class="form-control" type="password" [(ngModel)]="password.currentPassword" name="currentPassword" required>

              <label>Neues Passwort</label>
              <input class="form-control" type="password" [(ngModel)]="password.newPassword" name="newPassword" required minlength="8">

              <button class="btn btn-primary" type="submit" [disabled]="!passwordForm.valid">🔁 Ändern</button>
            </form>
          </div>

        
          <div class="settings-card">
            <div class="card-header">📧 E-Mail ändern</div>
            <form (ngSubmit)="changeEmail()" #emailForm="ngForm" class="card-body">
              <label>Neue E-Mail</label>
              <input class="form-control" type="email" [(ngModel)]="email.newEmail" name="newEmail" required>

              <label>Passwort bestätigen</label>
              <input class="form-control" type="password" [(ngModel)]="email.password" name="password" required>

              <button class="btn btn-primary" type="submit" [disabled]="!emailForm.valid">✉️ Ändern</button>
            </form>
          </div>

          
          <div class="settings-card danger-zone">
            <div class="card-header text-danger">⚠️ Konto löschen</div>
            <form (ngSubmit)="deleteAccount()" #deleteForm="ngForm" class="card-body">
              <label>Passwort bestätigen</label>
              <input class="form-control" type="password" [(ngModel)]="deletePassword" name="deletePassword" required>

              <button class="btn btn-danger delete-btn" type="submit" [disabled]="!deleteForm.valid">
                🗑️ Konto löschen
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-fullscreen {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
      background: radial-gradient(circle at center, #0a0f18 0%, #060b10 100%);
      overflow: hidden;
    }

    .settings-content {
      width: 90%;
      max-width: 1200px;
      height: 90vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: rgba(255,255,255,0.05);
      border-radius: 16px;
      padding: 1.5rem 2rem;
      box-shadow: 0 0 25px rgba(0,0,0,0.45);
      backdrop-filter: blur(10px);
      overflow: hidden;
    }

    .settings-title {
      text-align: center;
      color: #00d4ff;
      margin-bottom: 0.5rem;
      font-size: 1.8rem;
      font-weight: 600;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 1rem;
      height: 100%;
      flex-grow: 1;
    }

    .settings-card {
      background: rgba(255,255,255,0.08);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.3s ease;
      padding-bottom: 0.5rem;
    }

    .settings-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .card-header {
      font-weight: 600;
      padding: 0.8rem 1rem;
      background: rgba(0,0,0,0.3);
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      color: #f1f1f1;
      font-size: 0.95rem;
    }

    .card-body {
      padding: 0.8rem 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      height: 100%;
    }

    label {
      font-size: 0.85rem;
      color: #adb5bd;
      margin-top: 0.2rem;
    }

    .form-control {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      border-radius: 6px;
      padding: 0.4rem 0.6rem;
      transition: all 0.2s ease;
      margin-bottom: 0.5rem;
    }

    .form-control:focus {
      background: rgba(255,255,255,0.2);
      border-color: #00d4ff;
      outline: none;
    }

    .btn {
      border: none;
      border-radius: 6px;
      font-weight: 600;
      padding: 0.45rem 1rem;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(90deg, #00d4ff, #0077ff);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 0 10px rgba(0,212,255,0.4);
    }

    .btn-danger {
      background: linear-gradient(90deg, #e63946, #b5179e);
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 0 10px rgba(255,80,80,0.4);
    }

    .alert {
      text-align: center;
      margin: 0 auto 1rem auto;
      width: 50%;
      border-radius: 8px;
      padding: 0.6rem;
      font-weight: 500;
      font-size: 0.95rem;
    }

    .alert-success {
      background: rgba(0,255,150,0.1);
      color: #00ff9d;
      border: 1px solid rgba(0,255,150,0.3);
    }

    .alert-danger {
      background: rgba(255,80,80,0.1);
      color: #ff5c5c;
      border: 1px solid rgba(255,80,80,0.3);
    }

    .danger-zone {
      border: 1px solid rgba(255,0,0,0.3);
    }

    @media (max-width: 1024px) {
      .settings-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        overflow-y: auto;
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SettingsPageComponent {
  private userService = inject(UserService);

  profile = { firstName: '', lastName: '' };
  password = { currentPassword: '', newPassword: '' };
  email = { newEmail: '', password: '' };
  deletePassword = '';

  message = '';
  isError = false;

  updateProfile() {
    this.userService.updateProfile(this.profile).subscribe({
      next: () => this.showMessage('✅ Profil erfolgreich aktualisiert', false),
      error: (err) => {
        console.error('Update profile error:', err);
        this.showMessage('❌ Fehler beim Aktualisieren des Profils', true);
      }
    });
  }

  changePassword() {
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

  changeEmail() {
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

  deleteAccount() {
    if (confirm('⚠️ Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      this.userService.deleteAccount({ password: this.deletePassword }).subscribe({
        next: () => this.showMessage('🗑️ Konto wurde gelöscht', false),
        error: (err) => {
          console.error('Delete account error:', err);
          this.showMessage('❌ Fehler beim Löschen des Kontos', true);
        }
      });
    }
  }

  private showMessage(text: string, error: boolean) {
    this.message = text;
    this.isError = error;
    setTimeout(() => this.message = '', 4000);
  }
}
