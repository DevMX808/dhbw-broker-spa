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
  health: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getHealth().subscribe({
      next: (response) => this.health = response.status,
      error: (err) => {
        console.error('Error:', err);
        this.health = 'Error fetching health';
      }
    });
  }
}
