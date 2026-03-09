import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Creates a Prisma client backed by the pg adapter (for serverless-friendly pooling).
const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

// Reuse one client in development to avoid hot-reload connection leaks.
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
