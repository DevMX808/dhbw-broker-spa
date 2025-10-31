import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketPrice } from '../../data-access/market.port';

@Component({
  standalone: true,
  selector: 'app-price-card',
  imports: [CommonModule],
  template: `
    <div *ngIf="loading" class="card">
      <div class="card-body">
        <div class="skeleton-box mb-2" style="height: 32px; width: 60%;"></div>
        <div class="skeleton-box mb-3" style="height: 48px; width: 40%;"></div>
        <div class="skeleton-box" style="height: 20px; width: 30%;"></div>
      </div>
    </div>

    <div *ngIf="!loading && error" class="card border-danger">
      <div class="card-body">
        <div class="d-flex align-items-center mb-3">
          <span class="text-danger mr-2">⚠️</span>
          <h5 class="mb-0 text-danger">Fehler</h5>
        </div>
        <p class="mb-3">{{ error }}</p>
        <button
          class="btn btn-outline-danger btn-sm"
          (click)="onRefresh()"
          [disabled]="loading">
          Erneut versuchen
        </button>
      </div>
    </div>

    <div *ngIf="!loading && !error && price" class="card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 class="h4 mb-1">{{ price.name }}</h2>
            <div class="text-muted text-uppercase font-weight-bold" style="letter-spacing: 0.05em;">
              {{ price.symbol }}
            </div>
          </div>
          <button
            class="btn btn-outline-primary btn-sm"
            (click)="onRefresh()"
            [disabled]="loading"
            title="Aktualisieren">
            🔄 Aktualisieren
          </button>
        </div>

        <div class="price-display mb-3">
          <span class="price-value">{{ price.price | number:'1.2-4' }}</span>
          <span class="price-currency ml-2 text-muted">USD</span>
        </div>

        <div class="text-muted small">
          <span class="mr-3">
            <strong>Aktualisiert:</strong> {{ price.updatedAtReadable }}
          </span>
          <span class="text-muted" style="font-size: 0.85em;">
            ({{ price.updatedAt | date:'medium' }})
          </span>
        </div>
      </div>
    </div>

    <div *ngIf="!loading && !error && !price" class="card">
      <div class="card-body text-center py-5">
        <div class="text-muted mb-3" style="font-size: 3rem;">📊</div>
        <p class="text-muted mb-0">Keine Preisdaten verfügbar.</p>
      </div>
    </div>
  `,
  styles: [`
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

    .price-display {
      font-size: 2.5rem;
      font-weight: 300;
      line-height: 1.2;
    }

    .price-value {
      font-family: 'Courier New', monospace;
    }

    .price-currency {
      font-size: 1.5rem;
      vertical-align: baseline;
    }

    .card {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: none;
    }

    @media (max-width: 576px) {
      .price-display {
        font-size: 2rem;
      }
      .price-currency {
        font-size: 1.2rem;
      }
    }
  `]
})
export class PriceCardComponent {
  @Input() price: MarketPrice | null = null;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Output() refresh = new EventEmitter<void>();

  onRefresh(): void {
    this.refresh.emit();
  }
}

