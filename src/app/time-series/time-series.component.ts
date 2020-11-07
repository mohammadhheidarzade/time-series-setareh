import * as Highcharts from 'highcharts/highstock';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TimeSeriesData } from './models/time-series-data';
import { dataGroupingWithoutTime, dataGroupingWithTime, defaultMonths, defaultShortMonths, defaultWeekDays, months, shortMonths, weekDays } from './models/constants';
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

    Highcharts.setOptions({
      lang: {
        months: this.calendarType === 'en' ? defaultMonths : months,
        shortMonths: this.calendarType === 'en' ? defaultShortMonths : shortMonths,
        weekdays: this.calendarType === 'en' ? defaultWeekDays : weekDays,
        rangeSelectorFrom: this.calendarType === 'en' ? 'From' : 'از',
        rangeSelectorTo: this.calendarType === 'en' ? 'To' : 'تا',
      },
    });

    this.highChart = Highcharts.stockChart('container', {
      credits: {
        enabled: false,
      },
      navigator: {
        enabled: true,
        series: series.getNavigatorSeries().getSeries()
      },
      rangeSelector: {
        buttonTheme: { // styles for the buttons
          fill: 'none',
          stroke: 'none',
          'stroke-width': 0,
          r: 8,
          style: {
            color: '#039',
            fontWeight: 'bold',
          },
          states: {
            hover: {
            },
            select: {
              fill: '#039',
              style: {
                color: 'white'
              }
            }
            // disabled: { ... }
          }
        },
        labelStyle: {
          color: 'silver',
          fontWeight: 'bold'
        },
        /* buttons: [
          {
            type: 'year',
            count: 1,
            text: 'adlfkaj;fd',
          },
          {
            type: 'ytd',
            count: 1,
            text: 'safskdfj'
          }
        ] */
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
        Date: this.calendarType === 'fa' ? JDate : Date
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
      legend: {
        enabled: true,
        align: 'left',
        layout: 'vertical',
        verticalAlign: 'middle',
        itemStyle: {
          fontSize: '16px',
        },
        maxHeight: 200
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
