import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './core/services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'dhbw-broker-web';
  health = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getHealth().subscribe({
      next: (response) => this.health = response,
      error: (err) => console.error('Error:', err)
    });
  }
}
