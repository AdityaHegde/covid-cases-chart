import {CovidDataReadWorker} from "../data/reader/CovidDataReadWorker";
import {waitUntil} from "../../common/asyncWait";
import {CovidDataMongoDBService} from "../data/services/CovidDataMongoDBService";

let dbConnected = false;
let worker: CovidDataReadWorker;

(async () => {
  worker = new CovidDataReadWorker(new CovidDataMongoDBService());
  await worker.init();
  dbConnected = true;
})();

module.exports = async function readCovidData(filePath: string, callback) {
  if (!dbConnected) await waitUntil(() => dbConnected);
  worker.readCovidDataFile(filePath).then(callback);
}
