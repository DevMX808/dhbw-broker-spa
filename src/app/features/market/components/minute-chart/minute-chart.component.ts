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
      <div class="chart-header">
        <h6 class="chart-title mb-0">{{ chartData?.symbol }} - Letzten 60 Minuten</h6>
      </div>
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
      margin-bottom: 1.5rem;
    }

    .chart-header {
      margin-bottom: 1rem;
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
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointRadius: 1,
          pointHoverRadius: 4
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
            display: true,
            ticks: {
              maxTicksLimit: 6
            }
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

    const labels = this.chartData.dataPoints.map(point => {
      const date = new Date(point.timestamp);
      return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    });
    
    const data = this.chartData.dataPoints.map(point => point.price);

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.update('none');
  }
}