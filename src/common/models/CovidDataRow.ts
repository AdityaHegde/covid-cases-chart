export type CovidDataRow = [
  FIPS: string, Admin2: string, Province_State: string, Country_Region: string,
  Last_Update: string, Lat: string, Long: string,
  Confirmed: string, Deaths: string, Recovered: string, Active: string, Incident_Rate: string, Case_Fatality_Ratio: string,
];
export const FIPSIdx = 0;
export const CountyIdx = 1;
export const ProvinceStateIdx = 2;
export const CountryRegionIdx = 3;
export const ConfirmedIdx = 7;
