import workerFarm, {Workers} from "worker-farm";

export class CovidDataReadFarm {
  private readonly workers: Workers;
  public constructor(worker: string) {
    this.workers = workerFarm({
      maxConcurrentCallsPerWorker: 5,
    }, require.resolve(worker));
  }

  public async readFiles(files: Array<string>) {
    await Promise.all(
      files.map(file => this.readFile(file))
    );
  }

  public stop() {
    workerFarm.end(this.workers);
  }

  private readFile(file: string) {
    return new Promise((resolve, reject) => {
      this.workers(file, (err, resp) => {
        if (err) reject(err);
        else resolve(resp);
      });
    });
  }
}
