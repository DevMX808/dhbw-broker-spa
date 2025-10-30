import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-assets-page',
  imports: [],
  template: `
    <div class="container mt-4">
      <h1>Meine Assets</h1>
      <p>Hier kannst du deine Assets verwalten.</p>
    </div>
  `
})
export class AssetsPageComponent {
  firstName = 'Max';
  lastName = 'Mustermann';
}
