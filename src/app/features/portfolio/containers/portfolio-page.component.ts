import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../data-access/portfolio.service';
import { HeldTrade } from '../models/held-trade.model';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';  // WICHTIG

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe],   // <--- hier eintragen
  template: `
    <h1 class="h4 mb-4">Mein Portfolio</h1>

    <div *ngIf="isLoading" class="text-muted">Lade Portfolio...</div>

    <div *ngIf="error" class="alert alert-danger">
      Fehler beim Laden: {{ error }}
    </div>

    <table *ngIf="heldTrades.length > 0" class="table table-striped">
      <thead>
        <tr>
          <th>Asset</th>
          <th>Menge</th>
          <th>Kaufpreis (USD)</th>
          <th>Kaufdatum</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let trade of heldTrades">
          <td>{{ trade.assetSymbol }}</td>
          <td>{{ trade.quantity }}</td>
          <td>{{ trade.buyPriceUsd | number:'1.2-2' }}</td>
          <td>{{ trade.createdAt | date:'short' }}</td>
          <td>
            <button class="btn btn-sm btn-danger" (click)="sell(trade.tradeId)">
              Verkaufen
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div *ngIf="heldTrades.length === 0 && !isLoading" class="text-muted">
      Keine gehaltenen Assets vorhanden.
    </div>
  `,
  styles: [`
    h1 {
      color: #ffffffff;
    }
    table {
      width: 100%;
    }
    .btn {
      min-width: 80px;
    }
  `]
})
export class PortfolioPageComponent implements OnInit {
  heldTrades: HeldTrade[] = [];
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
      next: (data) => {
        this.heldTrades = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Portfolio konnte nicht geladen werden.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  sell(tradeId: number): void {
    if (!confirm('Wollen Sie diesen Trade wirklich verkaufen?')) {
      return;
    }
    this.portfolioService.sellTrade(tradeId).subscribe({
      next: () => this.loadPortfolio(),
      error: (err) => {
        alert('Verkauf fehlgeschlagen!');
        console.error(err);
      }
    });
  }
}
