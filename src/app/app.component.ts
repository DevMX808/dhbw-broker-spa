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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.apiService.getAllHealth().subscribe({
      next: ([bffHealth, graphqlHealth]: [{ status: string }, { status: string }]) => {
        console.log('BFF Health:', bffHealth.status, new Date().toISOString());
        console.log('GraphQL Health:', graphqlHealth.status, new Date().toISOString());
      },
      error: (err ) => console.error('Health Fetch Error:', err)
    });
  }
}
