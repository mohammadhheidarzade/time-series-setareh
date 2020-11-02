var baseTicks = 621355968000000000; //Ticks from 1/1/1 to 1/1/1970 (the minDate that javascript accept)
var meanDiffTicks = 5000; //difference between c# ticks and js ticks

var dateTimeObject =
    {
        TicksMask: 0x3FFFFFFFFFFFFFFF,
        DaysPerYear: 365,
        DaysPer4Years: 365 * 4 + 1,
        DaysPer100Years: (365 * 4 + 1) * 25 - 1,
        DaysPer400Years: ((365 * 4 + 1) * 25 - 1) * 4 + 1,
        DaysTo1601: (((365 * 4 + 1) * 25 - 1) * 4 + 1) * 4,
        DaysToMonth365: [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365],
        DaysToMonth366: [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]
    };

var TicksPerMillisecond = 10000;
var TicksPerSecond = TicksPerMillisecond * 1000;
var TicksPerMinute = TicksPerSecond * 60;
var TicksPerHour = TicksPerMinute * 60;
var TicksPerDay = TicksPerHour * 24;

var DaysInUniformLengthCentury = 36525;
var SecondsPerMinute = 60;
var MinutesPerDegree = 60;
var MillisPerSecond = 1000;

var FullCircleOfArc = 360.0; // 360.0;
var HalfCircleOfArc = 180;
var TwelveHours = 0.5; // half a day
var MeanTropicalYearInDays = 365.242189;
var MeanSpeedOfSun = MeanTropicalYearInDays / FullCircleOfArc;
var Noon2000Jan01 = 730120.5;

var CurrentEra = 0;
var PersianEra = 1;

var DatePartYear = 0;
var DatePartDayOfYear = 1;
var DatePartMonth = 2;
var DatePartDay = 3;
var MonthsPerYear = 12;
var ApproximateHalfYear = 180;
var MaxCalendarYear = 9378;
var MaxCalendarMonth = 10;
var MaxCalendarDay = 13;

var MaxSeconds = 922337203685477000;
var MinSeconds = -922337203685477000;

var minTicks = 196037280000000000; //Ticks of 22/3/622
var maxTicks = 3155378975999999999; // Ticks for 31/12/9999

var PersianEpoch = 226895; //number of days from 1/1/1 to 22/3/622 the first day of shamsi calendar

var LongitudeSpring = 0.0;
var TwoDegreesAfterSpring = 2.0;

var StartOf1810 = GetNumberOfDays({ Year: 1810, Month: 1, Day: 1, Ticks: DateToTicks(1810, 1, 1) });
var StartOf1900Century = GetNumberOfDays({ Year: 1900, Month: 1, Day: 1, Ticks: DateToTicks(1900, 1, 1) });

var SecondsPerDay = 24 * 60 * 60;

var Coefficients1900to1987 = [-0.00002, 0.000297, 0.025184, -0.181133, 0.553040, -0.861938, 0.677066, -0.212591];
var Coefficients1800to1899 = [-0.000009, 0.003844, 0.083563, 0.865736, 4.867575, 15.845535, 31.332267, 38.291999, 28.316289, 11.636204, 2.043794];
var Coefficients1700to1799 = [8.118780842, -0.005092142, 0.003336121, -0.0000266484];
var Coefficients1620to1699 = [196.58333, -4.0675, 0.0219167];
var LambdaCoefficients = [280.46645, 36000.76983, 0.0003032];
var AnomalyCoefficients = [357.52910, 35999.05030, -0.0001559, -0.00000048];
var EccentricityCoefficients = [0.016708617, -0.000042037, -0.0000001236];
var Coefficients = [Angle(23, 26, 21.448), Angle(0, 0, -46.8150), Angle(0, 0, -0.00059), Angle(0, 0, 0.001813)];
var CoefficientsA = [124.90, -1934.134, 0.002063];
var CoefficientsB = [201.11, 72001.5377, 0.00057];
var DaysToMonth = [0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336, 366];

