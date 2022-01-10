import React, {useState} from "react";
import {CovidDataTimeSeries} from "../../common/services/CovidDataTimeSeries";
import {CovidDataClient} from "../CovidDataClient";
import {ChartFilter, ChartFilterType} from "./ChartFilter";
import {ChartComponent} from "./ChartComponent";
import {CovidDataResponse} from "../../common/models/CovidDataResponse";
import {TopCountries} from "./TopCountries";
import {TopCountriesResponse} from "../../common/models/TopCountriesResponse";

const covidDataClient = new CovidDataClient();
const covidDataTimeSeries = new CovidDataTimeSeries(covidDataClient);

export function CovidCasesChart() {
  const [covidData, setCovidData] = useState<CovidDataResponse>({ data: [], labels: [] });
  const [topCountries, setTopCountries] = useState<TopCountriesResponse>([]);
  const [loading, setLoading] = useState(false);

  const onFilter = async (filter: ChartFilterType) => {
    setLoading(true);
    const [newCovidData, newTopCountries] = await Promise.all([
      covidDataTimeSeries.getTimeSeries(filter.from, filter.to, filter.country),
      covidDataClient.getTopCountries(filter.from, filter.to),
    ]);
    setCovidData(newCovidData);
    setTopCountries(newTopCountries);
    setLoading(false);
  };

  return (
    <>
      <ChartFilter onFilter={onFilter} loading={loading} />
      <ChartComponent covidData={covidData} />
      <TopCountries topCountries={topCountries} />
    </>
  );
}
