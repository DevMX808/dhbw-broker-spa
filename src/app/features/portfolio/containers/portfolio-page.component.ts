import { Component, OnInit, NgZone } from '@angular/core';
import { PortfolioService } from '../data-access/portfolio.service';
import { HeldTrade } from '../models/held-trade.model';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

interface HeldTradeWithPrice extends HeldTrade {
  sellQuantity?: number;
  currentPriceUsd?: number;
  isSelling?: boolean;
}

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe, FormsModule],
  template: `
    <div class="portfolio-container">
      <h1 class="page-title">💼 Mein Portfolio</h1>

      <!-- Balance Card -->
      <div class="balance-card mb-4">
        <div class="balance-content">
          <div class="balance-icon">💰</div>
          <div class="balance-info">
            <h4 class="balance-label">Verfügbares Guthaben</h4>
            <div class="balance-amount">
              <span *ngIf="!balanceLoading">{{ '$' + (walletBalance | number:'1.2-2') }} USD</span>
              <div *ngIf="balanceLoading" class="spinner-border spinner-border-sm text-light" role="status"></div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading-spinner">
        <div class="spinner-border text-light" role="status"></div>
        <p>Portfolio wird geladen...</p>
      </div>

      <div *ngIf="error" class="alert alert-danger text-center mt-3">
        {{ error }}
      </div>

      <table *ngIf="!isLoading && heldTrades.length > 0" class="table table-hover align-middle portfolio-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Menge</th>
            <th>Kaufpreis (USD)</th>
            <th>Aktueller Preis (USD)</th>
            <th>Gewinn / Verlust</th>
            <th>Kaufdatum</th>
            <th>Aktionen</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let trade of heldTrades">
            <td class="fw-semibold">{{ trade.assetSymbol }}</td>
            <td>{{ trade.quantity }}</td>
            <td>{{ trade.buyPriceUsd | number:'1.2-2' }}</td>

            <td *ngIf="trade.currentPriceUsd; else loadingPrice">
              {{ trade.currentPriceUsd | number:'1.2-2' }}
            </td>
            <ng-template #loadingPrice>
              <td class="text-muted">–</td>
            </ng-template>

      
            <td *ngIf="trade.currentPriceUsd" class="gain-loss-cell">
              <span [ngClass]="{
                'text-success': trade.currentPriceUsd > trade.buyPriceUsd,
                'text-danger': trade.currentPriceUsd < trade.buyPriceUsd
              }">
                <i class="bi"
                   [ngClass]="{
                     'bi-arrow-up-right': trade.currentPriceUsd > trade.buyPriceUsd,
                     'bi-arrow-down-right': trade.currentPriceUsd < trade.buyPriceUsd
                   }"></i>

               
                {{ ((trade.currentPriceUsd - trade.buyPriceUsd) * trade.quantity) | number:'1.2-2' }} USD

                ({{ ((trade.currentPriceUsd - trade.buyPriceUsd) / trade.buyPriceUsd * 100) | number:'1.2-2' }}%)

                <!-- Dynamischer Gewinn/Verlust für eingegebene Menge -->
                <ng-container *ngIf="trade.sellQuantity && trade.sellQuantity > 0">
                  <br>
                  Verkaufen von {{ trade.sellQuantity }}: 
                  {{ ((trade.currentPriceUsd - trade.buyPriceUsd) * trade.sellQuantity) | number:'1.2-2' }} USD
                </ng-container>
              </span>
            </td>

            <td>{{ trade.createdAt | date:'short' }}</td>

            <td>
              <div class="d-flex align-items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  [(ngModel)]="trade.sellQuantity"
                  [max]="trade.quantity"
                  class="form-control form-control-sm quantity-input"
                  placeholder="Menge"
                />

                <button
                  class="btn btn-sm sell-btn"
                  [disabled]="!isValidSellAmount(trade) || trade.isSelling"
                  (click)="sell(trade)"
                >
                  <span *ngIf="!trade.isSelling">💸 Verkaufen</span>
                  <div *ngIf="trade.isSelling" class="spinner-border spinner-border-sm text-light" role="status"></div>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!isLoading && heldTrades.length === 0" class="text-muted text-center mt-4">
        Keine gehaltenen Assets vorhanden.
      </div>
    </div>
  `,
  styles: [`
    .portfolio-container {
      padding: 2rem;
      background: linear-gradient(180deg, #0b0d13, #131822);
      border-radius: 12px;
      box-shadow: 0 0 20px rgba(0,0,0,0.3);
      color: #f8f9fa;
      animation: fadeIn 0.8s ease;
      min-height: 100vh;
    }

    .page-title {
      font-weight: 600;
      color: #00d4ff;
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .portfolio-table {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      overflow: hidden;
      width: 100%;
    }

    th {
      background: rgba(0, 0, 0, 0.3);
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 1px;
    }

    td {
      vertical-align: middle;
    }

    .gain-loss-cell {
      font-weight: 600;
    }

    .quantity-input {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: 0.3s ease;
    }

    .quantity-input:focus {
      background: rgba(255, 255, 255, 0.2);
      border-color: #00d4ff;
      box-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
    }

    .sell-btn {
      background: linear-gradient(90deg, #e63946, #b5179e);
      color: white;
      font-weight: 600;
      border: none;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .sell-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 0, 100, 0.5);
    }

    .sell-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #ccc;
      font-size: 1.1rem;
    }

    .balance-card {
      background: linear-gradient(135deg, #1e3c72, #2a5298);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .balance-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .balance-icon {
      font-size: 2.5rem;
      opacity: 0.8;
    }

    .balance-label {
      color: #e0e0e0;
      font-size: 0.9rem;
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }

    .balance-amount {
      font-size: 1.8rem;
      font-weight: 700;
      color: #00ff88;
      text-shadow: 0 0 10px rgba(0,255,136,0.3);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class PortfolioPageComponent implements OnInit {
  heldTrades: HeldTradeWithPrice[] = [];
  isLoading = false;
  error: string | null = null;
  walletBalance: number = 0;
  balanceLoading = false;

  constructor(
    private portfolioService: PortfolioService,
    private ngZone: NgZone 
  ) {}

  ngOnInit(): void {
    this.loadPortfolio();
    this.loadBalance();
  }

  loadPortfolio(): void {
    this.isLoading = true;
    this.error = null;

    this.portfolioService.getHeldTrades().subscribe({
      next: (trades) => {
        const withSell = trades.map(t => ({ ...t, sellQuantity: 0 }));

        const priceRequests = withSell.map(t =>
          this.portfolioService.getCurrentPrice(t.assetSymbol)
        );

        forkJoin(priceRequests).subscribe({
          next: (prices) => {
            this.ngZone.run(() => { 
              this.heldTrades = withSell.map((t, i) => ({
                ...t,
                currentPriceUsd: prices[i].price
              }));
              this.isLoading = false;
            });
          },
          error: (err) => {
            this.ngZone.run(() => {
              this.error = 'Preise konnten nicht geladen werden.';
              this.isLoading = false;
            });
            console.error('Fehler beim Laden der Preise:', err);
          }
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.error = 'Portfolio konnte nicht geladen werden.';
          this.isLoading = false;
        });
        console.error(err);
      }
    });
  }

  loadBalance(): void {
    this.balanceLoading = true;
    this.portfolioService.getWalletBalance().subscribe({
      next: (response) => {
        this.walletBalance = response.balance;
        this.balanceLoading = false;
      },
      error: (err) => {
        console.error('Balance konnte nicht geladen werden:', err);
        this.balanceLoading = false;
      }
    });
  }

  isValidSellAmount(trade: HeldTradeWithPrice): boolean {
    return !!trade.sellQuantity && trade.sellQuantity > 0 && trade.sellQuantity <= trade.quantity;
  }

  sell(trade: HeldTradeWithPrice): void {
    const amount = trade.sellQuantity ?? 0;

    if (amount <= 0) {
      alert('Bitte eine gültige Menge eingeben.');
      return;
    }

    if (amount > trade.quantity) {
      alert('Sie können nicht mehr verkaufen, als Sie besitzen.');
      return;
    }

    if (!confirm(`Wollen Sie wirklich ${amount} ${trade.assetSymbol} verkaufen?`)) {
      return;
    }

    trade.isSelling = true;

    this.portfolioService.sellAsset(trade.assetSymbol, amount).subscribe({
      next: () => {
        trade.isSelling = false;
        alert(`${amount} ${trade.assetSymbol} erfolgreich verkauft!`);
        this.loadPortfolio();
      },
      error: (err) => {
        trade.isSelling = false;
        console.error('Verkauf fehlgeschlagen:', err);
        alert(`Verkauf fehlgeschlagen: ${err.error?.message || err.message}`);
      }
    });
  }
}
