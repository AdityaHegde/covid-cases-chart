import {connect, model, Mongoose} from "mongoose";
import {CovidDataMongooseSchema} from "../CovidDataMongooseSchema";
import {CovidDataRow} from "../../../common/models/CovidDataRow";
import {CovidData, fromCovidDataRow} from "../../../common/models/CovidData";
import {ICovidDataService} from "../../../common/services/ICovidDataService";
import {CovidDataResponse} from "../../../common/models/CovidDataResponse";

const CovidDataMongooseModel = model("CovidData", CovidDataMongooseSchema);

export class CovidDataMongoDBService implements ICovidDataService {
  private mongoose: Mongoose;

  public async init(): Promise<void> {
    this.mongoose = await connect("mongodb://localhost", {
      dbName: "covid-data",
    });
  }

  public async saveRows(date: string, rows: Array<CovidDataRow>) {
    const hasRow = await CovidDataMongooseModel.findOne({ date });
    if (hasRow) {
      await CovidDataMongooseModel.deleteMany({ date });
    }

    await CovidDataMongooseModel.bulkSave(
      rows.map(row => CovidDataMongoDBService.getModelFromData(date, row))
        .filter(record => record.provinceState && record.countryRegion && !isNaN(record.confirmed)),
    );
  }

  public async getCovidData(fromDate: string, toDate: string, country: string) {
    const resp: CovidDataResponse = { data: [], labels: [] };
    (await CovidDataMongooseModel.aggregate()
      .match({ countryRegion: country, date: { $gte: fromDate, $lte: toDate } })
      .group({ _id: { date: "$date" }, confirmed: { $sum: "$confirmed" } })
      .sort({ confirmed: 1 }).exec()).forEach((rec) => {
        resp.data.push(rec.confirmed);
        resp.labels.push(rec._id.date);
    });
    return resp;
  }

  private static getModelFromData(date: string, covidDataRow: CovidDataRow): any {
    const model = new CovidDataMongooseModel();
    fromCovidDataRow(model, date, covidDataRow);
    return model;
  }
}
