import * as Highcharts from 'highcharts/highstock';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TimeSeriesData } from './models/time-series-data';
import {
  dataGroupingWithoutTime,
  dataGroupingWithTime,
  defaultMonths,
  defaultShortMonths,
  defaultWeekDays,
  months,
  rangeSelectorButtons,
  rangeSelectorButtonsTheme,
  shortMonths, weekDays
} from './models/constants';
import { ManageSeries } from './models/manage-series';
import { Play } from './models/play';
declare var JDate;
declare function require(addr: string): any;

@Component({
  selector: 'app-time-series',
  templateUrl: './time-series.component.html',
  styleUrls: ['./time-series.component.scss']
})
export class TimeSeriesComponent implements OnInit, OnChanges {


  @Input()
  public data: TimeSeriesData[] = [];
  @Input()
  public calendarType: 'fa' | 'en' = 'fa';
  @Input()
  public hasTime = true;
  @Output()
  public filter = new EventEmitter<{ minDate: Date, maxDate: Date }>();

  public highChart: Highcharts.Chart;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

  public playManager: Play;

  private manageSeries: ManageSeries;

  ngOnChanges(changes: SimpleChanges): void {
    this.createGraph();
  }

  ngOnInit(): void {
    this.createGraph();
  }

  private createGraph(): void {

    this.manageSeries = new ManageSeries(this, this.data, this.hasTime);

    this.manageGraph(this.manageSeries);

    this.playManager = new Play(this.highChart, this.manageSeries.minDate, this.manageSeries.maxDate);

    this.playButtonLocation();
  }

  private playButtonLocation(): void {
    const highchartcontainer = document.getElementsByClassName('highcharts-container')[0];
    const test = document.createElement('div');

    test.setAttribute('class', 'fas fa-play-circle button');
    test.setAttribute('style', 'left: 10px; top: 10px; z-index: 10;');

    highchartcontainer.appendChild(test);
  }

  private manageGraph(series: ManageSeries): void {

    require('highcharts/modules/map')(Highcharts);
    console.log(series);

    Highcharts.setOptions({
      lang: {
        months: this.calendarType === 'en' ? defaultMonths : months,
        shortMonths: this.calendarType === 'en' ? defaultShortMonths : shortMonths,
        weekdays: this.calendarType === 'en' ? defaultWeekDays : weekDays,
        rangeSelectorFrom: this.calendarType === 'en' ? 'From' : 'از',
        rangeSelectorTo: this.calendarType === 'en' ? 'To' : 'تا',
        rangeSelectorZoom: ''
      },
    });

    if (document.getElementById('container') === undefined) {
      return;
    }

    this.highChart = Highcharts.stockChart('container', {
      credits: {
        enabled: false,
      },
      navigator: {
        enabled: true,
        series: series.getNavigatorSeries().getSeries()
      },
      rangeSelector: {
        buttonTheme: rangeSelectorButtonsTheme,
        inputDateParser: (value) => {
          const currentDateClass = this.calendarType === 'fa' ? JDate : Date;
          const date = new currentDateClass(value);
          return date.getTime() - date.getTimezoneOffset() * 60 * 1000;
        },
        labelStyle: {
          color: 'silver',
          fontWeight: 'bold'
        },
        buttons: rangeSelectorButtons,
        inputStyle: {
          fontFamily: 'byekan'
        }
      },
      mapNavigation: {
        enableMouseWheelZoom: true,
      },
      plotOptions: {
        column: {
          stacking: 'normal',
        },
        series: {
          dataGrouping: this.hasTime ? dataGroupingWithTime : dataGroupingWithoutTime,
        }
      },
      chart: {
        zoomType: 'x',
      },
      time: {
        Date: this.calendarType === 'fa' ? JDate : Date,
        useUTC: true
      },
      series: (series.getHighChartSeries().getSeries()),
      xAxis: {
        minRange: 24 * 60 * 60 * 1000,
        minTickInterval: this.hasTime ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
        startOfWeek: this.calendarType === 'en' ? 1 : 6,
        events: {
          afterSetExtremes: (event) => this.changeExtremes(event),
        }
      },
      yAxis: {
        opposite: false,
        allowDecimals: false,
        zoomEnabled: false,

      },
      tooltip: {
        useHTML: true,
      },
      legend: {
        enabled: true,
        align: 'left',
        layout: 'vertical',
        verticalAlign: 'middle',
        itemStyle: {
          fontSize: '16px',
        },
        maxHeight: 200,
        useHTML: true,
        labelFormatter: function () {
          const imageAddress = 'http://icons.iconarchive.com/icons/visualpharm/must-have/256/Check-icon.png';
          const width = 15;
          const height = 15;

          // todo get image Address


          const image = `<img src=${imageAddress} width="${width}" height="${height}">`;
          return image
            + this.name;
        }
      }
    });
  }


  private changeExtremes(event): void {
    this.filter.emit({
      minDate: new Date(event.min),
      maxDate: new Date(event.max)
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
