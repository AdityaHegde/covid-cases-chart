import {ICovidDataService} from "../common/services/ICovidDataService";
import {CovidDataRow} from "../common/models/CovidDataRow";
import {CovidDataResponse} from "../common/models/CovidDataResponse";

export class CovidDataClient implements ICovidDataService {
  public async getCovidData(fromDate: string, toDate: string, country: string): Promise<CovidDataResponse> {
    const fetchResp = await fetch(`/api/covid-data/?from=${fromDate}&to=${toDate}&country=${country}`);
    if (fetchResp.status >= 400) throw new Error(fetchResp.statusText);
    return fetchResp.json();
  }

  public init(): Promise<void> {
    return Promise.resolve(undefined);
  }
  public saveRows(date: string, rows: Array<CovidDataRow>): Promise<void> {
    return Promise.resolve(undefined);
  }
}
