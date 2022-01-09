import {CovidDataReadFarm} from "../data/reader/CovidDataReadFarm";

(async () => {
  const readFarm = new CovidDataReadFarm(__dirname + "/read-covid-csv-data-worker");
  await readFarm.readFiles(process.argv.slice(2));
  readFarm.stop();
})();
