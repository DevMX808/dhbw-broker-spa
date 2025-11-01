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
  private lastSpokenText = '';

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
    this.stopSpeech();
  }

  async onRetry(): Promise<void> {
    await this.store.loadSymbols();
  }

  onAlexaLaunch(): void {
    this.alexaError = '';
    this.alexaLoading = true;
    this.stopSpeech();
    this.alexaService.launch().subscribe({
      next: (res) => {
        this.alexaLoading = false;
        const text = this.extractSpeech(res);
        this.alexaOutput = text;
        this.lastSpokenText = text;
        this.speak(text);
      },
      error: (err) => {
        this.alexaLoading = false;
        this.alexaError = 'Alexa-Launch konnte nicht geladen werden.';
        console.error(err);
      }
    });
  }

  onAlexaAll(): void {
    this.alexaError = '';
    this.alexaLoading = true;
    this.stopSpeech();
    this.alexaService.readAllPrices().subscribe({
      next: (res) => {
        this.alexaLoading = false;
        const text = this.extractSpeech(res);
        this.alexaOutput = text;
        this.lastSpokenText = text;
        this.speak(text);
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
    this.stopSpeech();
    this.alexaService.readSingleAsset(asset).subscribe({
      next: (res) => {
        this.alexaLoading = false;
        const text = this.extractSpeech(res);
        this.alexaOutput = text;
        this.lastSpokenText = text;
        this.speak(text);
      },
      error: (err) => {
        this.alexaLoading = false;
        this.alexaError = 'Alexa-Ausgabe konnte nicht geladen werden.';
        console.error(err);
      }
    });
  }

  onAlexaRepeat(): void {
    if (!this.lastSpokenText) {
      return;
    }
    this.stopSpeech();
    this.speak(this.lastSpokenText);
  }

  private extractSpeech(res: AlexaResponse): string {
    const body = res?.response;
    if (!body) {
      return '';
    }

    const speech = body.outputSpeech;
    if (speech) {
      if (speech.type === 'PlainText' && speech.text) {
        return speech.text;
      }
      if (speech.type === 'SSML' && speech.ssml) {
        return speech.ssml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }

    if (body.reprompt && body.reprompt.outputSpeech) {
      const r = body.reprompt.outputSpeech;
      if (r.type === 'PlainText' && r.text) {
        return r.text;
      }
      if (r.type === 'SSML' && r.ssml) {
        return r.ssml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }

    return '';
  }

  private speak(text: string): void {
    if (!text) return;
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis nicht verfügbar');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  private stopSpeech(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
