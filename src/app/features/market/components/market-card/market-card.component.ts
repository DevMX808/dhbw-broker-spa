// src/app/features/market/components/market-card/market-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-market-card',
  imports: [CommonModule],
  template: `
    <div class="card h-100 shadow-sm">
      <div class="border-mask">
        <div class="border-glow"></div>
      </div>
      <div class="card-body">
        <div class="d-flex align-items-center mb-2">
          <div class="placeholder-icon mr-2"><span>◈</span></div>
          <div class="flex-grow-1">
            <div class="d-flex flex-wrap align-items-baseline"> <!-- Geändert zu baseline für genaue Linienausrichtung -->
              <span class="font-weight-bold mr-2">{{ name }}</span>
              <span class="text-muted mx-2">|</span>
              <span class="text-uppercase text-monospace symbol">{{ symbol }}</span> <!-- Neue Klasse 'symbol' für gezieltes Styling -->
            </div>
          </div>
        </div>

        <div class="d-flex align-items-baseline">
          <div class="h4 mb-0 mr-2">{{ priceUsd | number:'1.2-2' }}</div>
          <div class="text-muted">USD</div>
        </div>

        <div class="mt-1" *ngIf="changePct !== undefined; else noChange">
          <span [ngClass]="changePct! >= 0 ? 'text-success' : 'text-danger'">
            {{ changePct! >= 0 ? '+' : '−' }}{{ abs(changePct!) | number:'1.2-2' }}%
          </span>
        </div>
        <ng-template #noChange>
          <div class="text-muted small">—</div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .placeholder-icon {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: rgba(255,255,255,.08);
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 14px; line-height: 1; user-select: none;
    }
    .symbol {
      vertical-align: baseline; /* Fix für genaue Ausrichtung */
      line-height: 1; /* Konsistente Zeilenhöhe, um Verschiebungen zu vermeiden */
      font-size: 0.95em; /* Optional: Leicht kleiner für subtilen Look, ohne overwhelming */
    }
  `]
})
export class MarketCardComponent {
  @Input() name = '';
  @Input() symbol = '';
  @Input() priceUsd: number | null = null;
  @Input() changePct?: number;
  abs(v: number) { return Math.abs(v); }
}
