import {DataProviderData, TestBase} from "@adityahegde/typescript-test-utils";
import {JestTestLibrary} from "@adityahegde/typescript-test-utils/dist/jest/JestTestLibrary";
import {TimeSeriesCache} from "../src/common/time-series/TimeSeriesCache";
import {ICovidDataService} from "../src/common/services/ICovidDataService";
import {CovidDataMongoDBService} from "../src/server/data/services/CovidDataMongoDBService";
import {jest, expect} from "@jest/globals";
import {CovidDataResponse} from "../src/common/models/CovidDataResponse";
import {DateFormatUtils, DAY} from "../src/common/DateFormatUtils";

@TestBase.Suite
@TestBase.TestLibrary(JestTestLibrary)
export class TimeSeriesCacheSpec extends TestBase {
  private service: ICovidDataService;
  private serviceMock: any;

  @TestBase.BeforeSuite()
  public setupSuite() {
    this.service = new CovidDataMongoDBService();
    this.serviceMock = jest.spyOn(this.service, "getCovidData")
      .mockImplementation((fromDate: string, toDate: string) =>
        TimeSeriesCacheSpec.getMockedResponse(fromDate, toDate));
  }

  @TestBase.BeforeEachTest()
  public setupTests() {
    jest.clearAllMocks();
  }

  public timeSeriesData(): DataProviderData<[
    Array<[from: string, to: string]>, Array<string>, Array<string>, Array<[from: string, to: string]>,
  ]> {
    return {
      subData: [{
        args: [
          [ ["2021-12-05", "2021-12-07"], ["2021-12-01", "2021-12-03"] ],
          ["2021-12-01", "2021-12-02", "2021-12-03"],
          ["2021-12-01", "2021-12-02", "2021-12-03", "2021-12-05", "2021-12-06", "2021-12-07"],
          [ ["2021-12-05", "2021-12-07"], ["2021-12-01", "2021-12-03"] ],
        ],
      }, {
        args: [
          [ ["2021-12-01", "2021-12-03"], ["2021-12-05", "2021-12-07"] ],
          ["2021-12-05", "2021-12-06", "2021-12-07"],
          ["2021-12-01", "2021-12-02", "2021-12-03", "2021-12-05", "2021-12-06", "2021-12-07"],
          [ ["2021-12-01", "2021-12-03"], ["2021-12-05", "2021-12-07"] ],
        ],
      }, {
        args: [
          [ ["2021-12-04", "2021-12-06"], ["2021-12-01", "2021-12-03"] ],
          ["2021-12-01", "2021-12-02", "2021-12-03"],
          ["2021-12-01", "2021-12-02", "2021-12-03", "2021-12-04", "2021-12-05", "2021-12-06"],
          [ ["2021-12-04", "2021-12-06"], ["2021-12-01", "2021-12-03"] ],
        ],
      }, {
        args: [
          [["2021-12-01", "2021-12-03"], ["2021-12-04", "2021-12-06"]],
          ["2021-12-04", "2021-12-05", "2021-12-06"],
          ["2021-12-01", "2021-12-02", "2021-12-03", "2021-12-04", "2021-12-05", "2021-12-06"],
          [["2021-12-01", "2021-12-03"], ["2021-12-04", "2021-12-06"]],
        ],
      },{
        args: [
          [ ["2021-12-03", "2021-12-06"], ["2021-12-01", "2021-12-04"] ],
          ["2021-12-01", "2021-12-02", "2021-12-03", "2021-12-04"],
          ["2021-12-01", "2021-12-02", "2021-12-03", "2021-12-04", "2021-12-05", "2021-12-06"],
          [ ["2021-12-03", "2021-12-06"], ["2021-12-01", "2021-12-02"] ],
        ],
      }, {
        args: [
          [ ["2021-12-01", "2021-12-04"], ["2021-12-03", "2021-12-06"] ],
          ["2021-12-03", "2021-12-04", "2021-12-05", "2021-12-06"],
          ["2021-12-01", "2021-12-02", "2021-12-03", "2021-12-04", "2021-12-05", "2021-12-06"],
          [ ["2021-12-01", "2021-12-04"], ["2021-12-05", "2021-12-06"] ],
        ],
      },{
        args: [
          [ ["2021-12-03", "2021-12-05"], ["2021-12-08", "2021-12-10"], ["2021-12-04", "2021-12-09"] ],
          ["2021-12-04", "2021-12-05", "2021-12-06", "2021-12-07", "2021-12-08", "2021-12-09"],
          [
            "2021-12-03", "2021-12-04", "2021-12-05", "2021-12-06",
            "2021-12-07", "2021-12-08", "2021-12-09", "2021-12-10",
          ],
          [ ["2021-12-03", "2021-12-05"], ["2021-12-08", "2021-12-10"], ["2021-12-06", "2021-12-07"] ],
        ],
      }, {
        args: [
          [ ["2021-12-03", "2021-12-05"], ["2021-12-08", "2021-12-10"], ["2021-12-02", "2021-12-11"] ],
          [
            "2021-12-02", "2021-12-03", "2021-12-04", "2021-12-05", "2021-12-06",
            "2021-12-07", "2021-12-08", "2021-12-09", "2021-12-10", "2021-12-11",
          ],
          [
            "2021-12-02", "2021-12-03", "2021-12-04", "2021-12-05", "2021-12-06",
            "2021-12-07", "2021-12-08", "2021-12-09", "2021-12-10", "2021-12-11",
          ],
          [
            ["2021-12-03", "2021-12-05"], ["2021-12-08", "2021-12-10"],
            ["2021-12-02", "2021-12-02"], ["2021-12-06", "2021-12-07"], ["2021-12-11", "2021-12-11"],
          ],
        ],
      }],
    };
  }

  @TestBase.Test("timeSeriesData")
  public async shouldReturnTimeSeries(
    dates: Array<[from: string, to: string]>,
    returnDates: Array<string>, fullDates: Array<string>,
    expectedFetchDates: Array<[from: string, to: string]>,
  ) {
    const timeSeriesCache = new TimeSeriesCache(this.service, "India");
    let resp: CovidDataResponse;
    for (const [from, to] of dates) {
      resp = await timeSeriesCache.getTimeSeries(from, to);
    }
    expect(resp.labels).toEqual(returnDates);
    expect(timeSeriesCache.getTimeSeriesDates()).toEqual(fullDates);

    for (let i = 0; i < expectedFetchDates.length; i++) {
      expect(this.serviceMock).toHaveBeenNthCalledWith(i+1, ...expectedFetchDates[i], "India");
    }
  }

  private static getMockedResponse(fromDate: string, toDate: string) {
    const resp: CovidDataResponse = { data: [], labels: [] };
    const fromDateNum = DateFormatUtils.getDateNumFromString(fromDate);
    const toDateNum = DateFormatUtils.getDateNumFromString(toDate);
    for (let i = fromDateNum; i <= toDateNum; i += DAY) {
      resp.labels.push(DateFormatUtils.formatDate(i));
      resp.data.push(i);
    }
    return Promise.resolve(resp);
  }
}
