
import { Component, OnInit } from '@angular/core';
import { TimeSeriesData } from './time-series/models/time-series-data';
import { realData } from './time-series/read-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'time-series';

  data: TimeSeriesData[] = [];

  ngOnInit(): void {
    this.data3();
  }

  data1(): void {
    const numberOfData = 1000;

    const tmpData = [];

    for (let i = 0; i < numberOfData; i++) {

      const dates = new Date(i * 60 * 60 * 1000);
      const elementIds = Math.floor(Math.random() * 3);
      const instanceGuidss = [];

      for (let j = 0; j < Math.floor(Math.random() * 500) + 1; j++) {
        instanceGuidss.push(j.toString());
      }
      tmpData.push({
        date: dates,
        elementId: elementIds,
        instanceGuids: instanceGuidss
      });
    }

    this.data = tmpData;
  }

  data2(): void {
    const numberOfData = 500;

    const maxDate = 26000 * 60 * 60 * 1000;

    const tmpData = [];

    for (let i = 0; i < numberOfData; i++) {
      const dates = new Date(Math.floor(Math.random() * maxDate));
      const elementIds = Math.floor(Math.random() * 3);
      const instanceGuidss = [];

      for (let j = 0; j < Math.floor(Math.random() * 500) + 1; j++) {
        instanceGuidss.push(j.toString());
      }
      tmpData.push({
        date: dates,
        elementId: elementIds,
        instanceGuids: instanceGuidss
      });
    }

    this.data = tmpData;
  }

  data3(): void {
    for (const data of realData) {
      data.date = new Date(data.date) as any;
    }

    const dataTmp = [];

    for (const data of realData) {

      dataTmp.push({
        elementId: 1,
        date: data.date,
        instanceGuids: data.instanceGuids
      });
      dataTmp.push({
        elementId: 2,
        date: data.date,
        instanceGuids: data.instanceGuids
      });
      dataTmp.push({
        elementId: 3,
        date: data.date,
        instanceGuids: data.instanceGuids
      });
      dataTmp.push({
        elementId: 4,
        date: data.date,
        instanceGuids: data.instanceGuids
      });

    }

    this.data = dataTmp;

  }


  getFilter(event): void {
    // console.log('slm', event);
  }


}
