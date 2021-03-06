export class Play {

  public isPause = true;

  private speed = 1.5 * 60 * 60 * 1000;

  private speedLevel = 1;

  private baseRange = 24 * 60 * 60 * 1000 / 5;

  private interval;

  constructor(
    private highChart: Highcharts.Chart,
    private minDate: number,
    private maxDate: number) { }

  public playPause(): void {
    if (this.isPause) {
      this.play();
    } else {
      this.pause();
    }
    this.isPause = !this.isPause;
  }

  private play(): void {

    const period = 10;

    this.interval = setInterval(() => {
      let { min, max } = this.highChart.axes[0].getExtremes();

      if (min < this.minDate) {
        min = this.minDate;
      }
      const zoomLevel = (max - min) / this.baseRange;
      const finalSpeed = this.speed * zoomLevel * this.speedLevel / (1000 / period);

      if (!this.isPause && max + finalSpeed < this.maxDate) {
        // console.log(max - min);

        this.highChart.axes[0].setExtremes(min + finalSpeed, max + finalSpeed, true, false);
      } else {
        this.isPause = !this.isPause;
        clearInterval(this.interval);
      }
    }, period);
  }

  private pause(): void {
    clearInterval(this.interval);
  }

  public speedHigh(): void {
    if (this.speedLevel !== 1.5) {
      this.speedLevel *= 1.5;
    }
  }

  public speedLow(): void {
    if (this.speedLevel !== 2 / 3) {
      this.speedLevel *= (2 / 3);
    }
  }

}
