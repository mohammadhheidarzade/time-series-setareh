import { dataGroupingWithoutTime, dataGroupingWithTime } from './constants';
import { HighchartSeries, Series } from './highchart-series';
import { TimeSeriesData } from './time-series-data';

export class ManageSeries {

  public minDate = -1;
  public maxDate = -1;

  constructor(private data: TimeSeriesData[], private hasTime: boolean) { }

  public getHighChartSeries(): HighchartSeries {
    const mapData = this.separateSeries();
    return new HighchartSeries(mapData);
  }

  private separateSeries(): Map<number, Series> {
    const mapData: Map<number, Series> = new Map<number, Series>();

    this.data.forEach(data => {

      this.setMinMaxDate(data.date);

      if (!mapData.has(data.elementId)) {

        mapData.set(data.elementId, {
          id: data.elementId,
          name: data.elementId + '',
          type: 'column',
          data: [],
          color: '#a20a0a',
          events: {
            legendItemClick: this.changeColor
          },
          dataGrouping: this.hasTime ? dataGroupingWithTime : dataGroupingWithoutTime,
        });
      }

      mapData.get(data.elementId).data.push([data.date.getTime(), data.instanceGuids.length]);
    });

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

  private changeColor(event: any): boolean {
    if (event.browserEvent.target.tagName === 'rect') {
      // todo
      return false;
    }
    return true;

  }
}
