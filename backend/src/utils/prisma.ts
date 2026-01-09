import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const prisma = new PrismaClient({
  adapter: new PrismaNeon(sql),
});

export { prisma };
export default prisma;