var EphemerisCorrectionTable = [
    // lowest year that starts algorithm, algorithm to use
    { _lowestYear: 2020, _algorithm: 'Default' },
    { _lowestYear: 1988, _algorithm: 'Year1988to2019' },
    { _lowestYear: 1900, _algorithm: 'Year1900to1987' },
    { _lowestYear: 1800, _algorithm: 'Year1800to1899' },
    { _lowestYear: 1700, _algorithm: 'Year1700to1799' },
    { _lowestYear: 1620, _algorithm: 'Year1620to1699' },
    { _lowestYear: -2147483648, _algorithm: 'Default' } // default must be last
];

function GetYear(time) {
    return (GetDatePart(time.Ticks, DatePartYear));
}

function GetMonth(time) {
    return (GetDatePart(time.Ticks, DatePartMonth));
}

function GetDayOfMonth(time) {
    return (GetDatePart(time.Ticks, DatePartDay));
}

function GetDatePart(ticks, part) {
    var NumDays;

    CheckTicksRange(ticks);

    NumDays = ticks / TicksPerDay + 1;

    var yearStart = PersianNewYearOnOrBefore(NumDays);
    var y = parseInt((Math.floor(((yearStart - PersianEpoch) / MeanTropicalYearInDays) + 0.5)) + 1);


    if (part == DatePartYear) {
        return y;
    }

    var newDate = ToDateTime(y, 1, 1, 0, 0, 0, 0, 1);
    var newDays = GetNumberOfDays(newDate);
    var ordinalDay = Math.round(NumDays - newDays);

    var ordinalDay = parseInt(NumDays - GetNumberOfDays(ToDateTime(y, 1, 1, 0, 0, 0, 0, 1)));

    if (part == DatePartDayOfYear) {
        return ordinalDay;
    }

    var m = parseInt(MonthFromOrdinalDay(ordinalDay));

    if (part == DatePartMonth) {
        return m;
    }

    var d = ordinalDay - DaysInPreviousMonths(m);

    if (part == DatePartDay) {
        return (d);
    }

    throw new Error("Exception");
}

function DaysInPreviousMonths(month) {
    --month; // months are one based but for calculations use 0 based
    return DaysToMonth[month];
}

function MonthFromOrdinalDay(ordinalDay) {
    var index = 0;
    while (ordinalDay > DaysToMonth[index])
        index++;

    return index;
}

function ToDateTime(year, month, day, hour, minute, second, millisecond, era) {
    // The year/month/era checking is done in GetDaysInMonth().
    var daysInMonth = GetDaysInMonth(year, month, era);
    if (day < 1 || day > daysInMonth) {
        throw new Error("date is not valid");
    }

    var lDate = GetAbsoluteDatePersian(year, month, day);

    if (lDate >= 0) {
        var ticks = lDate * TicksPerDay + TimeToTicks(hour, minute, second, millisecond);
        return DateTime(ticks);
    }
    else {
        throw new Error("Exception");
    }
}

function GetDaysInMonth(year, month, era) {

    CheckYearMonthRange(year, month, era);

    if ((month == MaxCalendarMonth) && (year == MaxCalendarYear)) {
        return MaxCalendarDay;
    }

    var daysInMonth = DaysToMonth[month] - DaysToMonth[month - 1];
    if ((month == MonthsPerYear) && !IsLeapYear(year, 0)) {
        --daysInMonth;
    }
    return daysInMonth;
}

function IsLeapYear(year, era) {
    CheckYearRange(year, era);

    if (year == MaxCalendarYear) {
        return false;
    }

    return (GetAbsoluteDatePersian(year + 1, 1, 1) - GetAbsoluteDatePersian(year, 1, 1)) == 366;
}

function GetAbsoluteDatePersian(year, month, day) {
    if (year >= 1 && year <= MaxCalendarYear && month >= 1 && month <= 12) {
        var ordinalDay = DaysInPreviousMonths(month) + day - 1; // day is one based, make 0 based since this will be the number of days we add to beginning of year below
        var approximateDaysFromEpochForYearStart = parseInt(MeanTropicalYearInDays * (year - 1));
        var yearStart = PersianNewYearOnOrBefore(PersianEpoch + approximateDaysFromEpochForYearStart + ApproximateHalfYear);
        yearStart += ordinalDay;
        return yearStart;
    }
    throw new Error();
}

