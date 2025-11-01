import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, UserWithBalance } from '../data-access/admin.service';

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