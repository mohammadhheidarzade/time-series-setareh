import { DataGroupingOptionsObject } from 'highcharts';

export const months = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
];

export const shortMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
];

export const weekDays = [
  'یکشنبه',
  'دوشنبه',
  'سه شنبه',
  'چهارشنبه',
  'پنج شنبه',
  'جمعه',
  'شنبه'
];

const groupPixelWidthConstant = 300;

export const dataGroupingWithTime: DataGroupingOptionsObject = {
  groupPixelWidth: groupPixelWidthConstant,
  approximation: 'sum',
  groupAll: true,
  units: [
    [
      'hour',
      [1]
    ],
    [
      'day',
      [1]
    ],
    [
      'month',
      [1]
    ],
    [
      'year',
      [1]
    ]
  ]
};

export const dataGroupingWithoutTime: DataGroupingOptionsObject = {
  groupPixelWidth: groupPixelWidthConstant,
  approximation: 'sum',
  groupAll: true,
  units: [
    [
      'day',
      [1]
    ],
    [
      'month',
      [1]
    ],
    [
      'year',
      [1]
    ]
  ]
};


export const colors = [
  '#264653',
  '#2a9d8f',
  '#e9c46a',
  '#f4a261',
  '#e76f51'
];

