import {Application, Router, Request, Response} from "express";
import {CovidDataTimeSeries} from "../common/services/CovidDataTimeSeries";
import {ICovidDataService} from "../common/services/ICovidDataService";

const TOP_COUNTRIES_COUNT = 10;

export class CovidDataController {
  private readonly covidDataService: ICovidDataService;
  private readonly covidDataTimeSeries: CovidDataTimeSeries;

  constructor(covidDataService: ICovidDataService, covidDataTimeSeries: CovidDataTimeSeries) {
    this.covidDataService = covidDataService;
    this.covidDataTimeSeries = covidDataTimeSeries;
  }

  public async init(app: Application) {
    await this.covidDataTimeSeries.init();
    const router = Router();
    router.get("/covid-data", (req: Request, res: Response) => this.getCovidData(req, res));
    router.get("/top-countries", (req: Request, res: Response) => this.getTopCountries(req, res));
    app.use("/api", router);
  }

  private async getCovidData(req: Request, res: Response) {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(
      await this.covidDataTimeSeries.getTimeSeries(
        req.query.from.toString(), req.query.to.toString(), req.query.country.toString())
    ));
    res.status(200);
  }

  private async getTopCountries(req: Request, res: Response) {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(
      await this.covidDataService.getTopCountries(
        req.query.from.toString(), req.query.to.toString(), TOP_COUNTRIES_COUNT)
    ));
    res.status(200);
  }
}
