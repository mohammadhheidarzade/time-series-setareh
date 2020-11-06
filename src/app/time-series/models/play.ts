export class Play {

  public isPause = true;

  private speed = 360000;

  private speedLevel = 1;

  private baseRange = 24 * 60 * 60 * 1000;

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
    this.interval = setInterval(() => {
      let { min, max } = this.highChart.axes[0].getExtremes();

      if (min < this.minDate) {
        min = this.minDate;
      }
      const zoomLevel = (max - min) / this.baseRange;
      const finalSpeed = this.speed * zoomLevel * this.speedLevel;

      console.log(min, max, finalSpeed);

      if (!this.isPause && max + finalSpeed < this.maxDate) {
        this.highChart.axes[0].setExtremes(min + finalSpeed, max + finalSpeed, true, false);
      } else {
        this.isPause = !this.isPause;
        clearInterval(this.interval);
      }
    }, 10);
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
