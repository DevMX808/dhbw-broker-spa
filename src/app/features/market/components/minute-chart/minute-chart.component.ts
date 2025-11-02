import { Component, Input, ViewChild, ElementRef, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { MinuteChartData } from '../../data-access/chart-data.models';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-minute-chart',
  imports: [CommonModule],
  templateUrl: './minute-chart.component.html',
  styleUrls: ['./minute-chart.component.scss']
})
export class MinuteChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartCanvas', { static: true })
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() chartData: MinuteChartData | null = null;
  @Input() loading = false;
  @Input() isMarketOpen = true;

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
          borderColor: '#c1121f',
          backgroundColor: 'rgba(193, 18, 31, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#c1121f',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            titleColor: '#e2e8f0',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(193, 18, 31, 0.5)',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              title: function(context: any) {
                const index = context[0].dataIndex;
                const timestamp = context[0].dataset.timestamps[index];
                if (timestamp) {
                  const date = new Date(timestamp);
                  return date.toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  });
                }
                return '';
              },
              label: function(context: any) {
                const value = context.parsed.y;
                return `Preis: $${value.toFixed(4)}`;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              display: true
            },
            ticks: {
              color: '#9ca3af',
              maxRotation: 0,
              autoSkipPadding: 50
            }
          },
          y: {
            display: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              display: true
            },
            ticks: {
              color: '#9ca3af',
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

    const now = new Date();
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

    const recentPoints = this.chartData.dataPoints.filter(point => {
      const pointTime = new Date(point.timestamp);
      return pointTime >= sixHoursAgo && pointTime <= now;
    });

    recentPoints.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const labels = recentPoints.map(point => {
      const date = new Date(point.timestamp);
      return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    });

    const data = recentPoints.map(point => point.price);
    const timestamps = recentPoints.map(point => point.timestamp);

    if (recentPoints.length < 60 && this.chartData.dataPoints.length > 0) {
      const allPoints = this.chartData.dataPoints.slice(-360);
      const allLabels = allPoints.map(point => {
        const date = new Date(point.timestamp);
        return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      });
      const allData = allPoints.map(point => point.price);
      const allTimestamps = allPoints.map(point => point.timestamp);

      this.chart.data.labels = allLabels;
      this.chart.data.datasets[0].data = allData;
      (this.chart.data.datasets[0] as any).timestamps = allTimestamps;
    } else {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      (this.chart.data.datasets[0] as any).timestamps = timestamps;
    }

    this.chart.update('none');
  }
}
