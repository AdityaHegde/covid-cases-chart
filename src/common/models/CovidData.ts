import {ConfirmedIdx, CountryRegionIdx, CovidDataRow, FIPSIdx, ProvinceStateIdx} from "./CovidDataRow";

export interface CovidData {
  date: string;
  fips: string;
  county: string;
  provinceState: string;
  countryRegion: string;
  confirmedCases: number;
  newCases: number;
}

export function fromCovidDataRow(record: CovidData, date: string, covidRow: CovidDataRow) {
  record.date = date;
  record.fips = covidRow[FIPSIdx];
  record.county = covidRow[CountryRegionIdx];
  record.provinceState = covidRow[ProvinceStateIdx];
  record.countryRegion = covidRow[CountryRegionIdx];
  record.confirmedCases = Number(covidRow[ConfirmedIdx]);
}
