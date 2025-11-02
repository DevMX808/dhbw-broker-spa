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
  templateUrl: './portfolio-page.component.html',
  styleUrls: ['./portfolio-page.component.scss']
})
export class PortfolioPageComponent implements OnInit {
  heldTrades: HeldTradeWithPrice[] = [];
  isLoading = false;
  error: string | null = null;
  walletBalance = 0;
  balanceLoading = false;

  showAddFundsModal = false;
  addFundsAmount: number | null = null;
  addingFunds = false;

  readonly addFundsMin = 1;
  readonly addFundsMax = 10000;
  addFundsError = '';

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
                assetName: prices[i].name, // Asset-Namen von der API übernehmen
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

  // Berechnet den Gesamtkaufpreis (Kaufpreis * Menge)
  getTotalBuyPrice(trade: HeldTradeWithPrice): number {
    return trade.buyPriceUsd * trade.quantity;
  }

  // Berechnet den aktuellen Gesamtwert (Aktueller Preis * Menge)
  getCurrentTotalValue(trade: HeldTradeWithPrice): number {
    if (!trade.currentPriceUsd) return 0;
    return trade.currentPriceUsd * trade.quantity;
  }

  // Berechnet Gewinn/Verlust gesamt
  getTotalProfitLoss(trade: HeldTradeWithPrice): number {
    if (!trade.currentPriceUsd) return 0;
    return this.getCurrentTotalValue(trade) - this.getTotalBuyPrice(trade);
  }

  // Ermittelt den passenden Increment-Step basierend auf der Menge
  getIncrementStep(quantity: number): number {
    if (quantity < 0.1) return 0.01;
    if (quantity < 1) return 0.1;
    return 1;
  }

  // Increment-Funktion für Verkaufsmenge
  incrementSellQuantity(trade: HeldTradeWithPrice): void {
    const step = this.getIncrementStep(trade.quantity);
    const currentValue = trade.sellQuantity || 0;
    let newValue = currentValue + step;

    // Auf max. verfügbare Menge begrenzen
    if (newValue > trade.quantity) {
      newValue = trade.quantity;
    }

    // Auf 2 Dezimalstellen runden
    trade.sellQuantity = Math.round(newValue * 100) / 100;
  }

  // Decrement-Funktion für Verkaufsmenge
  decrementSellQuantity(trade: HeldTradeWithPrice): void {
    const step = this.getIncrementStep(trade.quantity);
    const currentValue = trade.sellQuantity || 0;
    let newValue = currentValue - step;

    // Nicht kleiner als 0
    if (newValue < 0) {
      newValue = 0;
    }

    // Auf 2 Dezimalstellen runden
    trade.sellQuantity = Math.round(newValue * 100) / 100;
  }

  // Validierung und Begrenzung bei manueller Eingabe
  onSellQuantityChange(trade: HeldTradeWithPrice): void {
    if (trade.sellQuantity === null || trade.sellQuantity === undefined) {
      trade.sellQuantity = 0;
      return;
    }

    // Auf min/max begrenzen
    if (trade.sellQuantity < 0) {
      trade.sellQuantity = 0;
    }
    if (trade.sellQuantity > trade.quantity) {
      trade.sellQuantity = trade.quantity;
    }
  }

  openAddFundsModal(): void {
    this.addFundsAmount = 100;
    this.addFundsError = '';
    this.showAddFundsModal = true;
  }

  closeAddFundsModal(): void {
    this.showAddFundsModal = false;
    this.addFundsAmount = null;
    this.addFundsError = '';
  }

  setAddFundsAmount(value: number): void {
    this.onAddFundsAmountChange(value);
  }

  onAddFundsAmountChange(value: number): void {
    if (value == null) {
      this.addFundsAmount = null;
      this.addFundsError = '';
      return;
    }

    if (value < this.addFundsMin) {
      this.addFundsAmount = this.addFundsMin;
      this.addFundsError = `Betrag mindestens ${this.addFundsMin} USD.`;
      return;
    }

    if (value > this.addFundsMax) {
      this.addFundsAmount = this.addFundsMax;
      this.addFundsError = `Betrag höchstens ${this.addFundsMax} USD.`;
      return;
    }

    this.addFundsAmount = value;
    this.addFundsError = '';
  }

  canSubmitAddFunds(): boolean {
    return (
      !this.addingFunds &&
      this.addFundsAmount !== null &&
      this.addFundsAmount >= this.addFundsMin &&
      this.addFundsAmount <= this.addFundsMax &&
      !this.addFundsError
    );
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
        this.loadPortfolio();
        this.loadBalance();
      },
      error: (err) => {
        trade.isSelling = false;
        console.error('Verkauf fehlgeschlagen:', err);
        alert(`Verkauf fehlgeschlagen: ${err.error?.message || err.message}`);
      }
    });
  }

  addFunds(): void {
    if (!this.canSubmitAddFunds()) {
      return;
    }

    this.addingFunds = true;

    this.portfolioService.addFunds(this.addFundsAmount as number).subscribe({
      next: (response) => {
        this.addingFunds = false;
        this.showAddFundsModal = false;
        this.walletBalance = response.newBalance;
        this.addFundsAmount = null;
        this.addFundsError = '';
        alert(`Erfolgreich $${response.addedAmount} hinzugefügt! Neues Guthaben: $${response.newBalance}`);
      },
      error: (err) => {
        this.addingFunds = false;
        console.error('Guthaben hinzufügen fehlgeschlagen:', err);
        alert(`Fehler: ${err.error?.error || err.message}`);
      }
    });
  }
}
