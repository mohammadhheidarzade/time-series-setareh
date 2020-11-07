import { SeriesLegendItemClickEventObject } from 'highcharts';
import { TimeSeriesComponent } from '../time-series.component';
import { colors, dataGroupingWithoutTime, dataGroupingWithTime } from './constants';
import { HighchartSeries } from './highchart-series';
import { TimeSeriesData } from './time-series-data';

export class ManageSeries {

  public minDate = -1;
  public maxDate = -1;

  constructor(private timeSeriesComponent: TimeSeriesComponent, private data: TimeSeriesData[], private hasTime: boolean) {
    this.setNullData();
  }

  private setNullData(): void {
    this.sortData();
    if (this.data.length === 0) {
      return;
    }

    const nullObjects: TimeSeriesData[] = [];

    for (let i = 0; i < this.data.length - 1; i += 1) {
      const current = this.data[i].date.getTime();
      const after = this.data[i + 1].date.getTime();

      for (let j = 0; i < (current - after) / 3600000; j++) {

        const nullObject = new TimeSeriesData();
        nullObject.elementId = this.data[i].elementId;
        nullObject.date = new Date(current + j * 3600000);
        nullObject.instanceGuids = null;

        nullObjects.push(nullObject);
      }
    }
    this.data = this.data.concat(nullObjects);
    this.sortData();
  }

  private sortData(): void {
    this.data.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });
  }

  public getHighChartSeries(): HighchartSeries {
    const mapData = this.separateSeries();
    return new HighchartSeries(mapData);
  }

  public getNavigatorSeries(): HighchartSeries {
    const mapData = this.getNavigatorData();
    return new HighchartSeries(mapData);
  }

  private getNavigatorData(): Map<number, Highcharts.SeriesOptionsType> {
    const mapDate: Map<number, number> = new Map<number, number>();

    this.data.forEach((data) => {
      if (!mapDate.has(data.date.getTime())) {
        mapDate.set(data.date.getTime(), 0);
      }

      if (data.instanceGuids !== null) {
        mapDate.set(data.date.getTime(), mapDate.get(data.date.getTime()) + data.instanceGuids.length);
      }
    });

    const mapData: Map<number, Highcharts.SeriesOptionsType> = new Map<number, Highcharts.SeriesOptionsType>();

    const tmpData = [];
    for (const [key, value] of mapDate) {
      tmpData.push([key, value]);
    }

    mapData.set(0, {
      id: 0 + '',
      name: '0',
      type: 'line',
      showInNavigator: true,
      data: tmpData,
      color: colors[0],
      events: {},
      dataGrouping: {},
    });

    return mapData;
  }

  private separateSeries(): Map<number, Highcharts.SeriesOptionsType> {
    const mapData: Map<number, Highcharts.SeriesOptionsType> = new Map<number, Highcharts.SeriesOptionsType>();
    const tmpMapData: Map<number, { data: number[][] }> = new Map<number, { data: number[][] }>();


    this.data.forEach(data => {
      this.setMinMaxDate(data.date);
      if (!tmpMapData.has(data.elementId)) {
        tmpMapData.set(data.elementId, { data: [] as number[][] });
      }

      if (data.instanceGuids !== null) {
        tmpMapData.get(data.elementId).data.push([data.date.getTime(), data.instanceGuids.length]);
      } else {
        tmpMapData.get(data.elementId).data.push([data.date.getTime(), null]);
      }
    });

    let i = 0;
    for (const [key, value] of tmpMapData) {
      const tmpI = i;
      mapData.set(key, {
        id: key + '',
        name: key + '',
        type: 'column',
        showInNavigator: false,
        data: value.data,
        color: colors[i % colors.length],
        events: {
          legendItemClick: (event) => this.changeColor(event, tmpI)
        },
        dataGrouping: this.hasTime ? dataGroupingWithTime : dataGroupingWithoutTime,
      });
      i++;
    }

    return mapData;
  }

  private setMinMaxDate(date: Date): void {
    if (this.minDate === -1) {
      this.minDate = date.getTime();
      return;
    }
    this.minDate = Math.min(this.minDate, date.getTime());
    this.maxDate = Math.max(this.maxDate, date.getTime());
  }

  private changeColor(event: SeriesLegendItemClickEventObject, seriesNumber: number): boolean {

    if ((event.browserEvent.target as any).tagName === 'rect') {





      this.timeSeriesComponent.highChart.series[seriesNumber].update({
        color: '#e9c46a',
      } as any);
      return false;
    }
    return true;

  }
}
