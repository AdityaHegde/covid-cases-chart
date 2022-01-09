import {CSVReader} from "./CSVReader";
import {CovidDataRow} from "../../../common/models/CovidDataRow";
import {ICovidDataService} from "../../../common/services/ICovidDataService";

const CSV_FILE_PARSER = /(\d*)-(\d*)-(\d*)\.csv/;

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

    const [, month, day, year] = CSV_FILE_PARSER.exec(filePath);
    const date = `${year}-${month}-${day}`;

    console.log("Saving data for", date);

    for await (const rows of csvReader.read(filePath)) {
      savePromises.push(this.covidDataService.saveRows(date, rows));
    }

    await Promise.all(savePromises);
  }
}
