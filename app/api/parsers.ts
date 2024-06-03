import { DateValue, fromDate } from '@internationalized/date';

export function parseString(
  s: string | null | undefined,
  allowEmptyString: boolean = false,
): string | undefined {
  if (!allowEmptyString && s === '') return undefined;
  if (s === null) return undefined;
  return s;
}

export function parseNumber(
  s: number | string | null | undefined,
  allowEmptyString: boolean = false,
): number | undefined {
  if (!allowEmptyString && s === '') return undefined;
  if (!s) return undefined;
  if (typeof s === 'number') return s;
  return parseFloat(s);
}

export function parseDate(
  s: string | null | undefined,
  allowEmptyString: boolean = false,
): Date | undefined {
  if (!allowEmptyString && s === '') return undefined;
  if (!s) return undefined;
  return new Date(s);
}

export type Stringify<T> = {
  [P in keyof T]: T[P] extends null ? null : T[P] extends undefined ? undefined : string;
};

/*

function isYYYYMMDDDateString(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export function parseObject<T>(o: Stringify<T>): Partial<T> {
  const result: Partial<T> = {};
  for (const key in o) {
    const typedKey = key as keyof T;
    const value = o[typedKey];
    if (value === null || value === undefined) continue;
    if (!isNaN(Number(value))) {
      // @ts-ignore
      result[typedKey] = Number(value);
    } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
      // @ts-ignore
      result[typedKey] = value.toLowerCase() === 'true';
    } else if (isYYYYMMDDDateString(value)) {
      // @ts-ignore
      result[typedKey] = new Date(value);
    } else {
      // @ts-ignore
      result[typedKey] = value;
    }
  }
  return result;
}
*/

/*

export function parseObject<T>(o: Stringify<T>): Partial<T> {
  let result: Partial<T> = {};
  for (let key in o) {
    let typedKey = key as keyof T;

    if (typeof result[typedKey] === 'string') {
      // @ts-ignore
      result[typedKey] = parseString(o[typedKey]);
    } else if (typeof result[typedKey] === 'number') {
      // @ts-ignore
      result[typedKey] = parseNumber(o[typedKey]);
    } else {
      //otherwise, its gonna be Date
      // @ts-ignore
      result[typedKey] = parseDate(o[typedKey]);
    }
  }
  return result;
}
*/
