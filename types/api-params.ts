import { Prisma } from '@prisma/client';

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
    where: whereClause,
    orderBy: orderByClause,
    take: parsedTake,
    skip: parsedSkip,
  };
};
