import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketSymbol, MarketPrice } from '../../data-access/market.port';

/**
 * Presentational component for displaying a market symbol card
 * Props: symbol (MarketSymbol), price (optional MarketPrice), loading
 * Events: select
 */
@Component({
  standalone: true,
  selector: 'app-market-card',
  imports: [CommonModule],
  template: `
    <div class="market-card" [class.market-card--loading]="loading">
      <!-- Header: Icon + Name | Symbol -->
      <div class="header">
        <div class="symbol-icon icon-{{symbol.symbol.toLowerCase()}}">
          <span>♦</span>
        </div>
        <span class="asset-name">{{ symbol.name }}</span>
        <span class="separator">|</span>
        <span class="ticker">{{ symbol.symbol }}</span>
      </div>

      <!-- Price Section -->
      <div class="price-section">
        <!-- Loading State -->
        <div *ngIf="loading" class="skeleton-loader">
          <div class="skeleton-box skeleton-price"></div>
        </div>

        <!-- Price Available -->
        <div *ngIf="!loading && price" class="price-content">
          <div class="price-value">
            {{ price.price | number:'1.2-2' }}
            <span class="price-currency">USD</span>
          </div>
        </div>

        <!-- No Price -->
        <div *ngIf="!loading && !price" class="no-price">—</div>
      </div>

      <!-- Change Indicator -->
      <div *ngIf="!loading && price && price.changePct !== undefined && price.changePct !== null"
           class="change-indicator"
           [class.change-indicator--positive]="price.changePct > 0"
           [class.change-indicator--negative]="price.changePct < 0"
           [class.change-indicator--neutral]="price.changePct === 0">
        <span *ngIf="price.changePct > 0">↑</span>
        <span *ngIf="price.changePct < 0">↓</span>
        <span *ngIf="price.changePct === 0">→</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .market-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 160px;
      padding: 1.25rem 1rem;
      background: linear-gradient(180deg, #000000 0%, #1a1a1a 50%, #0d0d0d 100%);
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.15s ease-out;
      color: white;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
    }

    .market-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      transform: translateY(-2px);
    }

    .market-card--loading {
      opacity: 0.85;
    }

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .symbol-icon {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
      margin-right: 0.5rem;
    }

    .icon-xag {
      background: #c0c0c0;
      color: #1f2937;
    }

    .icon-xau {
      background: #ffd700;
      color: #1f2937;
    }

    .icon-btc {
      background: #f7931a;
      color: #1f2937;
    }

    .icon-eth {
      background: #627eea;
      color: white;
    }

    .icon-xpd {
      background: #e5e4e2;
      color: #1f2937;
    }

    .icon-hg {
      background: #b87333;
      color: white;
    }

    .asset-name {
      font-size: 1.625rem;
      font-weight: 600;
      line-height: 1;
      color: white;
      margin-right: 0.25rem;
    }

    .separator {
      font-size: 1.625rem;
      font-weight: 400;
      color: #9ca3af;
      margin-right: 0.25rem;
    }

    .ticker {
      font-size: 1.625rem;
      font-weight: 300;
      line-height: 1;
      color: #9ca3af;
    }

    .price-section {
      display: flex;
      flex-direction: column;
      margin-top: auto;
    }

    .price-content {
      display: flex;
      flex-direction: column;
    }

    .price-value {
      font-size: 1.625rem;
      font-weight: 500;
      line-height: 1;
      color: white;
    }

    .price-currency {
      font-size: 1rem;
      font-weight: 300;
      color: #9ca3af;
      margin-left: 0.25rem;
    }

    .no-price {
      font-size: 1.625rem;
      color: #6b7280;
      font-weight: 500;
    }

    .change-indicator {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      font-size: 1.5rem;
      font-weight: bold;
      transition: color 0.3s ease;
    }

    .change-indicator--positive {
      color: #22c55e; /* green - Preis gestiegen */
    }

    .change-indicator--negative {
      color: #ef4444; /* red - Preis gefallen */
    }

    .change-indicator--neutral {
      color: #9ca3af; /* gray - keine Änderung */
    }

    .skeleton-loader {
      display: flex;
      flex-direction: column;
    }

    .skeleton-box {
      background: #1f2937;
      border-radius: 0.25rem;
      animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .skeleton-price {
      height: 2rem;
      width: 45%;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class MarketCardComponent implements OnChanges {
  @Input() symbol!: MarketSymbol;
  @Input() price?: MarketPrice;
  @Input() loading: boolean = false;
  @Output() select = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['price'] && this.price) {
    }

    if (changes['loading']) {
    }
  }
}
