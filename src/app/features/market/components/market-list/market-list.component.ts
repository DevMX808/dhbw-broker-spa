import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarketSymbol } from '../../data-access/market-data.models';

@Component({
  standalone: true,
  selector: 'app-market-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="!symbols?.length" class="text-muted">Keine Symbole vorhanden.</div>

    <div class="table-responsive" *ngIf="symbols?.length">
      <table class="table table-sm table-hover mb-0">
        <thead class="thead-light">
          <tr>
            <th style="width: 120px;">Symbol</th>
            <th>Name</th>
            <th style="width: 140px;"></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of symbols">
            <td class="font-weight-bold">{{ s.symbol }}</td>
            <td>{{ s.name }}</td>
            <td class="text-right">
              <a class="btn btn-outline-primary btn-sm" [routerLink]="['/market', s.symbol]">Details</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class MarketListComponent {
  @Input() symbols: MarketSymbol[] = [];
}
