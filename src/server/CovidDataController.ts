import {Application, Request, Response} from "express";
import {CovidDataMongoDBService} from "./data/services/CovidDataMongoDBService";
import {CovidDataTimeSeries} from "../common/services/CovidDataTimeSeries";

export class CovidDataController {
  private readonly covidDataTimeSeries: CovidDataTimeSeries;

  constructor(covidDataTimeSeries: CovidDataTimeSeries) {
    this.covidDataTimeSeries = covidDataTimeSeries;
  }

  public async init(app: Application) {
    await this.covidDataTimeSeries.init();
    app.get("/api/covid-data", (req: Request, res: Response) => this.getCovidData(req, res));
  }

  private async getCovidData(req: Request, res: Response) {
    res.header("Content-Type", "application/json");
    const data = await this.covidDataTimeSeries.getTimeSeries(
      req.query.from.toString(), req.query.to.toString(), req.query.country.toString());
    res.send(JSON.stringify(data));
    res.status(200);
  }
}
