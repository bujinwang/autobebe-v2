import { PrismaClient } from '@prisma/client';

// Instantiate Prisma client
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Handle cleanup on application shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
}); 