import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-not-found',
  template: `<div class="text-center text-muted">
    <h1 class="display-4">404</h1>
    <p>Seite nicht gefunden.</p>
  </div>`
})
export class NotFoundComponent {}