function DaysInPreviousMonths(month) {
    --month;
    return DaysToMonth[month];
}

function CheckEraRange(era) {
    if (era != CurrentEra && era != PersianEra) {
        throw new Error("Era is not valid");
    }
}

function CheckYearRange(year, era) {
    CheckEraRange(era);
    if (year < 1 || year > MaxCalendarYear) {
        throw new Error("Year is not valid");
    }
}

function CheckYearMonthRange(year, month, era) {
    CheckYearRange(year, era);
    if (year == MaxCalendarYear) {
        if (month > MaxCalendarMonth) {
            throw new Error("Month is not valid");
        }
    }

    if (month < 1 || month > 12) {
        throw new Error("Month is not valid");
    }
}


function TimeToTicks(hour, minute, second, millisecond) {
    if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60) {
        if (millisecond < 0 || millisecond >= MillisPerSecond) {
            throw new Error("millisecond is not valid");
        }
        return TimeSpanTimeToTicks(hour, minute, second) + millisecond * TicksPerMillisecond;
    }
    throw new Error("Error");
}

//function DateToTicks(year, month, day) {
//    if (year >= 1 && year <= 9999 && month >= 1 && month <= 12) {
//        var days = IsLeapYear(year , 0) ? dateTimeObject.DaysToMonth366 : dateTimeObject.DaysToMonth365;
//        if (day >= 1 && day <= days[month] - days[month - 1]) {
//            var y = year - 1;
//            var n = y * 365 + y / 4 - y / 100 + y / 400 + days[month - 1] + day - 1;
//            return n * TicksPerDay;
//        }
//    }
//    throw new Error("ArgumentOutOfRange_BadYearMonthDay");
//}

function TimeSpanTimeToTicks(hour, minute, second) {
    // totalSeconds is bounded by 2^31 * 2^12 + 2^31 * 2^8 + 2^31,
    // which is less than 2^44, meaning we won't overflow totalSeconds.
    var totalSeconds = hour * 3600 + minute * 60 + second;
    if (totalSeconds > MaxSeconds || totalSeconds < MinSeconds)
        throw new Error("second is not valid");
    return totalSeconds * TicksPerSecond;
}

function PersianNewYearOnOrBefore(numberOfDays) {
    var date = numberOfDays;

    var approx = EstimatePrior(LongitudeSpring, MiddayAtPersianObservationSite(date));

    var lowerBoundNewYearDay = Math.floor(approx) - 1;
    var upperBoundNewYearDay = lowerBoundNewYearDay + 3; // estimate is generally within a day of the actual occurrance (at the limits, the error expands, since the calculations rely on the mean tropical year which changes...)
    var day = lowerBoundNewYearDay;
    for (; day != upperBoundNewYearDay; ++day) {
        var midday = MiddayAtPersianObservationSite(day);
        var l = Compute(midday);
        if ((LongitudeSpring <= l) && (l <= TwoDegreesAfterSpring)) {
            break;
        }
    }

    return day - 1;

}

function EstimatePrior(longitude, time) {
    var timeSunLastAtLongitude = time - (MeanSpeedOfSun * AsSeason(InitLongitude(Compute(time) - longitude)));
    var longitudeErrorDelta = InitLongitude(Compute(timeSunLastAtLongitude) - longitude);
    return Math.min(time, timeSunLastAtLongitude - (MeanSpeedOfSun * longitudeErrorDelta));
}

function AsSeason(longitude) {
    return (longitude < 0) ? (longitude + FullCircleOfArc) : longitude;
}

function InitLongitude(longitude) {
    return NormalizeLongitude(longitude + HalfCircleOfArc) - HalfCircleOfArc;
}

function NormalizeLongitude(longitude) {
    longitude = Reminder(longitude, FullCircleOfArc);
    if (longitude < 0) {
        longitude += FullCircleOfArc;
    }
    return longitude;
}

function Reminder(divisor, dividend) {
    var whole = Math.floor(divisor / dividend);
    return divisor - (dividend * whole);
}

