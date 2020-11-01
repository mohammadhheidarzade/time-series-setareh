export class TimeSeriesData {
  public date: Date;
  public elementId: number;
  public instanceGuids: string[] = [];

  constructor(dataItem?: any) {
    if (!dataItem) {
      return;
    }

    this.date = new Date(dataItem.Value);
    this.elementId = dataItem.ElementId;
    this.instanceGuids = [dataItem.InstanceGuid];
  }
}
