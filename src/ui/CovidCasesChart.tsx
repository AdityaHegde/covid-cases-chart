import React, {useState} from "react";
import {CovidDataTimeSeries} from "../common/services/CovidDataTimeSeries";
import {CovidDataClient} from "./CovidDataClient";
import {ChartFilter, ChartFilterType} from "./ChartFilter";
import {ChartComponent} from "./ChartComponent";
import {CovidDataResponse} from "../common/models/CovidDataResponse";

const covidDataTimeSeries = new CovidDataTimeSeries(new CovidDataClient());

export function CovidCasesChart() {
  const [covidData, setCovidData] = useState<CovidDataResponse>({ data: [], labels: [] });
  const [loading, setLoading] = useState(false);

  const onFilter = async (filter: ChartFilterType) => {
    setLoading(true);
    setCovidData(await covidDataTimeSeries.getTimeSeries(filter.from, filter.to, filter.country));
    setLoading(false);
  };

  return (
    <>
      <ChartFilter onFilter={onFilter} loading={loading} />
      <ChartComponent covidData={covidData} />
    </>
  );
}