function CheckTicksRange(ticks) {
    if (ticks < minTicks || ticks > maxTicks) {
        throw new Error("the time is not valid.");
    }
}

function Compute(time) {
    var julianCenturies = JulianCenturies(time);
    var lambda = 282.7771834
        + (36000.76953744 * julianCenturies)
        + (0.000005729577951308232 * SumLongSequenceOfPeriodicTerms(julianCenturies));

    var longitude = lambda + Aberration(julianCenturies) + Nutation(julianCenturies);
    return InitLongitude(longitude);
}

function JulianCenturies(moment) {
    var dynamicalMoment = moment + EphemerisCorrection(moment);
    return (dynamicalMoment - Noon2000Jan01) / DaysInUniformLengthCentury;
}

function EphemerisCorrection(time) {
    var year = GetGregorianYear(time);

    $.each(EphemerisCorrectionTable, function (i, item) {
        if (item._lowestYear <= year) {
            switch (item._algorithm) {
                case 'Default': return DefaultEphemerisCorrection(year);
                case 'Year1988to2019': return EphemerisCorrection1988to2019(year);
                case 'Year1900to1987': return EphemerisCorrection1900to1987(year);
                case 'Year1800to1899': return EphemerisCorrection1800to1899(year);
                case 'Year1700to1799': return EphemerisCorrection1700to1799(year);
                case 'Year1620to1699': return EphemerisCorrection1620to1699(year);
            }

            //break;
        }
    });

    return DefaultEphemerisCorrection(year);
}

function GetGregorianYear(numberOfDays) {
    var ticks = Math.min((Math.floor(numberOfDays) * TicksPerDay), maxTicks);
    var dateTime = DateTime(ticks);

    return dateTime.Year;
}

function GetNumberOfDays(date) {
    return date.Ticks / TicksPerDay;
}

//function GetTicks(date) {
//    var timeOffset = date.getTimezoneOffset();
//    var ticksOffset = timeOffset * 60 * 1000 * 10000;
//    var ticks = date.getTime() * 10000;

//    var curTicks = baseTicks + (ticks + ticksOffset);

//    return curTicks;
//}

function DefaultEphemerisCorrection(gregorianYear) {
    var january1stOfYear = GetNumberOfDays({ Year: gregorianYear, Month: 1, Day: 1, Ticks: DateToTicks(gregorianYear,1,1) });
    var daysSinceStartOf1810 = january1stOfYear - StartOf1810;
    var x = TwelveHours + daysSinceStartOf1810;
    return ((Math.pow(x, 2) / 41048480) - 15) / SecondsPerDay;
}

function EphemerisCorrection1988to2019(gregorianYear) {
    return (gregorianYear - 1933) / SecondsPerDay;
}

function EphemerisCorrection1900to1987(gregorianYear) {
    var centuriesFrom1900 = CenturiesFrom1900(gregorianYear);
    return PolynomialSum(Coefficients1900to1987, centuriesFrom1900);
}

function EphemerisCorrection1800to1899(gregorianYear) {
    var centuriesFrom1900 = CenturiesFrom1900(gregorianYear);
    return PolynomialSum(Coefficients1800to1899, centuriesFrom1900);
}

function EphemerisCorrection1700to1799(gregorianYear) {
    var yearsSince1700 = gregorianYear - 1700;
    return PolynomialSum(Coefficients1700to1799, yearsSince1700) / SecondsPerDay;
}

function EphemerisCorrection1620to1699(gregorianYear) {
    var yearsSince1600 = gregorianYear - 1600;
    return PolynomialSum(Coefficients1620to1699, yearsSince1600) / SecondsPerDay;
}

function CenturiesFrom1900(gregorianYear) {
    var july1stOfYear = GetNumberOfDays({ Year: gregorianYear, Month: 7, Day: 1, Ticks: DateToTicks(gregorianYear, 7, 1) });
    return (july1stOfYear - StartOf1900Century) / DaysInUniformLengthCentury;
}

function Angle(degrees, minutes, seconds) {
    return ((seconds / SecondsPerMinute + minutes) / MinutesPerDegree) + degrees;
}

