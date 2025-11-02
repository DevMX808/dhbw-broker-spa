import { Component, OnInit, NgZone } from '@angular/core';
import { PortfolioService } from '../data-access/portfolio.service';
import { HeldTrade } from '../models/held-trade.model';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

interface HeldTradeWithPrice extends HeldTrade {
  currentPriceUsd?: number;
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

  // Sell Modal
  showSellModal = false;
  selectedTrade: HeldTradeWithPrice | null = null;
  sellQuantity: number | null = null;
  isSelling = false;
  sellError = '';

  // Math für Template verfügbar machen
  Math = Math;

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
        const priceRequests = trades.map(t =>
          this.portfolioService.getCurrentPrice(t.assetSymbol)
        );

        forkJoin(priceRequests).subscribe({
          next: (prices) => {
            this.ngZone.run(() => {
              this.heldTrades = trades.map((t, i) => ({
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

  // ========== Add Funds Modal Functions ==========

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

  // ========== Sell Modal Functions ==========

  openSellModal(trade: HeldTradeWithPrice): void {
    this.selectedTrade = trade;
    this.sellQuantity = 0;
    this.sellError = '';
    this.showSellModal = true;
  }

  closeSellModal(): void {
    this.showSellModal = false;
    this.selectedTrade = null;
    this.sellQuantity = null;
    this.sellError = '';
  }

  setSellPercentage(percentage: number): void {
    if (!this.selectedTrade) return;
    const amount = (this.selectedTrade.quantity * percentage) / 100;
    this.sellQuantity = Math.round(amount * 10000) / 10000; // Auf 4 Dezimalstellen runden
    this.onSellQuantityChange();
  }

  incrementSellQuantity(): void {
    if (!this.selectedTrade) return;
    const step = this.getIncrementStep(this.selectedTrade.quantity);
    const currentValue = this.sellQuantity || 0;
    let newValue = currentValue + step;

    if (newValue > this.selectedTrade.quantity) {
      newValue = this.selectedTrade.quantity;
    }

    this.sellQuantity = Math.round(newValue * 10000) / 10000;
    this.onSellQuantityChange();
  }

  decrementSellQuantity(): void {
    if (!this.selectedTrade) return;
    const step = this.getIncrementStep(this.selectedTrade.quantity);
    const currentValue = this.sellQuantity || 0;
    let newValue = currentValue - step;

    if (newValue < 0) {
      newValue = 0;
    }

    this.sellQuantity = Math.round(newValue * 10000) / 10000;
    this.onSellQuantityChange();
  }

  onSellQuantityChange(): void {
    if (!this.selectedTrade) return;

    if (this.sellQuantity === null || this.sellQuantity === undefined) {
      this.sellQuantity = 0;
      this.sellError = '';
      return;
    }

    if (this.sellQuantity < 0) {
      this.sellQuantity = 0;
    }

    if (this.sellQuantity > this.selectedTrade.quantity) {
      this.sellQuantity = this.selectedTrade.quantity;
      this.sellError = `Maximal ${this.selectedTrade.quantity} verfügbar.`;
      return;
    }

    this.sellError = '';
  }

  getSellPreviewProfitLoss(): number {
    if (!this.selectedTrade || !this.sellQuantity || !this.selectedTrade.currentPriceUsd) {
      return 0;
    }
    return (this.selectedTrade.currentPriceUsd - this.selectedTrade.buyPriceUsd) * this.sellQuantity;
  }

  getSellTotalValue(): number {
    if (!this.selectedTrade || !this.sellQuantity || !this.selectedTrade.currentPriceUsd) {
      return 0;
    }
    return this.selectedTrade.currentPriceUsd * this.sellQuantity;
  }

  canSubmitSell(): boolean {
    return (
      !this.isSelling &&
      !!this.selectedTrade &&
      this.sellQuantity !== null &&
      this.sellQuantity > 0 &&
      this.sellQuantity <= this.selectedTrade.quantity &&
      !this.sellError
    );
  }

  confirmSell(): void {
    if (!this.canSubmitSell() || !this.selectedTrade) {
      return;
    }

    const amount = this.sellQuantity as number;
    const symbol = this.selectedTrade.assetSymbol;

    this.isSelling = true;

    this.portfolioService.sellAsset(symbol, amount).subscribe({
      next: () => {
        this.isSelling = false;
        this.closeSellModal();
        this.loadPortfolio();
        this.loadBalance();
        alert(`Erfolgreich ${amount} ${symbol} verkauft!`);
      },
      error: (err) => {
        this.isSelling = false;
        console.error('Verkauf fehlgeschlagen:', err);
        this.sellError = err.error?.message || err.message || 'Verkauf fehlgeschlagen';
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
