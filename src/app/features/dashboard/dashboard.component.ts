import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <h1>DHBW Broker Dashboard</h1>
          <div class="user-info" *ngIf="currentUser">
            <span>Welcome, {{ currentUser.firstName }} {{ currentUser.lastName }}</span>
            <button class="logout-button" (click)="logout()">Logout</button>
          </div>
        </div>
      </header>

      <main class="dashboard-main">
        <div class="dashboard-grid">
          <!-- Welcome Card -->
          <div class="card welcome-card">
            <h2>Welcome to DHBW Broker!</h2>
            <p>Your trading journey starts here. You have received $10,000 starting balance.</p>
          </div>

          <!-- Quick Stats -->
          <div class="card stats-card">
            <h3>Quick Stats</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">Portfolio Value</span>
                <span class="stat-value">$10,000.00</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Available Cash</span>
                <span class="stat-value">$10,000.00</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Total Trades</span>
                <span class="stat-value">0</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">P&L Today</span>
                <span class="stat-value positive">+$0.00</span>
              </div>
            </div>
          </div>

          <!-- Actions Card -->
          <div class="card actions-card">
            <h3>Quick Actions</h3>
            <div class="actions-grid">
              <button class="action-button buy">
                <span class="action-icon">📈</span>
                Buy Assets
              </button>
              <button class="action-button sell">
                <span class="action-icon">📉</span>
                Sell Assets
              </button>
              <button class="action-button portfolio">
                <span class="action-icon">💼</span>
                View Portfolio
              </button>
              <button class="action-button history">
                <span class="action-icon">📊</span>
                Trade History
              </button>
            </div>
          </div>

          <!-- Market Overview -->
          <div class="card market-card">
            <h3>Market Overview</h3>
            <div class="market-list">
              <div class="market-item">
                <span class="asset-name">BTC-USD</span>
                <span class="asset-price">$43,250.00</span>
                <span class="asset-change positive">+2.5%</span>
              </div>
              <div class="market-item">
                <span class="asset-name">ETH-USD</span>
                <span class="asset-price">$2,650.00</span>
                <span class="asset-change negative">-1.2%</span>
              </div>
              <div class="market-item">
                <span class="asset-name">AAPL</span>
                <span class="asset-price">$175.80</span>
                <span class="asset-change positive">+0.8%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f5f7fa;
    }

    .dashboard-header {
      background: white;
      border-bottom: 1px solid #e1e5e9;
      padding: 0 20px;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
    }

    .dashboard-header h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-info span {
      color: #555;
      font-weight: 500;
    }

    .logout-button {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s ease;
    }

    .logout-button:hover {
      background: #c0392b;
    }

    .dashboard-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 25px;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      border: 1px solid #e1e5e9;
    }

    .card h2, .card h3 {
      margin: 0 0 20px 0;
      color: #2c3e50;
    }

    .welcome-card {
      grid-column: 1 / -1;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .welcome-card h2 {
      color: white;
      font-size: 28px;
      margin-bottom: 10px;
    }

    .welcome-card p {
      font-size: 16px;
      opacity: 0.9;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .stat-label {
      font-size: 14px;
      color: #7f8c8d;
      font-weight: 500;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #2c3e50;
    }

    .stat-value.positive {
      color: #27ae60;
    }

    .stat-value.negative {
      color: #e74c3c;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .action-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px;
      border: 2px solid #e1e5e9;
      background: white;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .action-button:hover {
      border-color: #667eea;
      transform: translateY(-2px);
    }

    .action-button.buy:hover {
      border-color: #27ae60;
      color: #27ae60;
    }

    .action-button.sell:hover {
      border-color: #e74c3c;
      color: #e74c3c;
    }

    .action-icon {
      font-size: 24px;
    }

    .market-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .market-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .asset-name {
      font-weight: 600;
      color: #2c3e50;
    }

    .asset-price {
      font-weight: 500;
      color: #34495e;
    }

    .asset-change {
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 14px;
    }

    .asset-change.positive {
      background: #d4edda;
      color: #27ae60;
    }

    .asset-change.negative {
      background: #f8d7da;
      color: #e74c3c;
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-grid,
      .actions-grid {
        grid-template-columns: 1fr;
      }
      
      .header-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}