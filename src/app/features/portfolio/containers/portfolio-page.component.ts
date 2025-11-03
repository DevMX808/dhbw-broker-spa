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

  // Verkaufs-Modal State
  showSellModal = false;
  selectedTrade: HeldTradeWithPrice | null = null;
  sellModalQuantity: number | null = null;
  sellModalError = '';

  // Message System
  message: string = '';
  messageType: 'success' | 'error' | null = null;

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
        const withSell = trades.map(t => ({ ...t, sellQuantity: 0 }));

        const priceRequests = withSell.map(t =>
          this.portfolioService.getCurrentPrice(t.assetSymbol)
        );

        forkJoin(priceRequests).subscribe({
          next: (prices) => {
            this.ngZone.run(() => {
              this.heldTrades = withSell.map((t, i) => ({
                ...t,
                assetName: prices[i].name,
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

  getTotalBuyPrice(trade: HeldTradeWithPrice): number {
    return trade.buyPriceUsd * trade.quantity;
  }

  getCurrentTotalValue(trade: HeldTradeWithPrice): number {
    if (!trade.currentPriceUsd) return 0;
    return trade.currentPriceUsd * trade.quantity;
  }

  getTotalProfitLoss(trade: HeldTradeWithPrice): number {
    if (!trade.currentPriceUsd) return 0;
    return this.getCurrentTotalValue(trade) - this.getTotalBuyPrice(trade);
  }

  getIncrementStep(quantity: number): number {
    if (quantity < 0.1) return 0.01;
    if (quantity < 1) return 0.1;
    return 1;
  }

  incrementSellQuantity(trade: HeldTradeWithPrice): void {
    const step = this.getIncrementStep(trade.quantity);
    const currentValue = trade.sellQuantity || 0;
    let newValue = currentValue + step;

    if (newValue > trade.quantity) {
      newValue = trade.quantity;
    }

    trade.sellQuantity = Math.round(newValue * 100) / 100;
  }

  decrementSellQuantity(trade: HeldTradeWithPrice): void {
    const step = this.getIncrementStep(trade.quantity);
    const currentValue = trade.sellQuantity || 0;
    let newValue = currentValue - step;

    if (newValue < 0) {
      newValue = 0;
    }

    trade.sellQuantity = Math.round(newValue * 100) / 100;
  }

  onSellQuantityChange(trade: HeldTradeWithPrice): void {
    if (trade.sellQuantity === null || trade.sellQuantity === undefined) {
      trade.sellQuantity = 0;
      return;
    }

    if (trade.sellQuantity < 0) {
      trade.sellQuantity = 0;
    }
    if (trade.sellQuantity > trade.quantity) {
      trade.sellQuantity = trade.quantity;
    }
  }

  onSellQuantityBlur(trade: HeldTradeWithPrice): void {
    this.onSellQuantityChange(trade);
  }

  onSellQuantityKeydown(event: KeyboardEvent, trade: HeldTradeWithPrice): void {
    const input = event.target as HTMLInputElement;

    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      '.', ',', 'Home', 'End'];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;
    const newValue =
      input.value.substring(0, selectionStart) +
      event.key +
      input.value.substring(selectionEnd);

    const numericValue = parseFloat(newValue);

    if (!isNaN(numericValue) && numericValue > trade.quantity) {
      event.preventDefault();
    }
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;

    setTimeout(() => {
      this.message = '';
      this.messageType = null;
    }, 5000);
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

  openSellModal(trade: HeldTradeWithPrice): void {
    this.selectedTrade = trade;
    this.sellModalQuantity = trade.sellQuantity || 0;
    this.sellModalError = '';
    this.showSellModal = true;
  }

  closeSellModal(): void {
    this.showSellModal = false;
    this.selectedTrade = null;
    this.sellModalQuantity = null;
    this.sellModalError = '';
  }

  setSellModalQuantity(value: number): void {
    this.onSellModalQuantityChange(value);
  }

  onSellModalQuantityChange(value: number): void {
    if (!this.selectedTrade) return;

    if (value == null) {
      this.sellModalQuantity = null;
      this.sellModalError = '';
      return;
    }

    if (value < 0) {
      this.sellModalQuantity = 0;
      this.sellModalError = 'Menge muss positiv sein.';
      return;
    }

    if (value > this.selectedTrade.quantity) {
      this.sellModalQuantity = this.selectedTrade.quantity;
      this.sellModalError = `Maximale Menge: ${this.selectedTrade.quantity}`;
      return;
    }

    this.sellModalQuantity = value;
    this.sellModalError = '';
  }

  canSubmitSell(): boolean {
    return (
      !!this.selectedTrade &&
      !this.selectedTrade.isSelling &&
      this.sellModalQuantity !== null &&
      this.sellModalQuantity > 0 &&
      this.sellModalQuantity <= this.selectedTrade.quantity &&
      !this.sellModalError
    );
  }

  getSellModalStep(): number {
    if (!this.selectedTrade) return 1;
    return this.getIncrementStep(this.selectedTrade.quantity);
  }

  getSellModalPreviewProfit(): number {
    if (!this.selectedTrade || !this.selectedTrade.currentPriceUsd || !this.sellModalQuantity) {
      return 0;
    }
    return (this.selectedTrade.currentPriceUsd - this.selectedTrade.buyPriceUsd) * this.sellModalQuantity;
  }

  sell(trade: HeldTradeWithPrice): void {
    if (!this.selectedTrade || !this.sellModalQuantity) return;

    const amount = this.sellModalQuantity;

    if (amount <= 0) {
      this.sellModalError = 'Bitte eine gültige Menge eingeben.';
      return;
    }

    if (amount > this.selectedTrade.quantity) {
      this.sellModalError = 'Sie können nicht mehr verkaufen, als Sie besitzen.';
      return;
    }

    this.selectedTrade.isSelling = true;

    this.portfolioService.sellAsset(this.selectedTrade.assetSymbol, amount).subscribe({
      next: () => {
        if (this.selectedTrade) {
          this.selectedTrade.isSelling = false;
        }
        const symbol = this.selectedTrade?.assetSymbol || '';
        this.closeSellModal();
        this.loadPortfolio();
        this.loadBalance();
        this.showMessage(`Erfolgreich ${amount} ${symbol} verkauft!`, 'success');
      },
      error: (err) => {
        if (this.selectedTrade) {
          this.selectedTrade.isSelling = false;
        }
        console.error('Verkauf fehlgeschlagen:', err);
        const errorMsg = err.error?.message || err.message || 'Verkauf fehlgeschlagen';
        this.showMessage(errorMsg, 'error');
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
        this.showMessage(
          `Erfolgreich $${response.addedAmount} hinzugefügt! Neues Guthaben: $${response.newBalance}`,
          'success'
        );
      },
      error: (err) => {
        this.addingFunds = false;
        console.error('Guthaben hinzufügen fehlgeschlagen:', err);
        const errorMsg = err.error?.error || err.message || 'Fehler beim Aufladen';
        this.showMessage(errorMsg, 'error');
      }
    });
  }
}
