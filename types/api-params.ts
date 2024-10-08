import { Prisma } from '@prisma/client';
import { DateOrRangeValue } from '@/components/form/DateOrRangePicker';
import { ReactNode } from 'react';
import { SortDirection } from '@react-types/shared/src/collections';

/* prettier-ignore */
export type WhereInput<T> = T extends 'DeckArchetype' ? Prisma.DeckArchetypeWhereInput
                          : T extends 'Deck'          ? Prisma.DeckWhereInput
                          : T extends 'Event'         ? Prisma.EventWhereInput
                          : T extends 'Game'          ? Prisma.GameWhereInput
                          : T extends 'Match'         ? Prisma.MatchWhereInput
                          : T extends 'Tag'           ? Prisma.TagWhereInput
                          : T extends 'Format'        ? Prisma.FormatWhereInput
                          : T extends 'User'          ? Prisma.UserWhereInput
                          : never;

/* prettier-ignore */
export type OrderByInput<T> =   T extends 'DeckArchetype' ? Prisma.DeckArchetypeOrderByWithRelationInput
                              : T extends 'Deck'          ? Prisma.DeckOrderByWithRelationInput
                              : T extends 'Event'         ? Prisma.EventOrderByWithRelationInput
                              : T extends 'Game'          ? Prisma.GameOrderByWithRelationInput
                              : T extends 'Match'         ? Prisma.MatchOrderByWithRelationInput
                              : T extends 'Tag'           ? Prisma.TagOrderByWithRelationInput
                              : T extends 'Format'        ? Prisma.FormatOrderByWithRelationInput
                              : T extends 'User'          ? Prisma.UserOrderByWithRelationInput
                              : never;

export type SorterOption<T extends Prisma.ModelName> = {
  field: string;
  label: ReactNode | string;
  orderBy: (direction?: 'desc' | 'asc') => OrderByInput<T>;
  textValue?: string;
};

export type PrismaQueryApiParams<T extends Prisma.ModelName> = {
  where?: WhereInput<T>;
  orderBy?: OrderByInput<T>;
  skip?: number;
  take?: number;
};

export const createQueryApiParams = <T extends Prisma.ModelName>({
  where,
  orderBy,
  skip,
  take,
}: PrismaQueryApiParams<T>): string => {
  if (!where && !orderBy && skip === undefined && take === undefined) return '';
  const result: Partial<Record<keyof PrismaQueryApiParams<T>, string | undefined>> = {};

  if (where) result.where = JSON.stringify(where);
  if (orderBy) result.orderBy = JSON.stringify(orderBy);
  if (skip !== undefined) result.skip = skip.toString();
  if (take !== undefined) result.take = take.toString();

  return `?${new URLSearchParams(result).toString()}`;
};

export const parseQueryApiParamsForPrisma = <T extends Prisma.ModelName>(
  url: string,
  userId?: string,
): PrismaQueryApiParams<T> => {
  const u = new URL(url);

  const whereFromUrl = u.searchParams.get('where');
  const parsedWhere = whereFromUrl ? JSON.parse(whereFromUrl) : undefined;
  const whereClause = Prisma.validator<WhereInput<T>>()(parsedWhere);

  const orderByFromUrl = u.searchParams.get('orderBy');
  const parsedOrderBy = orderByFromUrl ? JSON.parse(orderByFromUrl) : undefined;
  const orderByClause = Prisma.validator<OrderByInput<T>>()(parsedOrderBy);

  const takeFromUrl = u.searchParams.get('take');
  const parsedTake = takeFromUrl ? parseInt(takeFromUrl) : undefined;

  const skipFromUrl = u.searchParams.get('skip');
  const parsedSkip = skipFromUrl ? parseInt(skipFromUrl) : undefined;

  return {
    where: userId ? { ...whereClause, userId: userId } : whereClause,
    orderBy: orderByClause,
    take: parsedTake,
    skip: parsedSkip,
  };
};

export const parseDateOrRangeValueToCondition = (i: DateOrRangeValue | undefined) => {
  if (!i) return undefined;
  if (i.type === 'date' && i.value) {
    return {
      gte: new Date(i.value),
    };
  } else if (i.type === 'range' && i.valueFrom && i.valueTo) {
    return {
      gte: new Date(i.valueFrom),
      lte: new Date(i.valueTo),
    };
  }
  return undefined;
};

export const parseStringToContainsCondition = (
  i: string | undefined,
): Prisma.StringFilter | undefined => {
  if (!i) return undefined;
  if (i.length > 0) {
    return {
      contains: i,
      mode: 'insensitive',
    };
  }
  return undefined;
};

export const transformTableSorterDirection = (input?: SortDirection): 'asc' | 'desc' =>
  input === 'ascending' ? 'asc' : 'desc';
