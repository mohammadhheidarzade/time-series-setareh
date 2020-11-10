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

export const defaultMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
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

export const defaultShortMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
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

export const defaultWeekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
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

export const rangeSelectorButtons: Highcharts.RangeSelectorButtonsOptions[] = [{
  type: 'month',
  count: 1,
  text: 'یک ماه اخیر'
}, {
  type: 'month',
  count: 3,
  text: 'سه ماه اخیر'
}, {
  type: 'month',
  count: 6,
  text: 'شش ماه اخیر'
}, {
  type: 'ytd',
  text: 'سال پایانی'
}, {
  type: 'year',
  count: 1,
  text: 'یک سال اخیر'
}, {
  type: 'all',
  text: 'کل'
}];


export const rangeSelectorButtonsTheme: Highcharts.SVGAttributes = {
  width: null,
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
  }

};
