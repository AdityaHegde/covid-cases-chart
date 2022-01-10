import {CovidDataReadWorker} from "../data/reader/CovidDataReadWorker";
import {waitUntil} from "../../common/asyncWait";
import {CovidDataMongoDBService} from "../data/services/CovidDataMongoDBService";

let dbConnected = false;
const service = new CovidDataMongoDBService();
const worker = new CovidDataReadWorker(service);

(async () => {
  await worker.init();
  dbConnected = true;
})();

module.exports.readCovidData = async function readCovidData(filePath: string, callback) {
  if (!dbConnected) await waitUntil(() => dbConnected);
  await worker.readCovidDataFile(filePath);
  callback();
}

module.exports.updateNewCases = async function updateNewCases(date: string, callback) {
  console.log("Updating new cases for", date);
  await service.updateNewCases(date);
  callback();
}
