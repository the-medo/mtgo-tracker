import { DateValue, fromDate } from '@internationalized/date';
import { $Enums, Deck } from '@prisma/client';
import DeckServiceType = $Enums.DeckServiceType;

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

/*
  //https://www.moxfield.com/decks/NGXLX-zQk0KMgxziaUyc5g#paper
  //https://www.mtggoldfish.com/deck/6395126#paper
  //https://melee.gg/Decklist/View/381376
 */
export function parseDeckLink(
  link: string | undefined,
): Pick<Deck, 'service' | 'serviceDeckId' | 'link'> | false {
  if (!link) return false;

  // Patterns to match each service and extract deck IDs
  const patterns = [
    {
      regex: /https:\/\/www\.moxfield\.com\/decks\/([^#?]+)/,
      service: DeckServiceType.MOXFIELD,
    },
    {
      regex: /https:\/\/www\.mtggoldfish\.com\/deck\/(\d+)/,
      service: DeckServiceType.GOLDFISH,
    },
    {
      regex: /https:\/\/melee\.gg\/Decklist\/View\/(\d+)/,
      service: DeckServiceType.MELEEGG,
    },
  ];

  for (const pattern of patterns) {
    const match = link.match(pattern.regex);
    if (match && match[1]) {
      return {
        service: pattern.service,
        serviceDeckId: match[1],
        link: match[0],
      };
    }
  }

  // If no pattern matches, return false
  return false;
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
