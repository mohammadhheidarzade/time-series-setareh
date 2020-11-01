import * as Highcharts from 'highcharts';
import { Component, Input, OnInit, Output } from '@angular/core';
import { TimeSeriesData } from './models/time-series-data';
import { ReplaySubject } from 'rxjs';

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

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    series: [{
      data: [1, 2, 3],
      type: 'line'
    }]
  };

  constructor() { }

  ngOnInit(): void {

  }

}
