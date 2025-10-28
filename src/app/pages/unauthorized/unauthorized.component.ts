import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-unauthorized',
  template: `<div class="text-center text-muted">
    <h1 class="h3">401</h1>
    <p>Nicht berechtigt.</p>
  </div>`
})
export class UnauthorizedComponent {}
