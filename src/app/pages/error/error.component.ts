import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-error',
  template: `<div class="text-center text-muted">
    <h1 class="h3">Fehler</h1>
    <p>Es ist ein unerwarteter Fehler aufgetreten.</p>
  </div>`
})
export class ErrorComponent {}
