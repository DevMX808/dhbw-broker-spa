// src/app/features/market/containers/asset-detail-page.component.ts
import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MarketDataService } from '../data-access/market-data.service';
import { switchMap, map, timer, distinctUntilChanged, tap, catchError, of } from 'rxjs';
import { QuoteCardComponent, QuoteVM } from '../components/quote-card/quote-card.component';

@Component({
  standalone: true,
  selector: 'app-asset-detail-page',
  imports: [CommonModule, QuoteCardComponent],
  template: `
    <h1 class="h4 mb-3">Asset</h1>

    <div class="d-flex align-items-center mb-3">
      <div class="mr-2 text-muted">Symbol:</div>
      <strong class="mr-3">{{ symbol() }}</strong>
      <button class="btn btn-outline-primary btn-sm" (click)="refresh()" [disabled]="loading()">Refresh</button>
    </div>

    <div *ngIf="loading()" class="alert alert-info py-2">Lade Quote…</div>
    <div *ngIf="error()" class="alert alert-danger py-2">{{ error() }}</div>

    <app-quote-card *ngIf="quote()" [vm]="quote()"></app-quote-card>

    <p class="text-muted small mt-3 mb-0">Automatische Aktualisierung alle 60 Sekunden.</p>
  `
})
export class AssetDetailPageComponent {
  private route = inject(ActivatedRoute);
  private api = inject(MarketDataService);

  readonly symbol = signal<string>('');
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly quote = signal<QuoteVM | null>(null);

  private manualTick = signal<number>(0);
  readonly pollKey = computed(() => `${this.symbol()}#${this.manualTick()}`);

  constructor() {
    // Symbol aus Route lesen
    this.route.paramMap
      .pipe(
        map(pm => (pm.get('symbol') ?? '').toUpperCase().trim()),
        distinctUntilChanged(),
        tap(sym => { this.symbol.set(sym); this.quote.set(null); this.error.set(null); })
      )
      .subscribe();

    // Effekt: startet Polling bei Änderung von symbol() oder manualTick()
    effect((onCleanup) => {
      void this.pollKey();    // <-- Dependency registrieren
      const sym = this.symbol();
      if (!sym) return;

      const sub = timer(0, 60000).pipe(
        tap(() => this.loading.set(true)),
        switchMap(() =>
          this.api.getQuote(sym).pipe(
            tap(q => {
              this.quote.set({
                symbol: q.symbol,
                name: q.name,
                priceUsd: q.priceUsd,
                updatedAt: q.updatedAt
              });
              this.error.set(null);
            }),
            catchError(err => {
              console.error('[AssetDetail] getQuote failed', err);
              this.error.set('Konnte Quote nicht laden.');
              return of(null);
            })
          )
        ),
        tap(() => this.loading.set(false))
      ).subscribe();

      // Bei erneuter Ausführung/Destroy sauber aufräumen
      onCleanup(() => sub.unsubscribe());
    });
  }

  refresh() {
    this.manualTick.set(this.manualTick() + 1);
  }
}
