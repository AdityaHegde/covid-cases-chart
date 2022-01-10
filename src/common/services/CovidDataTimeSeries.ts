import {ICovidDataService} from "./ICovidDataService";
import {CovidDataResponse} from "../models/CovidDataResponse";
import {TimeSeriesCache} from "../time-series/TimeSeriesCache";

export class CovidDataTimeSeries {
  private readonly covidDataService: ICovidDataService;
  private readonly timeSeriesCaches = new Map<string, TimeSeriesCache>();

  public constructor(covidDataService: ICovidDataService) {
    this.covidDataService = covidDataService;
  }

  public async init() {
    await this.covidDataService.init();
  }

  public async getTimeSeries(fromDate: string, toDate: string, country: string): Promise<CovidDataResponse> {
    if (!this.timeSeriesCaches.has(country)) {
      this.timeSeriesCaches.set(country, new TimeSeriesCache(this.covidDataService, country));
    }
    return await this.timeSeriesCaches.get(country).getTimeSeries(fromDate, toDate);
  }
}