function PolynomialSum(coefficients, indeterminate) {
    var sum = coefficients[0];
    var indeterminateRaised = 1;
    for (var i = 1; i < coefficients.length; i++) {
        indeterminateRaised *= indeterminate;
        sum += (coefficients[i] * indeterminateRaised);
    }

    return sum;
}


function SumLongSequenceOfPeriodicTerms(julianCenturies) {
    var sum = 0.0;
    sum += PeriodicTerm(julianCenturies, 403406, 270.54861, 0.9287892);
    sum += PeriodicTerm(julianCenturies, 195207, 340.19128, 35999.1376958);
    sum += PeriodicTerm(julianCenturies, 119433, 63.91854, 35999.4089666);
    sum += PeriodicTerm(julianCenturies, 112392, 331.2622, 35998.7287385);
    sum += PeriodicTerm(julianCenturies, 3891, 317.843, 71998.20261);
    sum += PeriodicTerm(julianCenturies, 2819, 86.631, 71998.4403);
    sum += PeriodicTerm(julianCenturies, 1721, 240.052, 36000.35726);
    sum += PeriodicTerm(julianCenturies, 660, 310.26, 71997.4812);
    sum += PeriodicTerm(julianCenturies, 350, 247.23, 32964.4678);
    sum += PeriodicTerm(julianCenturies, 334, 260.87, -19.441);
    sum += PeriodicTerm(julianCenturies, 314, 297.82, 445267.1117);
    sum += PeriodicTerm(julianCenturies, 268, 343.14, 45036.884);
    sum += PeriodicTerm(julianCenturies, 242, 166.79, 3.1008);
    sum += PeriodicTerm(julianCenturies, 234, 81.53, 22518.4434);
    sum += PeriodicTerm(julianCenturies, 158, 3.5, -19.9739);
    sum += PeriodicTerm(julianCenturies, 132, 132.75, 65928.9345);
    sum += PeriodicTerm(julianCenturies, 129, 182.95, 9038.0293);
    sum += PeriodicTerm(julianCenturies, 114, 162.03, 3034.7684);
    sum += PeriodicTerm(julianCenturies, 99, 29.8, 33718.148);
    sum += PeriodicTerm(julianCenturies, 93, 266.4, 3034.448);
    sum += PeriodicTerm(julianCenturies, 86, 249.2, -2280.773);
    sum += PeriodicTerm(julianCenturies, 78, 157.6, 29929.992);
    sum += PeriodicTerm(julianCenturies, 72, 257.8, 31556.493);
    sum += PeriodicTerm(julianCenturies, 68, 185.1, 149.588);
    sum += PeriodicTerm(julianCenturies, 64, 69.9, 9037.75);
    sum += PeriodicTerm(julianCenturies, 46, 8.0, 107997.405);
    sum += PeriodicTerm(julianCenturies, 38, 197.1, -4444.176);
    sum += PeriodicTerm(julianCenturies, 37, 250.4, 151.771);
    sum += PeriodicTerm(julianCenturies, 32, 65.3, 67555.316);
    sum += PeriodicTerm(julianCenturies, 29, 162.7, 31556.08);
    sum += PeriodicTerm(julianCenturies, 28, 341.5, -4561.54);
    sum += PeriodicTerm(julianCenturies, 27, 291.6, 107996.706);
    sum += PeriodicTerm(julianCenturies, 27, 98.5, 1221.655);
    sum += PeriodicTerm(julianCenturies, 25, 146.7, 62894.167);
    sum += PeriodicTerm(julianCenturies, 24, 110.0, 31437.369);
    sum += PeriodicTerm(julianCenturies, 21, 5.2, 14578.298);
    sum += PeriodicTerm(julianCenturies, 21, 342.6, -31931.757);
    sum += PeriodicTerm(julianCenturies, 20, 230.9, 34777.243);
    sum += PeriodicTerm(julianCenturies, 18, 256.1, 1221.999);
    sum += PeriodicTerm(julianCenturies, 17, 45.3, 62894.511);
    sum += PeriodicTerm(julianCenturies, 14, 242.9, -4442.039);
    sum += PeriodicTerm(julianCenturies, 13, 115.2, 107997.909);
    sum += PeriodicTerm(julianCenturies, 13, 151.8, 119.066);
    sum += PeriodicTerm(julianCenturies, 13, 285.3, 16859.071);
    sum += PeriodicTerm(julianCenturies, 12, 53.3, -4.578);
    sum += PeriodicTerm(julianCenturies, 10, 126.6, 26895.292);
    sum += PeriodicTerm(julianCenturies, 10, 205.7, -39.127);
    sum += PeriodicTerm(julianCenturies, 10, 85.9, 12297.536);
    sum += PeriodicTerm(julianCenturies, 10, 146.1, 90073.778);
    return sum;
}

