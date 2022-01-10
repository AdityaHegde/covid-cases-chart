import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  TimeSeriesScale,
  Legend,
  Title,
  Tooltip,
} from "chart.js";
import {CovidDataResponse} from "../../common/models/CovidDataResponse";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  TimeSeriesScale,
  Legend,
  Title,
  Tooltip,
);

export function ChartComponent({covidData}: {covidData: CovidDataResponse}) {
  return (
    <Line data={{
      labels: covidData.labels,
      datasets: [{
        label: "Confirmed Cases",
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        data: covidData.data,
      }]
    }} style={{maxHeight: "500px"}} />
  );
}
