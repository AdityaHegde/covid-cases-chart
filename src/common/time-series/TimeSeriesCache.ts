import {DateFormatUtils, DAY} from "../DateFormatUtils";
import {ICovidDataService} from "../services/ICovidDataService";
import {CovidDataResponse} from "../models/CovidDataResponse";

interface MissingChunk {
  idx: number;
  startDate: string;
  endDate?: string;
}

export class TimeSeriesCache {
  private readonly covidDataService: ICovidDataService;
  private readonly country: string;
  private timeSeriesData = new Array<number>();
  private timeSeriesDates = new Array<string>();

  public getTimeSeriesDates() {
    return this.timeSeriesDates;
  }

  public constructor(covidDataService: ICovidDataService, country: string) {
    this.covidDataService = covidDataService;
    this.country = country;
  }

  public async getTimeSeries(fromDate: string, toDate: string) {
    const fromStart = this.binarySearch(fromDate, 0, this.timeSeriesDates.length - 1);
    const chunks = this.getMissingChunks(fromStart, fromDate, toDate);

    const responses = await Promise.all(
      chunks.map(chunk => this.covidDataService.getCovidData(chunk.startDate, chunk.endDate, this.country))
    );

    const newTimeSeriesData = this.timeSeriesData.slice(0, fromStart);
    const newTimeSeriesDates = this.timeSeriesDates.slice(0, fromStart);
    const covidDataResponse: CovidDataResponse = { data: [], labels: [] };
    const addChunkData = (chunkIdx: number) => {
      covidDataResponse.data.push(...responses[chunkIdx].data);
      newTimeSeriesData.push(...responses[chunkIdx].data);
      covidDataResponse.labels.push(...responses[chunkIdx].labels);
      newTimeSeriesDates.push(...responses[chunkIdx].labels);
    };
    const addCurrentData = (fromIdx: number, toIdx?: number) => {
      if (fromIdx === toIdx) return;
      const data = this.timeSeriesData.slice(fromIdx, toIdx);
      if (toIdx) covidDataResponse.data.push(...data);
      newTimeSeriesData.push(...data);
      const dates = this.timeSeriesDates.slice(fromIdx, toIdx);
      if (toIdx) covidDataResponse.labels.push(...dates);
      newTimeSeriesDates.push(...dates);
    };

    let chunkIdx = 0;
    let i = fromStart;
    for (; i < this.timeSeriesData.length && chunkIdx < chunks.length;) {
      if (chunks[chunkIdx].idx === i) {
        addChunkData(chunkIdx);
        chunkIdx++;
      } else {
        addCurrentData(i, chunks[chunkIdx].idx);
        i = chunks[chunkIdx].idx;
      }
    }

    if (chunkIdx < chunks.length) {
      addChunkData(chunkIdx);
    } else if (i < this.timeSeriesData.length) {
      let overlap = i;
      for (; this.timeSeriesDates[overlap] <= toDate; overlap++);
      addCurrentData(i, overlap);
      if (overlap < this.timeSeriesData.length) {
        addCurrentData(overlap);
      }
    }

    this.timeSeriesData = newTimeSeriesData;
    this.timeSeriesDates = newTimeSeriesDates;

    return covidDataResponse;
  }

  private getMissingChunks(fromStart: number, fromDate: string, toDate: string) {
    let curDateNum = DateFormatUtils.getDateNumFromString(fromDate);
    const toDateNum = DateFormatUtils.getDateNumFromString(toDate);

    const chunks = new Array<MissingChunk>();

    let i = fromStart;

    for (; curDateNum < toDateNum && i < this.timeSeriesDates.length; curDateNum += DAY, i++) {
      let dateNumInArray = DateFormatUtils.getDateNumFromString(this.timeSeriesDates[i]);
      if (dateNumInArray > curDateNum) {
        const chunk: MissingChunk = {
          idx: i, startDate: DateFormatUtils.formatDate(curDateNum),
        };
        curDateNum = (dateNumInArray - DAY) > toDateNum ? toDateNum : (dateNumInArray - DAY);
        chunk.endDate = DateFormatUtils.formatDate(curDateNum);
        chunks.push(chunk);
        curDateNum = dateNumInArray;
      }
    }

    if (curDateNum < toDateNum || (curDateNum === toDateNum && i === this.timeSeriesDates.length)) {
      chunks.push({ idx: i, startDate: DateFormatUtils.formatDate(curDateNum), endDate: toDate });
    }

    // console.log(chunks);

    return chunks;
  }

  private binarySearch(date: string, low: number, high: number) {
    if (low > high) return low;
    const mid = Math.round((low + high) / 2);
    if (this.timeSeriesDates[mid] === date) {
      return mid;
    } else if (this.timeSeriesDates[mid] > date) {
      return this.binarySearch(date, low, mid - 1);
    } else {
      return this.binarySearch(date, mid + 1, high);
    }
  }
}
