import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketStore } from '../store/market.store';
import { MarketListComponent } from '../components/market-list/market-list.component';
import { AuthService } from '../../../core/auth/auth.service';
import { AlexaService, AlexaResponse } from '../../../core/http/alexa.service';

@Component({
  standalone: true,
  selector: 'app-market-page',
  imports: [CommonModule, FormsModule, MarketListComponent],
  templateUrl: './market-page.component.html',
  styleUrls: ['./market-page.component.scss']
})
export class MarketPageComponent implements OnInit, OnDestroy {
  readonly store = inject(MarketStore);
  private readonly authService = inject(AuthService);
  private readonly alexaService = inject(AlexaService);

  alexaOutput = '';
  alexaLoading = false;
  alexaError = '';
  alexaAsset = '';

  get firstName(): string {
    return this.authService.user()?.firstName || 'Gast';
  }

  get lastName(): string {
    return this.authService.user()?.lastName || '';
  }

  async ngOnInit(): Promise<void> {
    if (!this.store.hasData()) {
      await this.store.loadSymbols();

      const symbolsToPreload = this.store.symbols().slice(0, 6).map(s => s.symbol);
      if (symbolsToPreload.length > 0) {
        await this.store.prefetchPrices(symbolsToPreload);
      }
    }

    this.store.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.store.stopAutoRefresh();
  }

  async onRetry(): Promise<void> {
    await this.store.loadSymbols();
  }

  onAlexaAll(): void {
    this.alexaError = '';
    this.alexaLoading = true;
    this.alexaService.readAllPrices().subscribe({
      next: (res) => {
        this.alexaLoading = false;
        this.alexaOutput = this.extractSpeech(res);
      },
      error: (err) => {
        this.alexaLoading = false;
        this.alexaError = 'Alexa-Ausgabe konnte nicht geladen werden.';
        console.error(err);
      }
    });
  }

  onAlexaSingle(): void {
    const asset = this.alexaAsset?.trim();
    if (!asset) {
      this.alexaError = 'Bitte zuerst ein Asset angeben.';
      return;
    }
    this.alexaError = '';
    this.alexaLoading = true;
    this.alexaService.readSingleAsset(asset).subscribe({
      next: (res) => {
        this.alexaLoading = false;
        this.alexaOutput = this.extractSpeech(res);
      },
      error: (err) => {
        this.alexaLoading = false;
        this.alexaError = 'Alexa-Ausgabe konnte nicht geladen werden.';
        console.error(err);
      }
    });
  }

  private extractSpeech(res: AlexaResponse): string {
    const speech = res?.response?.outputSpeech;
    if (!speech) {
      return '';
    }
    if (speech.type === 'PlainText') {
      return speech.text ?? '';
    }
    if (speech.type === 'SSML') {
      return (speech.ssml ?? '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    return '';
  }
}
