import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketStore } from '../store/market.store';
import { MarketCardComponent } from '../components/market-card/market-card.component';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-market-page',
  imports: [CommonModule, MarketCardComponent, RouterLink],
  template: `
    <h1>Market</h1>

    <div *ngIf="store.loading()" class="alert alert-info py-2">Lade Symbole…</div>
    <div *ngIf="store.error()" class="alert alert-danger py-2">{{ store.error() }}</div>

    <div class="row">
      <div class="col-12 col-sm-6 col-md-4 mb-3" *ngFor="let s of store.symbols()">
        <a [routerLink]="['/market', s.symbol]" class="link-plain">
          <app-market-card
            [name]="s.name"
            [symbol]="s.symbol"
            [priceUsd]="store.quotes()[s.symbol]?.priceUsd ?? null"
            [changePct]="store.quotes()[s.symbol]?.changePct">
          </app-market-card>
        </a>
      </div>
    </div>
  `
})
export class MarketPageComponent implements OnInit {
  readonly store = inject(MarketStore);
  ngOnInit(): void {
    if (!this.store.hasData()) this.store.loadSymbols();
  }
}
