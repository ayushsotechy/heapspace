import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { problems } from "./data/problems";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Neon adapter (REQUIRED when engineType = 'client')
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

// Prisma Client with adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Ensure admin exists
  const admin = await prisma.admin.upsert({
    where: { email: "admin@local.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@local.com",
      password: "admin123",
    },
  });

  // 2. Insert problems + test cases
  for (const p of problems) {
    await prisma.problem.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        difficulty: p.difficulty,
        constraints: p.constraints,
        adminId: admin.id,
        testCases: {
          create: p.testCases,
        },
      },
    });
  }

  console.log("✅ Database seeded successfully");
}

// Run
main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
