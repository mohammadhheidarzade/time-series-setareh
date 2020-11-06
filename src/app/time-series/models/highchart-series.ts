export class HighchartSeries {
  constructor(private mapData: Map<number, Highcharts.SeriesOptionsType>) { }

  public getSeries(): Highcharts.SeriesOptionsType[] {
    const series: Highcharts.SeriesOptionsType[] = ([] as Highcharts.SeriesOptionsType[]);
    for (const value of this.mapData.values()) {
      series.push(value);
    }
    return series;
  }
}
