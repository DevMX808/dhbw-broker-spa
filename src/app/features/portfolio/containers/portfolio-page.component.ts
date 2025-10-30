import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../data-access/portfolio.service';
import { HeldTrade } from '../models/held-trade.model';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

interface HeldTradeWithPrice extends HeldTrade {
  sellQuantity?: number;
  currentPriceUsd?: number;
}

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe, FormsModule],
  template: `
    <h1 class="h4 mb-4 text-white">Mein Portfolio</h1>

    <div *ngIf="isLoading" class="text-muted">Lade Portfolio...</div>

    <div *ngIf="error" class="alert alert-danger">
      Fehler beim Laden: {{ error }}
    </div>

    <table *ngIf="heldTrades.length > 0" class="table table-hover align-middle text-white">
      <thead class="table-dark">
        <tr>
          <th>Asset</th>
          <th>Menge</th>
          <th>Kaufpreis (USD)</th>
          <th>Aktueller Preis (USD)</th>
          <th>Gewinn / Verlust</th>
          <th>Kaufdatum</th>
          <th>Verkauf</th>
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

          <td *ngIf="trade.currentPriceUsd"
              [ngClass]="{
                'text-success': trade.currentPriceUsd > trade.buyPriceUsd,
                'text-danger': trade.currentPriceUsd < trade.buyPriceUsd
              }">
            {{ ((trade.currentPriceUsd - trade.buyPriceUsd) * trade.quantity) | number:'1.2-2' }}
          </td>
          <td *ngIf="!trade.currentPriceUsd" class="text-muted">–</td>

          <td>{{ trade.createdAt | date:'short' }}</td>

          <td>
            <div class="d-flex align-items-center gap-2">
              <input
                type="number"
                min="0"
                step="any"
                [(ngModel)]="trade.sellQuantity"
                [max]="trade.quantity"
                class="form-control form-control-sm"
                placeholder="Menge"
                style="width: 90px;"
              />
              <button
                class="btn btn-sm btn-danger"
                [disabled]="!isValidSellAmount(trade)"
                (click)="sell(trade)"
              >
                Verkaufen
              </button>
            </div>
            <div *ngIf="trade.sellQuantity && trade.sellQuantity > trade.quantity" class="text-danger small mt-1">
              Menge zu hoch!
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div *ngIf="heldTrades.length === 0 && !isLoading" class="text-muted">
      Keine gehaltenen Assets vorhanden.
    </div>
  `,
  styles: [`
    table {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.05);
    }
    th, td {
      color: #f8f9fa;
    }
    .form-control {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .form-control:focus {
      background: rgba(255, 255, 255, 0.15);
      outline: none;
      border-color: #007bff;
    }
  `]
})
export class PortfolioPageComponent implements OnInit {
  heldTrades: HeldTradeWithPrice[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.loadPortfolio();
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
            this.heldTrades = withSell.map((t, i) => ({
              ...t,
              currentPriceUsd: prices[i].price 
            }));
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Fehler beim Laden der Preise:', err);
            this.error = 'Preise konnten nicht geladen werden.';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.error = 'Portfolio konnte nicht geladen werden.';
        this.isLoading = false;
        console.error(err);
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

    this.portfolioService.sellAsset(trade.assetSymbol, amount).subscribe({
      next: (response) => {
        console.log('Verkauf erfolgreich:', response);
        alert(`${amount} ${trade.assetSymbol} erfolgreich verkauft!`);
        this.loadPortfolio();
      },
      error: (err) => {
        console.error('Verkauf fehlgeschlagen:', err);
        alert(`Verkauf fehlgeschlagen: ${err.error?.message || err.message}`);
      }
    });
  }
}
