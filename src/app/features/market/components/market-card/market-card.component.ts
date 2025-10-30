import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketSymbol, MarketPrice } from '../../data-access/market.port';


@Component({
  standalone: true,
  selector: 'app-market-card',
  imports: [CommonModule],
  templateUrl: './market-card.component.html',
  styleUrls: ['./market-card.component.scss']
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
