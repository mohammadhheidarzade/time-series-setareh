
import { Component, OnInit } from '@angular/core';
import { TimeSeriesData } from './time-series/models/time-series-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'time-series';

  data: TimeSeriesData[] = [];

  ngOnInit(): void {
    for (let i = 0; i < 26000; i++) {
      const dates = new Date(i * 60 * 60 * 1000);
      const elementIds = Math.floor(Math.random() * 3);
      const instanceGuidss = [];

      for(let i = 0; i < Math.floor(Math.random() * 10) + 1; i ++ ){
        instanceGuidss.push(i.toString());
      }
      this.data.push({
        date: dates,
        elementId: elementIds,
        instanceGuids: instanceGuidss
      });
    }
  }

}
