import { Component } from '@angular/core';
import { HeaderComponent } from '../../../features/header/header.component';

@Component({
  standalone: true,
  selector: 'app-assets-page',
  imports: [HeaderComponent],
  template: `
    <app-header [firstName]="firstName" [lastName]="lastName"></app-header>

    <div class="container mt-4">
      <h1>Meine Assets</h1>
      <p>Hier kannst du deine Assets verwalten.</p>
    </div>
  `
})
export class AssetsPageComponent {
  // Später kannst du hier echte Daten laden
  firstName = 'Max';
  lastName = 'Mustermann';
}
