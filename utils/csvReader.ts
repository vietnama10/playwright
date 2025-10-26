import fs from 'fs';
import path from 'path';

/** Đọc file CSV test data */
export function readCSV(filePath: string): { [key: string]: string }[] {
  const absPath = path.resolve(filePath);
  const data = fs.readFileSync(absPath, 'utf8').trim().split('\n');
  const headers = data[0].split(',');
  return data.slice(1).map((line: string) => {
    const values = line.split(',');
    const record: { [key: string]: string } = {};
    headers.forEach((h: string, i: number) => (record[h.trim()] = values[i].trim()));
    return record;
  });
}
