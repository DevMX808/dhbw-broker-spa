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
  templateUrl: './market-list.component.html',
  styleUrls: ['./market-list.component.scss']
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
