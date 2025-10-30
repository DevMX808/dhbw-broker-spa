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
            <button class="btn btn-sm btn-danger" (click)="sell(trade)">
              Alles verkaufen
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

  sell(trade: HeldTrade): void {
    if (!confirm(`Wollen Sie wirklich ${trade.quantity} ${trade.assetSymbol} verkaufen?`)) {
      return;
    }
    
    console.log('Selling:', {
      assetSymbol: trade.assetSymbol,
      quantity: trade.quantity,
      side: 'SELL'
    });
    
    this.portfolioService.sellAsset(trade.assetSymbol, trade.quantity).subscribe({
      next: (response) => {
        console.log('Verkauf erfolgreich:', response);
        alert(`${trade.quantity} ${trade.assetSymbol} erfolgreich verkauft!`);
        this.loadPortfolio(); // Portfolio neu laden
      },
      error: (err) => {
        console.error('Verkauf fehlgeschlagen:', err);
        console.error('Error details:', err.error);
        alert(`Verkauf fehlgeschlagen: ${err.error || err.message}`);
      }
    });
  }
}
