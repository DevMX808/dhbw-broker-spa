import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, UserWithBalance } from '../../../core/http/admin.service';

@Component({
  standalone: true,
  selector: 'app-admin-users',
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: UserWithBalance[] = [];
  loading = true;
  error: string | null = null;
  successMessage: string | null = null;
  updatingUserId: string | null = null;

  showConfirmDialog = false;
  pendingUser: UserWithBalance | null = null;
  pendingStatus: 'ACTIVATED' | 'DEACTIVATED' | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getUsersWithBalances().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = `Fehler beim Laden der Benutzer (Status: ${err.status}): ${err.error?.message || err.message}`;
        this.loading = false;
      }
    });
  }

  confirmStatusChange(user: UserWithBalance, status: 'ACTIVATED' | 'DEACTIVATED'): void {
    if (status === 'DEACTIVATED') {
      this.pendingUser = user;
      this.pendingStatus = status;
      this.showConfirmDialog = true;
    } else {
      this.updateUserStatus(user, status);
    }
  }

  confirmBlock(): void {
    if (this.pendingUser && this.pendingStatus) {
      this.updateUserStatus(this.pendingUser, this.pendingStatus);
      this.cancelConfirmation();
    }
  }

  cancelConfirmation(): void {
    this.showConfirmDialog = false;
    this.pendingUser = null;
    this.pendingStatus = null;
  }

  updateUserStatus(user: UserWithBalance, newStatus: 'ACTIVATED' | 'DEACTIVATED'): void {
    this.updatingUserId = user.userId;
    this.error = null;
    this.successMessage = null;

    this.adminService.updateUserStatus(user.userId, newStatus).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.userId === user.userId);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }

        const action = newStatus === 'ACTIVATED' ? 'aktiviert' : 'blockiert';
        this.successMessage = `Benutzer ${user.firstName} ${user.lastName} wurde erfolgreich ${action}.`;

        setTimeout(() => {
          this.successMessage = null;
        }, 5000);

        this.updatingUserId = null;
      },
      error: (err) => {
        console.error('Error updating user status:', err);

        let errorMessage = 'Fehler beim Aktualisieren des Benutzerstatus';

        if (err.status === 400 && err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.status === 403) {
          errorMessage = 'Sie haben keine Berechtigung, diesen Benutzer zu ändern';
        } else if (err.status === 404) {
          errorMessage = 'Benutzer nicht gefunden';
        }

        this.error = errorMessage;
        this.updatingUserId = null;

        setTimeout(() => {
          this.error = null;
        }, 10000);
      }
    });
  }

  getStatusClass(status?: string): string {
    if (status === 'ACTIVATED') {
      return 'status-active';
    } else if (status === 'DEACTIVATED') {
      return 'status-inactive';
    }
    return '';
  }

  getStatusText(status?: string): string {
    if (status === 'ACTIVATED') {
      return 'Aktiv';
    } else if (status === 'DEACTIVATED') {
      return 'Deaktiviert';
    }
    return 'Unbekannt';
  }

  formatBalance(balance?: number): string {
    if (balance == null) {
      return '-';
    }
    return '$' + Number(balance).toFixed(2);
  }
}
