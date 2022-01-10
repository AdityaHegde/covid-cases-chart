import {connect, model, Mongoose} from "mongoose";
import {CovidDataMongooseSchema} from "../CovidDataMongooseSchema";
import {CovidDataRow} from "../../../common/models/CovidDataRow";
import {CovidData, fromCovidDataRow} from "../../../common/models/CovidData";
import {ICovidDataService} from "../../../common/services/ICovidDataService";
import {CovidDataResponse} from "../../../common/models/CovidDataResponse";
import {TopCountriesResponse} from "../../../common/models/TopCountriesResponse";
import {DateFormatUtils} from "../../../common/DateFormatUtils";

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
        .filter(record => record.countryRegion && !isNaN(record.confirmedCases)),
    );
  }

  public async updateNewCases(date: string) {
    const previousRecords = await CovidDataMongooseModel
      .find({ date: DateFormatUtils.getDayOffset(date, -1) });
    if (previousRecords.length === 0) return;

    const currentRecords = await CovidDataMongooseModel.find({ date });
    if (currentRecords.length === 0) return;

    await CovidDataMongooseModel.bulkSave(
      CovidDataMongoDBService.updateNewCasesFromTotalCases(previousRecords, currentRecords) as any,
    );
  }

  public async getCovidData(fromDate: string, toDate: string, country: string) {
    const resp: CovidDataResponse = { data: [], labels: [] };
    (await CovidDataMongooseModel.aggregate()
      .match({ countryRegion: country, date: { $gte: fromDate, $lte: toDate }, newCases: { $gt: 0 } })
      .group({ _id: "$date", newCases: { $sum: "$newCases" } })
      .sort({ _id: 1 }).exec()).forEach((rec) => {
        resp.data.push(rec.newCases);
        resp.labels.push(rec._id);
    });
    return resp;
  }

  public async getTopCountries(fromDate: string, toDate: string, limit: number): Promise<TopCountriesResponse> {
    return (await CovidDataMongooseModel.aggregate()
      .match({ date: { $gte: fromDate, $lte: toDate }, newCases: { $gt: 0 } })
      .group({ _id: "$countryRegion", newCases: { $sum: "$newCases" } })
      .sort({ newCases: -1 })
      .limit(limit).exec()).map((rec) => {
        return { newCases: rec.newCases, countryRegion: rec._id };
    });
  }

  private static getModelFromData(date: string, covidDataRow: CovidDataRow): any {
    const model = new CovidDataMongooseModel();
    fromCovidDataRow(model, date, covidDataRow);
    return model;
  }

  private static updateNewCasesFromTotalCases(previousRecords: Array<CovidData>, currentRecords: Array<CovidData>) {
    const getKey = (rec: CovidData) =>
      `${rec.countryRegion}_${rec.provinceState ?? ""}_${rec.countryRegion ?? ""}_${rec.fips ?? ""}`;

    const previousMap = new Map<string, CovidData>();
    previousRecords.forEach(prevRec => previousMap.set(getKey(prevRec), prevRec));

    return currentRecords.filter((curRec) => {
      const key = getKey(curRec);
      if (!previousMap.has(key)) return false;
      const prevRec = previousMap.get(key);
      if (!prevRec.confirmedCases) return false;
      curRec.newCases = curRec.confirmedCases - prevRec.confirmedCases;
      return true;
    });
  }
}
