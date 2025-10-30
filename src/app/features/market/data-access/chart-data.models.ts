export interface ChartDataPoint {
  timestamp: string;
  price: number;
}

export interface MinuteChartData {
  symbol: string;
  dataPoints: ChartDataPoint[];
}