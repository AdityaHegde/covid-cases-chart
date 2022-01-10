import {CSVReader} from "./CSVReader";
import {CovidDataRow} from "../../../common/models/CovidDataRow";
import {ICovidDataService} from "../../../common/services/ICovidDataService";
import {DateFormatUtils} from "../../../common/DateFormatUtils";

export class CovidDataReadWorker {
  private readonly covidDataService: ICovidDataService;

  constructor(covidDataService: ICovidDataService) {
    this.covidDataService = covidDataService;
  }

  public async init() {
    await this.covidDataService.init();
  }

  public async readCovidDataFile(filePath: string): Promise<void> {
    const csvReader = new CSVReader<Array<CovidDataRow>>();
    const savePromises = new Array<Promise<void>>();

    const date = DateFormatUtils.getDateFromFileName(filePath);

    console.log("Saving data for", date);

    for await (const rows of csvReader.read(filePath)) {
      savePromises.push(this.covidDataService.saveRows(date, rows));
    }

    await Promise.all(savePromises);
  }
}