function PeriodicTerm(julianCenturies, x, y, z) {
    return x * SinOfDegree(y + z * julianCenturies);
}

function SinOfDegree(degree) {
    return Math.sin(RadiansFromDegrees(degree));
}

function RadiansFromDegrees(degree) {
    return degree * Math.PI / 180;
}

function Aberration(julianCenturies) {
    return (0.0000974 * CosOfDegree(177.63 + (35999.01848 * julianCenturies))) - 0.005575;
}

function CosOfDegree(degree) {
    return Math.cos(RadiansFromDegrees(degree));
}

function Nutation(julianCenturies) {
    var a = PolynomialSum(CoefficientsA, julianCenturies);
    var b = PolynomialSum(CoefficientsB, julianCenturies);
    return (-0.004778 * SinOfDegree(a)) - (0.0003667 * SinOfDegree(b));
}

function MiddayAtPersianObservationSite(date) {
    return Midday(date, InitLongitude(52.5)); // 52.5 degrees east - longitude of UTC+3:30 which defines Iranian Standard Time
}

function Midday(date, longitude) {
    return AsLocalTime(date + TwelveHours, longitude) - AsDayFraction(longitude);
}

function AsLocalTime(apparentMidday, longitude) {
    // slightly inaccurate since equation of time takes mean time not apparent time as its argument, but the difference is negligible
    var universalTime = apparentMidday - AsDayFraction(longitude);
    return apparentMidday - EquationOfTime(universalTime);
}

function AsDayFraction(longitude) {
    return longitude / FullCircleOfArc;
}

function EquationOfTime(time) {
    var julianCenturies = JulianCenturies(time);
    var lambda = PolynomialSum(LambdaCoefficients, julianCenturies);
    var anomaly = PolynomialSum(AnomalyCoefficients, julianCenturies);
    var eccentricity = PolynomialSum(EccentricityCoefficients, julianCenturies);

    var epsilon = Obliquity(julianCenturies);
    var tanHalfEpsilon = TanOfDegree(epsilon / 2);
    var y = tanHalfEpsilon * tanHalfEpsilon;

    var dividend = ((y * SinOfDegree(2 * lambda))
        - (2 * eccentricity * SinOfDegree(anomaly))
        + (4 * eccentricity * y * SinOfDegree(anomaly) * CosOfDegree(2 * lambda))
        - (0.5 * Math.pow(y, 2) * SinOfDegree(4 * lambda))
        - (1.25 * Math.pow(eccentricity, 2) * SinOfDegree(2 * anomaly)));
    var divisor = 2 * Math.PI;
    var equation = dividend / divisor;

    // approximation of equation of time is not valid for dates that are many millennia in the past or future
    // thus limited to a half day
    return CopySign(Math.min(Math.abs(equation), TwelveHours), equation);
}

function Obliquity(julianCenturies) {
    return PolynomialSum(Coefficients, julianCenturies);
}

function TanOfDegree(degree) {
    return Math.tan(RadiansFromDegrees(degree));
}

function CopySign(value, sign) {
    return (IsNegative(value) == IsNegative(sign)) ? value : -value;
}

function IsNegative(value) {
    return Math.sign(value) == -1;
}






/////////////////DATETIME


