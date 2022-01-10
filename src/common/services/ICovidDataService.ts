import {CovidDataRow} from "../models/CovidDataRow";
import {CovidDataResponse} from "../models/CovidDataResponse";
import {TopCountriesResponse} from "../models/TopCountriesResponse";

export interface ICovidDataService {
  init(): Promise<void>;
  saveRows(date: string, rows: Array<CovidDataRow>): Promise<void>;
  getCovidData(fromDate: string, toDate: string, country: string): Promise<CovidDataResponse>;
  getTopCountries(fromDate: string, toDate: string, limit: number): Promise<TopCountriesResponse>;
}
