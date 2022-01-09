import {CovidDataRow} from "../models/CovidDataRow";
import {CovidDataResponse} from "../models/CovidDataResponse";

export interface ICovidDataService {
  init(): Promise<void>;
  saveRows(date: string, rows: Array<CovidDataRow>): Promise<void>;
  getCovidData(fromDate: string, toDate: string, country: string): Promise<CovidDataResponse>;
}
