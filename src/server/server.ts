import express from "express";
import {CovidDataController} from "./CovidDataController";
import {CovidDataMongoDBService} from "./data/services/CovidDataMongoDBService";
import {CovidDataTimeSeries} from "../common/services/CovidDataTimeSeries";

const app = express();

(async () => {
  await new CovidDataController(new CovidDataTimeSeries(new CovidDataMongoDBService())).init(app);
  app.use(express.static(__dirname + "/../../dist/public"));
  app.listen(8080, () => {
    console.log("App started at", 8080);
  });
})();
