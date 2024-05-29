import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export const prisma = new PrismaClient();

export const prismaAdapter = { adapter: PrismaAdapter(prisma) };
