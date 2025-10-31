import { Component, Input, ViewChild, ElementRef, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { MinuteChartData } from '../../data-access/chart-data.models';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-minute-chart',
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div class="chart-wrapper">
        <canvas #chartCanvas></canvas>
      </div>
      @if (loading) {
        <div class="chart-loading">
          <div class="spinner-border spinner-border-sm text-primary"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .chart-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1rem;
      margin: 1rem;
      margin-bottom: 1.5rem;
    }


    .chart-title {
      color: #333;
      font-weight: 600;
    }

    .chart-wrapper {
      position: relative;
      height: 250px;
      width: 100%;
    }

    .chart-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
    }
  `]
})
export class MinuteChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) 
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() chartData: MinuteChartData | null = null;
  @Input() loading = false;

  chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnChanges(): void {
    if (this.chartData && this.chart) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private initChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Preis USD',
          data: [],
          borderColor: '#000000ff',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: false  // X-Achse komplett ausblenden
          },
          y: {
            display: true,
            ticks: {
              callback: function(value) {
                return '$' + Number(value).toFixed(2);
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
    this.updateChart();
  }

  private updateChart(): void {
    if (!this.chart || !this.chartData) return;

    // Verwende alle verfügbaren Datenpunkte der letzten 6 Stunden (360 Minuten)
    const now = new Date();
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
    
    // Filtere Datenpunkte für die letzten 6 Stunden
    const recentPoints = this.chartData.dataPoints.filter(point => {
      const pointTime = new Date(point.timestamp);
      return pointTime >= sixHoursAgo && pointTime <= now;
    });

    // Sortiere nach Zeit (falls nicht schon sortiert)
    recentPoints.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Erstelle Labels und Daten aus allen verfügbaren Punkten
    const labels = recentPoints.map(point => {
      const date = new Date(point.timestamp);
      return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    });
    
    const data = recentPoints.map(point => point.price);

    // Fallback: Wenn weniger als 60 Punkte, fülle mit den letzten verfügbaren Punkten auf
    if (recentPoints.length < 60 && this.chartData.dataPoints.length > 0) {
      const allPoints = this.chartData.dataPoints.slice(-360); // Letzte 360 Punkte (6h)
      const allLabels = allPoints.map(point => {
        const date = new Date(point.timestamp);
        return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      });
      const allData = allPoints.map(point => point.price);
      
      this.chart.data.labels = allLabels;
      this.chart.data.datasets[0].data = allData;
    } else {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
    }

    this.chart.update('none');
  }


}