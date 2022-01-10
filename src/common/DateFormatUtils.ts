export const DAY = 24 * 60 * 60 * 1000;
export const CSV_FILE_PARSER = /(\d*)-(\d*)-(\d*)\.csv$/;

export class DateFormatUtils {
  public static getDateNumFromString(dateStr: string): number {
    return new Date(`${dateStr} UTC`).getTime();
  }

  public static formatDate(dateNum: number): string {
    const date = new Date(dateNum);
    return `${date.getFullYear()}-${this.padNumber(date.getMonth() + 1)}-${this.padNumber(date.getDate())}`;
  }

  public static getDayOffset(dateStr: string, offset: number): string {
    return this.formatDate(
      this.getDateNumFromString(dateStr) + DAY * offset,
    );
  }

  public static getDateFromFileName(filePath: string): string {
    const [, month, day, year] = CSV_FILE_PARSER.exec(filePath);
    return `${year}-${month}-${day}`;
  }

  private static padNumber(num: number): string {
    return num < 10 ? `0${num}` : num + "";
  }
}
