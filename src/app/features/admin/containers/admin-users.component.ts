import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { AdminService, UserWithBalance } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, NgClass],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  users: UserWithBalance[] = [];
  loading = false;
  error = '';
  updatingUserId: string | null = null;

  showConfirmDialog = false;
  pendingUser: UserWithBalance | null = null;
  pendingStatus: 'ACTIVATED' | 'DEACTIVATED' = 'DEACTIVATED';

  // Message System
  message: string = '';
  messageType: 'success' | 'error' | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getUsersWithBalances().subscribe({
      next: (users: UserWithBalance[]) => {
        this.users = users;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Fehler beim Laden der Benutzer.';
        this.loading = false;
      },
    });
  }

  formatBalance(balance?: number): string {
    if (balance == null) {
      return '0.00 USD';
    }
    return balance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USD';
  }

  getStatusText(status?: string): string {
    return status === 'DEACTIVATED' ? 'Blockiert' : 'Aktiv';
  }

  getStatusClass(status?: string): string {
    return status === 'DEACTIVATED'
      ? 'status-badge status-badge--blocked'
      : 'status-badge status-badge--active';
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;

    setTimeout(() => {
      this.message = '';
      this.messageType = null;
    }, 5000);
  }

  confirmStatusChange(user: UserWithBalance, status: 'ACTIVATED' | 'DEACTIVATED'): void {
    this.pendingUser = user;
    this.pendingStatus = status;
    this.showConfirmDialog = true;
  }

  cancelConfirmation(): void {
    this.showConfirmDialog = false;
    this.pendingUser = null;
  }

  confirmBlock(): void {
    if (!this.pendingUser) {
      return;
    }
    this.updateUserStatus(this.pendingUser, this.pendingStatus);
    this.showConfirmDialog = false;
  }

  updateUserStatus(user: UserWithBalance, status: 'ACTIVATED' | 'DEACTIVATED'): void {
    this.updatingUserId = user.userId;
    this.adminService.updateUserStatus(user.userId, status).subscribe({
      next: () => {
        user.status = status;
        this.updatingUserId = null;

        const msg = status === 'DEACTIVATED'
          ? `Benutzer ${user.firstName} ${user.lastName} wurde blockiert.`
          : `Benutzer ${user.firstName} ${user.lastName} wurde aktiviert.`;
        this.showMessage(msg, 'success');
      },
      error: (err: any) => {
        console.error(err);
        this.updatingUserId = null;
        this.showMessage('Änderung konnte nicht gespeichert werden.', 'error');
      },
    });
  }
}
