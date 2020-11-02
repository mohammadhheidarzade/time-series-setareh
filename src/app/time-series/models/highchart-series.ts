export class HighchartSeries {
  constructor(private mapData: Map<number, Series>) { }

  public getSeries(): Series[] {
    const series = [];
    for (const value of this.mapData.values()) {
      series.push(value);
    }
    return series;
  }
}

export class Series {
  id: number;
  type: string;
  name: string;
  data: (number[])[];
  color: string;
  events?: any;
  dataGrouping: any;
}
