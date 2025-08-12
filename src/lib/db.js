import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Test connection on startup
prisma.$connect()
  .then(() => console.log('✅ Prisma connected successfully'))
  .catch((error) => console.error('💥 Prisma connection failed:', error));