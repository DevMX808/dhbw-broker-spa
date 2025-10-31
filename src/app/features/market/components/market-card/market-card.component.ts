import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';  // Neu: ChangeDetectionStrategy importieren
import { CommonModule } from '@angular/common';
import { MarketSymbol, MarketPrice } from '../../data-access/market.port';

@Component({
  standalone: true,
  selector: 'app-market-card',
  imports: [CommonModule],
  templateUrl: './market-card.component.html',
  styleUrls: ['./market-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MarketCardComponent {
  @Input() symbol!: MarketSymbol;
  @Input() price?: MarketPrice;
  @Input() loading: boolean = false;
  @Output() select = new EventEmitter<string>();
}
