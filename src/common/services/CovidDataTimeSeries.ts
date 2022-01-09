import {ICovidDataService} from "./ICovidDataService";
import {CovidDataResponse} from "../models/CovidDataResponse";

export class CovidDataTimeSeries {
  private readonly covidDataService: ICovidDataService;

  public constructor(covidDataService: ICovidDataService) {
    this.covidDataService = covidDataService;
  }

  public async init() {
    await this.covidDataService.init();
  }

  public async getTimeSeries(fromDate: string, toDate: string, country: string): Promise<CovidDataResponse> {
    return await this.covidDataService.getCovidData(fromDate, toDate, country);
  }
}
