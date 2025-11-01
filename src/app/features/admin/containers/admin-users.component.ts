import { Component, OnInit } from '@angular/core';
import { AdminService, UserWithBalance } from '../../../core/http/admin.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
  standalone: true
})
export class AdminUsersComponent implements OnInit {
  users: UserWithBalance[] = [];
  loading = false;
  error = '';
  successMessage = '';
  updatingUserId: string | null = null;

  showConfirmDialog = false;
  pendingUser: UserWithBalance | null = null;
  pendingStatus: 'ACTIVATED' | 'DEACTIVATED' = 'DEACTIVATED';

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
        this.error = 'Fehler beim Laden der Benutzer.';
        this.loading = false;
        console.error(err);
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
    if (status === 'DEACTIVATED') {
      return 'Blockiert';
    }
    return 'Aktiv';
  }

  getStatusClass(status?: string): string {
    return status === 'DEACTIVATED' ? 'status-badge status-badge--blocked' : 'status-badge status-badge--active';
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
        this.successMessage = status === 'DEACTIVATED' ? 'Benutzer wurde blockiert.' : 'Benutzer wurde aktiviert.';
        setTimeout(() => (this.successMessage = ''), 4000);
      },
      error: (err: any) => {
        console.error(err);
        this.updatingUserId = null;
        this.error = 'Änderung konnte nicht gespeichert werden.';
      },
    });
  }
}
