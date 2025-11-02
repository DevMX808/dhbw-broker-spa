import { ApplicationConfig } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/auth/jwt-interceptor';
import { errorInterceptor } from './core/services/error.interceptor';
import { MARKET_DATA_PORT } from './features/market/data-access/market.port';
import { HttpMarketDataAdapter } from './features/market/data-access/http-market-data.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptor, errorInterceptor])
    ),
    { provide: MARKET_DATA_PORT, useClass: HttpMarketDataAdapter }
  ]
};
