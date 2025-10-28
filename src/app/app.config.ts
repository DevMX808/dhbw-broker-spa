import { ApplicationConfig } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/auth/jwt-interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { MARKET_DATA_PORT } from './features/market/data-access/market.port';
import { MockMarketDataAdapter } from './features/market/data-access/mock-market-data.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptor, errorInterceptor])
    ),
    // Market data adapter (easily swappable)
    { provide: MARKET_DATA_PORT, useClass: MockMarketDataAdapter }
  ]
};