function ConvertDateToTicks(date) {
    var timeOffset = date.getTimezoneOffset();
    var ticksOffset = timeOffset * 60 * 1000 * 10000;
    var curTicks = date.getTime() * 10000;

    var ticks = baseTicks + (curTicks + ticksOffset);

    return ticks;
}

//var dateTime = {
//    Year: d.getFullYear(),
//    Month: d.getMonth() + 1,
//    Day: d.getDate(),
//    Hour: d.getHours(),
//    Minute: d.getMinutes(),
//    Second: d.getSeconds(),
//    Ticks: ConvertDateToTicks(d)
//};

function DateTime(ticks) {
    var dateDate = ticks;

    return { Year: DateTime_GetDatePart(dateDate, DatePartYear), Month: DateTime_GetDatePart(dateDate, DatePartMonth), Hour: 0, Minute: 0, Second: 0, Ticks: ticks, Day: DateTime_GetDatePart(dateDate)  };
}

function DateTime_GetDatePart(dateData, part) {
    //var Mask = dateTimeObject.TicksMask >>> 0;
    //var InternalTicks = dateData & dateTimeObject.TicksMask;
    var InternalTicks = dateData;
    var ticks = InternalTicks;
    // n = number of days since 1/1/0001
    var n = parseInt(ticks / TicksPerDay);
    // y400 = number of whole 400-year periods since 1/1/0001
    var y400 = parseInt(n / dateTimeObject.DaysPer400Years);
    // n = day number within 400-year period
    n -= y400 * dateTimeObject.DaysPer400Years;
    // y100 = number of whole 100-year periods within 400-year period
    var y100 = parseInt(n / dateTimeObject.DaysPer100Years);
    // Last 100-year period has an extra day, so decrement result if 4
    if (y100 == 4) y100 = 3;
    // n = day number within 100-year period
    n -= y100 * dateTimeObject.DaysPer100Years;
    // y4 = number of whole 4-year periods within 100-year period
    var y4 = parseInt(n / dateTimeObject.DaysPer4Years);
    // n = day number within 4-year period
    n -= y4 * dateTimeObject.DaysPer4Years;
    // y1 = number of whole years within 4-year period
    var y1 = parseInt(n / dateTimeObject.DaysPerYear);
    // Last year has an extra day, so decrement result if 4
    if (y1 == 4) y1 = 3;
    // If year was requested, compute and return it
    if (part == DatePartYear) {
        return y400 * 400 + y100 * 100 + y4 * 4 + y1 + 1;
    }
    // n = day number within year
    n -= y1 * dateTimeObject.DaysPerYear;
    // If day-of-year was requested, return it
    if (part == DatePartDayOfYear) return n + 1;
    // Leap year calculation looks different from IsLeapYear since y1, y4,
    // and y100 are relative to year 1, not year 0
    var leapYear = y1 == 3 && (y4 != 24 || y100 == 3);
    var days = leapYear ? dateTimeObject.DaysToMonth366 : dateTimeObject.DaysToMonth365;
    // All months have less than 32 days, so n >> 5 is a good conservative
    // estimate for the month
    var m = parseInt(n >> 5 + 1);
    // m = 1-based month number
    while (n >= days[m]) m++;
    // If month was requested, return it
    if (part == DatePartMonth) return m;
    // Return 1-based day-of-month
    return n - days[m - 1] + 1;
}

function DateToTicks(year, month, day) {
    if (year >= 1 && year <= 9999 && month >= 1 && month <= 12) {
        var days = DateTime_IsLeapYear(year) ? dateTimeObject.DaysToMonth366 : dateTimeObject.DaysToMonth365;
        if (day >= 1 && day <= days[month] - days[month - 1]) {
            var y = parseInt(year - 1);
            var n = parseInt(y * 365 + parseInt(y / 4) - parseInt(y / 100) + parseInt(y / 400) + days[month - 1] + day - 1);
            return n * TicksPerDay;
        }
    }
    //throw "ArgumentOutOfRange_BadYearMonthDay";
}

function DateTime_IsLeapYear(year)
{
    if (year < 1 || year > 9999) {
        throw new Error("ArgumentOutOfRange_Year");
    }

    return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
}