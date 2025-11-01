import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

interface AlexaSlot {
  name: string;
  value: string;
}

interface AlexaIntent {
  name: string;
  slots?: Record<string, AlexaSlot>;
}

interface AlexaInnerRequest {
  type: string;
  intent?: AlexaIntent;
}

interface AlexaRequest {
  session?: {
    sessionId?: string;
    user?: {
      userId?: string;
    };
  };
  request: AlexaInnerRequest;
}

interface AlexaOutputSpeech {
  type: 'PlainText' | 'SSML';
  text?: string;
  ssml?: string;
}

interface AlexaResponseBody {
  outputSpeech: AlexaOutputSpeech;
  shouldEndSession?: boolean;
}

export interface AlexaResponse {
  version: string;
  response: AlexaResponseBody;
}

@Injectable({
  providedIn: 'root'
})
export class AlexaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = this.getBaseUrl();

  private getBaseUrl(): string {
    const isHeroku = window.location.hostname.includes('herokuapp.com');
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (isHeroku || (!isLocalhost && environment.production)) {
      return `${environment.apiBaseUrl}/integrations/alexa`;
    } else {
      return 'http://localhost:8080/integrations/alexa';
    }
  }

  readAllPrices(): Observable<AlexaResponse> {
    const payload: AlexaRequest = {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'ReadCurrentMarketPricesIntent'
        }
      }
    };
    return this.http.post<AlexaResponse>(this.baseUrl, payload);
  }

  readSingleAsset(asset: string): Observable<AlexaResponse> {
    const payload: AlexaRequest = {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'ReadSingleAssetIntent',
          slots: {
            asset: {
              name: 'asset',
              value: asset
            }
          }
        }
      }
    };
    return this.http.post<AlexaResponse>(this.baseUrl, payload);
  }

  launch(): Observable<AlexaResponse> {
    const payload: AlexaRequest = {
      request: {
        type: 'LaunchRequest'
      }
    };
    return this.http.post<AlexaResponse>(this.baseUrl, payload);
  }
}
