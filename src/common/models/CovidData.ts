import {ConfirmedIdx, CountryRegionIdx, CovidDataRow, ProvinceStateIdx} from "./CovidDataRow";

export interface CovidData {
  date: string;
  provinceState: string;
  countryRegion: string;
  confirmed: number;
}

export function fromCovidDataRow(record: CovidData, date: string, covidRow: CovidDataRow) {
  record.date = date;
  record.provinceState = covidRow[ProvinceStateIdx];
  record.countryRegion = covidRow[CountryRegionIdx];
  record.confirmed = Number(covidRow[ConfirmedIdx]);
}
