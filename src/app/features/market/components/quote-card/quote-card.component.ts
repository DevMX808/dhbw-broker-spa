import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface QuoteVM {
  symbol: string;
  name: string;
  priceUsd: number;
  updatedAt: Date;
}

@Component({
  standalone: true,
  selector: 'app-quote-card',
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <div class="h5 mb-1">{{ vm?.name }} <small class="text-muted">({{ vm?.symbol }})</small></div>
          <div class="text-muted small">
            Last update: {{ vm?.updatedAt | date:'medium' }}
          </div>
        </div>
        <div class="display-4 mb-0" style="font-size:2rem;">
          {{ vm?.priceUsd | number:'1.2-2' }} <span class="h6 text-muted">USD</span>
        </div>
      </div>
    </div>
  `
})
export class QuoteCardComponent {
  @Input() vm: QuoteVM | null = null;
}
