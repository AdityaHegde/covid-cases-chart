import workerFarm, {Workers} from "worker-farm";
import {DateFormatUtils} from "../../../common/DateFormatUtils";

export class CovidDataReadFarm {
  private readonly workers: Workers;
  public constructor(worker: string) {
    this.workers = workerFarm({
      maxConcurrentCallsPerWorker: 5,
    }, require.resolve(worker), ["readCovidData", "updateNewCases"]);
  }

  public async readFiles(files: Array<string>) {
    await Promise.all(
      files.map(file => this.readFile(file))
    );
    await Promise.all(
      files.map(file => this.updateNewCases(file))
    );
  }

  public stop() {
    workerFarm.end(this.workers);
  }

  private readFile(file: string) {
    return new Promise((resolve, reject) => {
      this.workers.readCovidData(file, (err, resp) => {
        if (err) reject(err);
        else resolve(resp);
      });
    });
  }

  private updateNewCases(file: string) {
    const date = DateFormatUtils.getDateFromFileName(file);
    return new Promise((resolve, reject) => {
      this.workers.updateNewCases(date, (err, resp) => {
        if (err) reject(err);
        else resolve(resp);
      });
    });
  }
}
