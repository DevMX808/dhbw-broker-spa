import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarketSymbol, MarketPrice } from '../../data-access/market.port';
import { MarketCardComponent } from '../market-card/market-card.component';

/**
 * Presentational component for displaying a list/grid of market symbols
 * Props: symbols, pricesBySymbol, loading, error
 * Events: selectSymbol, retry
 */
@Component({
  standalone: true,
  selector: 'app-market-list',
  imports: [CommonModule, RouterLink, MarketCardComponent],
  template: `
    <!-- Loading State: Skeleton Grid -->
    <div *ngIf="loading" class="market-grid">
      <div *ngFor="let _ of skeletonArray" class="market-grid-item">
        <div class="card h-100">
          <div class="card-body">
            <div class="skeleton-box mb-2" style="height: 24px; width: 70%;"></div>
            <div class="skeleton-box mb-3" style="height: 16px; width: 40%;"></div>
            <div class="skeleton-box" style="height: 32px; width: 50%;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div *ngIf="!loading && error" class="alert alert-danger d-flex align-items-center justify-content-between">
      <div>
        <strong>⚠️ Fehler:</strong> {{ error }}
      </div>
      <button class="btn btn-outline-danger btn-sm" (click)="onRetry()">
        Erneut versuchen
      </button>
    </div>

    <!-- Empty State -->
    <div *ngIf="!loading && !error && symbols.length === 0" class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>Keine Symbole verfügbar</h3>
      <p class="text-muted">Derzeit sind keine handelbaren Symbole verfügbar.</p>
    </div>

    <!-- Success State: Grid of Cards -->
    <div *ngIf="!loading && !error && symbols.length > 0" class="market-grid">
      <div *ngFor="let symbol of symbols" class="market-grid-item">
        <a [routerLink]="['/market', symbol.symbol]" class="card-link">
          <app-market-card
            [symbol]="symbol"
            [price]="pricesBySymbol[symbol.symbol]"
            [loading]="isLoadingPrice(symbol.symbol)">
          </app-market-card>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .market-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin: 1.5rem 0;
    }

    .market-grid-item {
      min-height: 160px;
    }

    .card-link {
      text-decoration: none;
      color: inherit;
      display: block;
      height: 100%;
    }

    .card-link:hover {
      text-decoration: none;
    }

    .skeleton-box {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      font-size: 1rem;
      margin-bottom: 0;
    }

    @media (max-width: 768px) {
      .market-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 1rem;
      }
    }

    @media (max-width: 576px) {
      .market-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MarketListComponent implements OnChanges {
  @Input() symbols: MarketSymbol[] = [];
  @Input() pricesBySymbol: Record<string, MarketPrice> = {};
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() loadingPrices: Record<string, boolean> = {};

  @Output() selectSymbol = new EventEmitter<string>();
  @Output() retry = new EventEmitter<void>();

  readonly skeletonArray = Array(6).fill(0);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pricesBySymbol']) {
      const symbols = Object.keys(this.pricesBySymbol);
    }

    if (changes['symbols']) {
    }

    if (changes['loading']) {
    }
  }

  isLoadingPrice(symbol: string): boolean {
    return this.loadingPrices[symbol] ?? false;
  }

  onRetry(): void {
    this.retry.emit();
  }
}

