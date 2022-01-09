import {FileReadResult, open} from "fs/promises";

const CHUNK_SIZE = 1024 * 1024;
const ROW_SEPARATOR_REGEX = /\n/;
const COLUMN_SEPARATOR_REGEX = /,/;

export class CSVReader<Rows extends Array<Array<string>>> {
  public async *read(filePath: string): AsyncGenerator<Rows> {
    const fd = await open(filePath, "r");
    const buffer = Buffer.alloc(CHUNK_SIZE);
    let readRes: FileReadResult<any>;
    let lastRow: Array<string>;

    do {
      readRes = await fd.read(buffer, 0, CHUNK_SIZE);
      if (readRes.bytesRead === 0) break;

      const rawRows = buffer.toString("utf8", 0, readRes.bytesRead);
      const rows = rawRows.split(ROW_SEPARATOR_REGEX).map(rawRow => rawRow.split(COLUMN_SEPARATOR_REGEX));

      if (lastRow?.length) rows[0] = [...lastRow, ...rows[0]];

      if (rows[rows.length - 1].length > 1 || rows[rows.length - 1][0] !== "") {
        lastRow = rows[rows.length - 1];
      } else {
        lastRow = null;
      }

      yield rows.slice(0, rows.length - 1) as any;
    } while (readRes.bytesRead > 0);

    if (lastRow?.length) yield [lastRow] as any;

    await fd.close();
  }
}
