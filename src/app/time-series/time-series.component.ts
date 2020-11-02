import * as Highcharts from 'highcharts/highstock';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TimeSeriesData } from './models/time-series-data';
import { ReplaySubject } from 'rxjs';
import { months, shortMonths, weekDays } from './models/constants';
import { ManageSeries } from './models/manage-series';
import { Series } from './models/highchart-series';
import { Play } from './models/play';

declare var JDate;
declare function require(addr: string): any;

@Component({
  selector: 'app-time-series',
  templateUrl: './time-series.component.html',
  styleUrls: ['./time-series.component.scss']
})
export class TimeSeriesComponent implements OnInit {


  @Input()
  public data: TimeSeriesData[] = [];
  @Input()
  public calendarType: 'fa' | 'en' = 'fa';
  @Input()
  public hasTime = true;
  @Output()
  public filter = new ReplaySubject<{ minDate: Date, maxDate: Date }>();

  private highChart: Highcharts.Chart;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

  private playManager: Play;

  constructor() {
  }

  ngOnInit(): void {

    const manageSeries = new ManageSeries(this.data, this.hasTime);

    const highchartSeries = manageSeries.getHighChartSeries();

    this.manageGraph(highchartSeries.getSeries());

    this.playManager = new Play(this.highChart, manageSeries.minDate, manageSeries.maxDate);
  }


  private manageGraph(series: Series[]): void {

    Highcharts.setOptions({
      lang: {
        months: (months),
        shortMonths: (shortMonths),
        weekdays: (weekDays),
      },
    });
    require('highcharts/modules/map')(Highcharts);
    this.highChart = Highcharts.stockChart('container', {
      credits: {
        enabled: false,
      },
      mapNavigation: {
        enableMouseWheelZoom: true,
      },
      plotOptions: {
        column: {
          stacking: 'normal',
        }
      },
      chart: {
        panning: {
          enabled: false
        },
        zoomType: 'x',
        zoomKey: 'shift'
      },
      time: {
        Date: this.calendarType === 'fa' ? JDate : Date
      },
      series: (series as any),
      xAxis: {
        minRange: 14400000,
        startOfWeek: 6,
      },
      legend: {
        enabled: true,
        align: 'left',
        layout: 'vertical',
        verticalAlign: 'middle',
        itemStyle: {
          fontSize: '16px',
        }
      }
    });
  }

  playPause(): void {
    this.playManager.playPause();
  }

  speedHigh(): void {
    this.playManager.speedHigh();
  }

  speedLow(): void {
    this.playManager.speedLow();
  }

}
