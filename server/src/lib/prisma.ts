// import { PrismaClient } from "../../generated/prisma/client";
// import { PrismaPg } from '@prisma/adapter-pg';


// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL
// });


// const prismaClientSingleton = () => {
//   return new PrismaClient(
//     { adapter }
//   )
// }

// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof prismaClientSingleton>
// } & typeof global;

// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// export default prisma


// if (process.env.NODE_ENV !== "production") {
//   globalThis.prismaGlobal = prisma;
// }


// server/src/lib/prisma.ts
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client'; // Ensure this path is correct
import 'dotenv/config';

// 1. Create the Pool using the URL from env
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ ERROR: DATABASE_URL is not defined in .env");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 2. Initialize the client with the adapter
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;